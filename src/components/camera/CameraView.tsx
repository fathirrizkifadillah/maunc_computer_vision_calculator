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
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#181A20] border-2 border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl min-h-[240px] sm:min-h-[320px] md:min-h-[400px] lg:max-h-[480px] xl:max-h-[520px]">
      {/* Industrial Viewfinder Corner Brackets */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 w-4 sm:w-6 h-4 sm:h-6 border-t-[2.5px] sm:border-t-[3.5px] border-l-[2.5px] sm:border-l-[3.5px] border-white/80 rounded-tl-md pointer-events-none z-20" />
      <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 w-4 sm:w-6 h-4 sm:h-6 border-t-[2.5px] sm:border-t-[3.5px] border-r-[2.5px] sm:border-r-[3.5px] border-white/80 rounded-tr-md pointer-events-none z-20" />
      <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 w-4 sm:w-6 h-4 sm:h-6 border-b-[2.5px] sm:border-b-[3.5px] border-l-[2.5px] sm:border-l-[3.5px] border-white/80 rounded-bl-md pointer-events-none z-20" />
      <div className="absolute bottom-2.5 sm:bottom-4 right-2.5 sm:right-4 w-4 sm:w-6 h-4 sm:h-6 border-b-[2.5px] sm:border-b-[3.5px] border-r-[2.5px] sm:border-r-[3.5px] border-white/80 rounded-br-md pointer-events-none z-20" />

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
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-5 text-center z-10 bg-[#181A20]">
          {/* White Outline Camera Icon */}
          <div className="mb-1.5 sm:mb-2.5 text-white">
            <Camera size={36} weight="light" className="sm:w-12 sm:h-12" />
          </div>

          <h3 className="text-sm sm:text-base md:text-xl font-bold text-white mb-3 sm:mb-5 tracking-wide">
            Kamera belum aktif
          </h3>

          {/* Primary Action Button: Official MAUNC Yellow Pill Button */}
          <button
            onClick={onStartCamera}
            disabled={cameraState.status === 'requesting'}
            className="flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-maunc-yellow text-slate-950 font-bold text-xs sm:text-base hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cameraState.status === 'requesting' ? (
              <>
                <ArrowsClockwise size={16} className="animate-spin text-slate-950 sm:w-5 sm:h-5" />
                <span>Menghubungkan...</span>
              </>
            ) : (
              <>
                <Camera size={16} weight="bold" className="text-slate-950 sm:w-5 sm:h-5" />
                <span>Aktifkan Kamera</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 5. Error Overlay */}
      {(cameraState.errorMessage || modelError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-5 text-center z-30 bg-[#181A20]/95 backdrop-blur-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-900/40 border border-red-500/60 flex items-center justify-center mb-2 text-red-400">
            <WarningCircle size={24} weight="fill" className="sm:w-7 sm:h-7" />
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
            Kendala Akses Kamera
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-300 max-w-sm mb-3 sm:mb-4 leading-relaxed">
            {cameraState.errorMessage || modelError}
          </p>

          <button
            onClick={onStartCamera}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-maunc-yellow text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            <ArrowsClockwise size={14} weight="bold" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* 6. Loading Model Pill during initialization */}
      {isModelLoading && isStreaming && (
        <div className="absolute top-3 left-10 sm:top-4 sm:left-12 z-20 px-2 sm:px-3 py-1 rounded-lg bg-black/75 backdrop-blur border border-white/20 text-[9px] sm:text-[11px] text-white flex items-center gap-1.5 shadow-md">
          <ArrowsClockwise size={12} className="animate-spin text-maunc-yellow" />
          <span>Memuat model...</span>
        </div>
      )}
    </div>
  );
};
