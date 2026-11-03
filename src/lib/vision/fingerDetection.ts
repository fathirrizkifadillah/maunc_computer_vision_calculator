import { FingerStates } from '../../types/gesture';
import {
  HandLandmarks,
  LANDMARK_INDEX,
  calculateAngle,
  distance3D,
} from './landmarkProcessor';

export interface FingerDetectionResult {
  states: FingerStates;
  isAmbiguous: boolean;
  confidence: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    pinky: number;
  };
}

/**
 * Normalizes palm scale based on distance between wrist (0) and middle MCP (9).
 */
export function getPalmScale(landmarks: HandLandmarks): number {
  const wrist = landmarks[LANDMARK_INDEX.WRIST];
  const middleMcp = landmarks[LANDMARK_INDEX.MIDDLE_MCP];
  return Math.max(0.01, distance3D(wrist, middleMcp));
}

/**
 * Evaluates whether an individual long finger (Index, Middle, Ring, Pinky) is open.
 */
function evaluateLongFinger(
  landmarks: HandLandmarks,
  mcpIdx: number,
  pipIdx: number,
  dipIdx: number,
  tipIdx: number,
  palmScale: number,
): { isOpen: boolean; score: number } {
  const wrist = landmarks[LANDMARK_INDEX.WRIST];
  const mcp = landmarks[mcpIdx];
  const pip = landmarks[pipIdx];
  const dip = landmarks[dipIdx];
  const tip = landmarks[tipIdx];

  // Distances to wrist
  const distTipWrist = distance3D(tip, wrist);
  const distPipWrist = distance3D(pip, wrist);

  // Distances to MCP
  const distTipMcp = distance3D(tip, mcp);
  const distPipMcp = distance3D(pip, mcp);

  // Joint angle at PIP: MCP -> PIP -> DIP
  const pipAngle = calculateAngle(mcp, pip, dip);

  // Joint angle at DIP: PIP -> DIP -> TIP
  const dipAngle = calculateAngle(pip, dip, tip);

  // Ratio of tip distance vs pip distance from wrist
  const wristRatio = distTipWrist / Math.max(0.001, distPipWrist);
  // Ratio of tip distance vs pip distance from mcp
  const mcpRatio = distTipMcp / Math.max(0.001, distPipMcp);

  // Straightness indicator: angles should be open (> 130 deg)
  const isStraight = pipAngle > 130 && dipAngle > 115;
  const isExtendedFromWrist = wristRatio > 1.1;
  const isExtendedFromMcp = mcpRatio > 1.15;

  // Curled indicator: tip is close to MCP/wrist
  const isCurled = wristRatio < 0.95 || mcpRatio < 0.95 || pipAngle < 105;

  let isOpen = false;
  let score = 0.5;

  if (isStraight && (isExtendedFromWrist || isExtendedFromMcp)) {
    isOpen = true;
    score = Math.min(1.0, 0.5 + (pipAngle - 130) / 100);
  } else if (isCurled) {
    isOpen = false;
    score = Math.min(1.0, 0.5 + (110 - pipAngle) / 100);
  } else {
    // Intermediate zone: use weighted voting
    isOpen = wristRatio > 1.05 && distTipMcp > distPipMcp;
    score = 0.55;
  }

  // Extra guard against false open if tip is lower than MCP relative to palm scale
  if (distTipMcp < palmScale * 0.4) {
    isOpen = false;
  }

  return { isOpen, score };
}

/**
 * Evaluates whether the thumb is open (extended/abducted) or folded against palm.
 */
