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
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null);
  const [handedness, setHandedness] = useState<'Left' | 'Right'>('Right');
  const [isHandPresent, setIsHandPresent] = useState<boolean>(false);

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const callbackRef = useRef(onLandmarksDetected);
  callbackRef.current = onLandmarksDetected;

  // Initialize MediaPipe Hand Landmarker once
  useEffect(() => {
    let isCancelled = false;

    async function initMediaPipe() {
      if (landmarkerRef.current) return;
      setIsModelLoading(true);
      setModelError(null);

      try {
        // Attempt local WASM first for 100% offline expo readiness
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

        const handLandmarker = await HandLandmarker.createFromOptions(visionResolver, {
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

        if (isCancelled) {
          handLandmarker.close();
          return;
        }

        landmarkerRef.current = handLandmarker;
        setIsModelLoading(false);
      } catch (err: any) {
        console.error('Failed to initialize MediaPipe HandLandmarker:', err);
        if (!isCancelled) {
          setModelError(err.message || 'Gagal memuat model pendeteksi tangan MediaPipe.');
          setIsModelLoading(false);
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

  // Inference loop tied to video streaming
  useEffect(() => {
    if (!isStreaming || !landmarkerRef.current) {
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
  }, [isStreaming, videoRef]);

  return {
    isModelLoading,
    modelError,
    landmarks,
    handedness,
    isHandPresent,
  };
}
