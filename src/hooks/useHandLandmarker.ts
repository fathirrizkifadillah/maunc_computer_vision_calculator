import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useEffect, useRef, useState } from 'react';
import { HandLandmarks } from '../lib/vision/landmarkProcessor';

export interface UseHandLandmarkerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  onLandmarksDetected?: (landmarks: HandLandmarks | null, handedness: 'Left' | 'Right') => void;
}

export interface UseHandLandmarkerReturn {
  isModelLoading: boolean;
  isModelReady: boolean;
  modelError: string | null;
  landmarks: HandLandmarks | null;
  handedness: 'Left' | 'Right';
  isHandPresent: boolean;
}

export function useHandLandmarker({
  videoRef,
  isStreaming,
  onLandmarksDetected,
}: UseHandLandmarkerProps): UseHandLandmarkerReturn {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [isModelReady, setIsModelReady] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null);
  const [handedness, setHandedness] = useState<'Left' | 'Right'>('Right');
  const [isHandPresent, setIsHandPresent] = useState<boolean>(false);

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const callbackRef = useRef(onLandmarksDetected);
  callbackRef.current = onLandmarksDetected;

  // 1. Initialize MediaPipe Hand Landmarker immediately on page mount
  useEffect(() => {
    let isCancelled = false;

    async function initMediaPipe() {
      if (landmarkerRef.current) {
        setIsModelReady(true);
        setIsModelLoading(false);
        return;
      }

      setIsModelLoading(true);
      setModelError(null);

      try {
        // Step A: Resolve Vision WASM (try local first, fallback to CDN)
        let visionResolver;
        try {
          visionResolver = await FilesetResolver.forVisionTasks('/wasm');
        } catch (localWasmErr) {
          console.warn('Local WASM resolver failed, falling back to CDN:', localWasmErr);
          visionResolver = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
          );
        }

        if (isCancelled) return;

        // Step B: Create HandLandmarker (try local model with GPU, fallback to CPU / CDN)
        let handLandmarker: HandLandmarker;
        try {
          handLandmarker = await HandLandmarker.createFromOptions(visionResolver, {
            baseOptions: {
              modelAssetPath: '/models/hand_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 1,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        } catch (gpuErr) {
          console.warn('GPU model initialization failed, attempting fallback with CPU:', gpuErr);
          try {
            handLandmarker = await HandLandmarker.createFromOptions(visionResolver, {
              baseOptions: {
                modelAssetPath: '/models/hand_landmarker.task',
                delegate: 'CPU',
              },
              runningMode: 'VIDEO',
              numHands: 1,
              minHandDetectionConfidence: 0.5,
              minHandPresenceConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });
          } catch (localModelErr) {
            console.warn('Local model failed, fetching official CDN model:', localModelErr);
            handLandmarker = await HandLandmarker.createFromOptions(visionResolver, {
              baseOptions: {
                modelAssetPath:
                  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                delegate: 'GPU',
              },
              runningMode: 'VIDEO',
              numHands: 1,
              minHandDetectionConfidence: 0.5,
              minHandPresenceConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });
          }
        }

        if (isCancelled) {
          handLandmarker.close();
          return;
        }

        landmarkerRef.current = handLandmarker;
        setIsModelReady(true);
        setIsModelLoading(false);
      } catch (err: any) {
        console.error('Fatal MediaPipe initialization error:', err);
        if (!isCancelled) {
          setModelError(err.message || 'Gagal memuat model pendeteksi tangan MediaPipe.');
          setIsModelLoading(false);
          setIsModelReady(false);
        }
      }
    }

    initMediaPipe();

    return () => {
      isCancelled = true;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, []);

  // 2. Continuous Inference Loop
  // CRITICAL FIX: Depends on both isStreaming AND isModelReady so that if user starts camera
  // before the model finishes downloading, the loop starts automatically the millisecond the model is ready!
  useEffect(() => {
    if (!isStreaming || !isModelReady || !landmarkerRef.current) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      setLandmarks(null);
      setIsHandPresent(false);
      return;
    }

    let isRunning = true;

    const processFrame = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (isRunning && video && landmarker && video.readyState >= 2) {
        if (video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;
          const startTimeMs = performance.now();

          try {
            const result = landmarker.detectForVideo(video, startTimeMs);

            if (result.landmarks && result.landmarks.length > 0) {
              const detectedLandmarks = result.landmarks[0] as HandLandmarks;
              let detectedHandedness: 'Left' | 'Right' = 'Right';

              if (result.handedness && result.handedness.length > 0) {
                const category = result.handedness[0][0];
                if (category && (category.categoryName === 'Left' || category.categoryName === 'Right')) {
                  detectedHandedness = category.categoryName;
                }
              }

              setLandmarks(detectedLandmarks);
              setHandedness(detectedHandedness);
              setIsHandPresent(true);

              if (callbackRef.current) {
                callbackRef.current(detectedLandmarks, detectedHandedness);
              }
            } else {
              setLandmarks(null);
              setIsHandPresent(false);
              if (callbackRef.current) {
                callbackRef.current(null, 'Right');
              }
            }
          } catch (detectionErr) {
            console.warn('Frame detection error:', detectionErr);
          }
        }
      }

      if (isRunning) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isStreaming, isModelReady, videoRef]);

  return {
    isModelLoading,
    isModelReady,
    modelError,
    landmarks,
    handedness,
    isHandPresent,
  };
}
