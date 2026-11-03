import React, { useEffect, useRef } from 'react';
import { HandLandmarks } from '../../lib/vision/landmarkProcessor';

export interface HandLandmarkOverlayProps {
  landmarks: HandLandmarks | null;
  videoWidth: number;
  videoHeight: number;
  mirrored?: boolean;
}

const CONNECTIONS: [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [9, 10], [10, 11], [11, 12],
  // Ring
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm connections
  [5, 9], [9, 13], [13, 17],
];

export const HandLandmarkOverlay: React.FC<HandLandmarkOverlayProps> = ({
  landmarks,
  videoWidth,
  videoHeight,
  mirrored = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length < 21) {
      return;
    }

    ctx.save();

    // Scale landmark coordinates (0 to 1) to canvas pixel size
    const toScreen = (lm: { x: number; y: number }) => {
      const x = mirrored ? (1 - lm.x) * canvas.width : lm.x * canvas.width;
      const y = lm.y * canvas.height;
      return { x, y };
    };

    // 1. Draw connections (skeletal lines)
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)'; // MAUNC Yellow semi-transparent
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const [startIdx, endIdx] of CONNECTIONS) {
      const p1 = toScreen(landmarks[startIdx]);
      const p2 = toScreen(landmarks[endIdx]);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // 2. Draw joints (landmarks)
    for (let i = 0; i < landmarks.length; i++) {
      const p = toScreen(landmarks[i]);
      const isFingertip = i === 4 || i === 8 || i === 12 || i === 16 || i === 20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, isFingertip ? 5.5 : 3.5, 0, 2 * Math.PI);

      if (isFingertip) {
        ctx.fillStyle = '#F59E0B'; // MAUNC bright yellow for tips
        ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
        ctx.shadowBlur = 6;
      } else if (i === 0) {
        ctx.fillStyle = '#EF4444'; // Red wrist accent
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#FFFFFF'; // White for intermediate joints
        ctx.shadowBlur = 0;
      }

      ctx.fill();
    }

    ctx.restore();
  }, [landmarks, videoWidth, videoHeight, mirrored]);

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth || 640}
      height={videoHeight || 480}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