function evaluateThumb(
  landmarks: HandLandmarks,
  palmScale: number,
  _handedness: 'Left' | 'Right' = 'Right',
): { isOpen: boolean; score: number } {
  const wrist = landmarks[LANDMARK_INDEX.WRIST];
  const cmc = landmarks[LANDMARK_INDEX.THUMB_CMC];
  const mcp = landmarks[LANDMARK_INDEX.THUMB_MCP];
  const ip = landmarks[LANDMARK_INDEX.THUMB_IP];
  const tip = landmarks[LANDMARK_INDEX.THUMB_TIP];
  const indexMcp = landmarks[LANDMARK_INDEX.INDEX_MCP];
  const pinkyMcp = landmarks[LANDMARK_INDEX.PINKY_MCP];

  // Angle at MCP: CMC -> MCP -> IP
  const mcpAngle = calculateAngle(cmc, mcp, ip);
  // Angle at IP: MCP -> IP -> TIP
  const ipAngle = calculateAngle(mcp, ip, tip);

  // Distance of thumb tip to pinky MCP (abduction distance)
  const distTipPinky = distance3D(tip, pinkyMcp);
  const distIpPinky = distance3D(ip, pinkyMcp);

  // Distance of thumb tip to index MCP
  const distTipIndex = distance3D(tip, indexMcp);
  const distIpIndex = distance3D(ip, indexMcp);

  // Distance of thumb tip to wrist
  const distTipWrist = distance3D(tip, wrist);
  const distMcpWrist = distance3D(mcp, wrist);

  // Ratio of tip-to-pinky vs ip-to-pinky
  const pinkyRatio = distTipPinky / Math.max(0.001, distIpPinky);
  // Ratio of tip-to-index vs ip-to-index
  const indexRatio = distTipIndex / Math.max(0.001, distIpIndex);

  // In open position (like in 5, 6, 7, 8, 9), thumb is extended outward away from palm
  const isExtendedFromPalm = distTipPinky > palmScale * 0.95 || distTipIndex > palmScale * 0.65;
  const isStraightThumb = ipAngle > 135 && mcpAngle > 130;
  const isFartherThanIp = pinkyRatio > 1.1 || indexRatio > 1.15;

  // In folded position (closed fist 0, or 1, 2, 3, 4), thumb folds across palm towards fingers
  const isFoldedToPalm =
    distTipIndex < palmScale * 0.45 ||
    (pinkyRatio < 0.95 && distTipPinky < palmScale * 0.8) ||
    ipAngle < 120;

  let isOpen = false;
  let score = 0.5;

  if (isExtendedFromPalm && (isStraightThumb || isFartherThanIp)) {
    isOpen = true;
    score = 0.85;
  } else if (isFoldedToPalm) {
    isOpen = false;
    score = 0.85;
  } else {
    // Threshold comparison based on palm scale
    isOpen = distTipPinky > distIpPinky && distTipWrist > distMcpWrist * 1.1;
    score = 0.55;
  }

  return { isOpen, score };
}

/**
 * Detects the states of all 5 fingers from 21 MediaPipe hand landmarks.
 */
export function detectFingerStates(
  landmarks: HandLandmarks,
  handedness: 'Left' | 'Right' = 'Right',
): FingerDetectionResult {
  if (!landmarks || landmarks.length < 21) {
    return {
      states: { thumb: false, index: false, middle: false, ring: false, pinky: false },
      isAmbiguous: true,
      confidence: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
    };
  }

  const palmScale = getPalmScale(landmarks);

  const thumb = evaluateThumb(landmarks, palmScale, handedness);
  const index = evaluateLongFinger(
    landmarks,
    LANDMARK_INDEX.INDEX_MCP,
    LANDMARK_INDEX.INDEX_PIP,
    LANDMARK_INDEX.INDEX_DIP,
    LANDMARK_INDEX.INDEX_TIP,
    palmScale,
  );
  const middle = evaluateLongFinger(
    landmarks,
    LANDMARK_INDEX.MIDDLE_MCP,
    LANDMARK_INDEX.MIDDLE_PIP,
    LANDMARK_INDEX.MIDDLE_DIP,
    LANDMARK_INDEX.MIDDLE_TIP,
    palmScale,
  );
  const ring = evaluateLongFinger(
    landmarks,
    LANDMARK_INDEX.RING_MCP,
    LANDMARK_INDEX.RING_PIP,
    LANDMARK_INDEX.RING_DIP,
    LANDMARK_INDEX.RING_TIP,
    palmScale,
  );
  const pinky = evaluateLongFinger(
    landmarks,
    LANDMARK_INDEX.PINKY_MCP,
    LANDMARK_INDEX.PINKY_PIP,
    LANDMARK_INDEX.PINKY_DIP,
    LANDMARK_INDEX.PINKY_TIP,
    palmScale,
  );

  const states: FingerStates = {
    thumb: thumb.isOpen,
    index: index.isOpen,
    middle: middle.isOpen,
    ring: ring.isOpen,
    pinky: pinky.isOpen,
  };

  // Ambiguity flag if multiple fingers have low score
  const isAmbiguous =
    thumb.score < 0.52 ||
    index.score < 0.52 ||
    middle.score < 0.52 ||
    ring.score < 0.52 ||
    pinky.score < 0.52;

  return {
    states,
    isAmbiguous,
    confidence: {
      thumb: thumb.score,
      index: index.score,
      middle: middle.score,
      ring: ring.score,
      pinky: pinky.score,
    },
  };
}
