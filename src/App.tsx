import { useCallback, useState } from 'react';
import { useCamera } from './hooks/useCamera';
import { useHandLandmarker } from './hooks/useHandLandmarker';
import { useGestureStabilization } from './hooks/useGestureStabilization';
import { useCalculator } from './hooks/useCalculator';
import { detectFingerStates } from './lib/vision/fingerDetection';
import { classifyGesture } from './lib/vision/gestureClassifier';
import { HandLandmarks } from './lib/vision/landmarkProcessor';
import { GestureClassificationResult, GestureNumber } from './types/gesture';

import { MainLayout } from './components/layout/MainLayout';
import { CameraView } from './components/camera/CameraView';
import { CalculatorPanel } from './components/calculator/CalculatorPanel';
import { RoboticTiger } from './components/mascot/RoboticTiger';

export function App() {
  // 1. Camera Engine
  const { videoRef, cameraState, startCamera } = useCamera();

  // 2. Calculator Engine
  const {
    state: calcState,
    inputDigit,
    selectOperator,
    setEditTarget,
    resetCalculator,
  } = useCalculator();

  // Current raw gesture detection state for live feedback badge
  const [currentClassification, setCurrentClassification] =
    useState<GestureClassificationResult | null>(null);

  // 3. Stabilization Handler: commits gesture to calculator
  const handleGestureConfirmed = useCallback(
    (digit: GestureNumber) => {
      inputDigit(digit);
    },
    [inputDigit],
  );

  const {
    state: stabilizationState,
    processGesturePrediction,
    resetStabilization,
  } = useGestureStabilization({
    stabilityDurationMs: 650,
    rearmDurationMs: 300,
    onGestureConfirmed: handleGestureConfirmed,
  });

  // 4. MediaPipe Landmarks Callback
  const handleLandmarksDetected = useCallback(
    (landmarks: HandLandmarks | null, handedness: 'Left' | 'Right') => {
      if (!landmarks || landmarks.length < 21) {
        setCurrentClassification(null);
        processGesturePrediction(null, false);
        return;
      }

      // Detect finger states (open vs folded)
      const detection = detectFingerStates(landmarks, handedness);

      // Classify gesture against official MAUNC 0–9 mapping
      const result = classifyGesture(detection.states, detection.isAmbiguous);
      setCurrentClassification(result);

      // Feed prediction to stabilization engine
      processGesturePrediction(result, true);
    },
    [processGesturePrediction],
  );

  // 5. MediaPipe Hand Landmarker Hook
  const { isModelLoading, modelError, landmarks, isHandPresent } = useHandLandmarker({
    videoRef,
    isStreaming: cameraState.isStreaming,
    onLandmarksDetected: handleLandmarksDetected,
  });

  // 6. Reset Handler: Clears calculator and stabilization lock WITHOUT interrupting webcam
  const handleFullReset = useCallback(() => {
    resetCalculator();
    resetStabilization();
  }, [resetCalculator, resetStabilization]);

  // Detected preview information
  const detectedDigit = currentClassification ? currentClassification.number : null;
  const binaryVector = currentClassification ? currentClassification.binaryVector : '00000';

  return (
    <MainLayout
      mascotNode={
        <RoboticTiger
          isStreaming={cameraState.isStreaming}
          isHandPresent={isHandPresent}
          isStabilizing={stabilizationState.isStabilizing}
          isConfirmed={stabilizationState.isLocked}
          isComplete={calcState.isComplete}
        />
      }
      cameraNode={
        <CameraView
          videoRef={videoRef}
          cameraState={cameraState}
          isModelLoading={isModelLoading}
          modelError={modelError}
          landmarks={landmarks}
          stabilizationState={stabilizationState}
          detectedDigit={detectedDigit}
          binaryVector={binaryVector}
          onStartCamera={startCamera}
        />
      }
      calculatorNode={
        <CalculatorPanel
          state={calcState}
          onSelectOperator={selectOperator}
          onSetEditTarget={setEditTarget}
          onReset={handleFullReset}
        />
      }
    />
  );
}

export default App;
