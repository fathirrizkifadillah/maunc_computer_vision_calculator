import React, { useState } from 'react';
import { CameraState } from '../../types/camera';
import { HandLandmarks } from '../../lib/vision/landmarkProcessor';
import { GestureStabilizationState } from '../../types/gesture';
import { HandLandmarkOverlay } from './HandLandmarkOverlay';
import { CameraStatus } from './CameraStatus';
import { Camera, WarningCircle, ArrowsClockwise } from '@phosphor-icons/react';

export interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraState: CameraState;
  isModelLoading: boolean;
  modelError: string | null;
  landmarks: HandLandmarks | null;
  stabilizationState: GestureStabilizationState;
  detectedDigit: number | null;
  binaryVector: string;
  onStartCamera: () => Promise<void>;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  cameraState,
  isModelLoading,
  modelError,
  landmarks,
  stabilizationState,
  detectedDigit,
  binaryVector,
  onStartCamera,
}) => {
  const [videoDims, setVideoDims] = useState<{ width: number; height: number }>({
    width: 1280,
    height: 720,
  });

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      if (videoWidth && videoHeight) {
        setVideoDims({ width: videoWidth, height: videoHeight });
      }
    }
  };

  const isStreaming = cameraState.isStreaming;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#181A20] border-2 border-slate-200/90 rounded-3xl overflow-hidden shadow-xl min-h-[360px] md:min-h-[440px] lg:min-h-[480px]">
      {/* Industrial Viewfinder Corner Brackets */}
      <div className="absolute top-5 left-5 w-7 h-7 border-t-[3.5px] border-l-[3.5px] border-white/80 rounded-tl-lg pointer-events-none z-20" />
      <div className="absolute top-5 right-5 w-7 h-7 border-t-[3.5px] border-r-[3.5px] border-white/80 rounded-tr-lg pointer-events-none z-20" />
      <div className="absolute bottom-5 left-5 w-7 h-7 border-b-[3.5px] border-l-[3.5px] border-white/80 rounded-bl-lg pointer-events-none z-20" />
      <div className="absolute bottom-5 right-5 w-7 h-7 border-b-[3.5px] border-r-[3.5px] border-white/80 rounded-br-lg pointer-events-none z-20" />

      {/* 1. Video Element (mirrored) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={handleLoadedMetadata}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isStreaming ? 'opacity-100 scale-x-[-1]' : 'opacity-0 pointer-events-none absolute'
        }`}
      />

      {/* 2. Hand Landmark Canvas Overlay */}
      {isStreaming && (
        <HandLandmarkOverlay
          landmarks={landmarks}
          videoWidth={videoDims.width}
          videoHeight={videoDims.height}
          mirrored={true}
        />
      )}

      {/* 3. Internal Contextual Status Bar */}
      {isStreaming && (
        <CameraStatus
          isStreaming={isStreaming}
          stabilizationState={stabilizationState}
          detectedDigit={detectedDigit}
          binaryVector={binaryVector}
        />
      )}

      {/* 4. Pre-Activation Overlay: Before Camera is Activated */}
      {!isStreaming && cameraState.status !== 'error' && cameraState.status !== 'permission_denied' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[#181A20]">
          {/* Large White Outline Camera Icon */}
          <div className="mb-3 text-white">
            <Camera size={56} weight="light" />
          </div>

          <h3 className="text-lg md:text-xl font-bold text-white mb-6 tracking-wide">
            Kamera belum aktif
          </h3>

          {/* Primary Action Button: Official MAUNC Yellow Pill Button */}
          <button
            onClick={onStartCamera}
            disabled={cameraState.status === 'requesting'}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-maunc-yellow text-slate-950 font-bold text-base hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cameraState.status === 'requesting' ? (
              <>
                <ArrowsClockwise size={20} className="animate-spin text-slate-950" />
                <span>Menghubungkan Kamera...</span>
              </>
            ) : (
              <>
                <Camera size={20} weight="bold" className="text-slate-950" />
                <span>Aktifkan Kamera</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 5. Error Overlay: Handled Gracefully with Retry */}
      {(cameraState.errorMessage || modelError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30 bg-[#181A20]/95 backdrop-blur-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-900/40 border border-red-500/60 flex items-center justify-center mb-3 text-red-400">
            <WarningCircle size={32} weight="fill" />
          </div>

          <h3 className="text-base font-bold text-white mb-1.5">
            Kendala Akses Kamera
          </h3>
          <p className="text-xs text-slate-300 max-w-md mb-5 leading-relaxed">
            {cameraState.errorMessage || modelError}
          </p>

          <button
            onClick={onStartCamera}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-maunc-yellow text-slate-950 font-bold text-sm hover:bg-amber-400 active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            <ArrowsClockwise size={18} weight="bold" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* 6. Loading Model Pill during initialization */}
      {isModelLoading && isStreaming && (
        <div className="absolute top-5 left-14 z-20 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur border border-white/20 text-[11px] text-white flex items-center gap-2 shadow-md">
          <ArrowsClockwise size={14} className="animate-spin text-maunc-yellow" />
          <span>Memuat model MediaPipe...</span>
        </div>
      )}
    </div>
  );
};
