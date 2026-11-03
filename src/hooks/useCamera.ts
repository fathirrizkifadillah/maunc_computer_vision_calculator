import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraState } from '../types/camera';

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraState: CameraState;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>({
    status: 'idle',
    errorMessage: null,
    hasPermission: false,
    isStreaming: false,
  });

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState((prev) => ({
      ...prev,
      status: 'idle',
      isStreaming: false,
      errorMessage: null,
    }));
  }, []);

  const startCamera = useCallback(async () => {
    // Prevent duplicate camera initialization if stream is already active
    if (streamRef.current && streamRef.current.active && cameraState.isStreaming) {
      return;
    }

    setCameraState((prev) => ({
      ...prev,
      status: 'requesting',
      errorMessage: null,
    }));

    let videoDevicesCount = -1;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser Anda tidak mendukung akses webcam (MediaDevices API tidak tersedia).');
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        videoDevicesCount = videoDevices.length;
      } catch (enumErr) {
        console.warn('Could not enumerate devices:', enumErr);
      }

      let stream: MediaStream | null = null;
      let lastError: any = null;

      // Tier 1: Preferred HD with user facing mode
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });
      } catch (err1) {
        lastError = err1;
        console.warn('Tier 1 camera constraints failed, attempting Tier 2:', err1);
      }

      // Tier 2: Without facingMode constraint (critical for external USB / virtual webcams on PC)
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch (err2) {
          lastError = err2;
          console.warn('Tier 2 camera constraints failed, attempting Tier 3 { video: true }:', err2);
        }
      }

      // Tier 3: Universal unconstrained video fallback
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } catch (err3) {
          lastError = err3;
          console.error('All camera constraint tiers failed:', err3);
          throw lastError || err3;
        }
      }

      if (!stream) {
        throw new Error('Tidak dapat memperoleh stream video dari webcam.');
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return resolve();
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => resolve()).catch(() => resolve());
          };
          // Timeout safety in case metadata event fires before handler
          setTimeout(resolve, 500);
        });
      }

      setCameraState({
        status: 'active',
        hasPermission: true,
        isStreaming: true,
        errorMessage: null,
      });
    } catch (err: any) {
      console.error('Final Camera Error:', err);
      let errorMsg = 'Gagal mengakses kamera.';
      let status: CameraState['status'] = 'error';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Izin kamera ditolak. Izinkan akses webcam pada ikon gembok di address bar browser Anda.';
        status = 'permission_denied';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError' || videoDevicesCount === 0) {
        errorMsg = 'Webcam tidak terdeteksi. Pastikan webcam terpasang dan izin kamera aktif di Windows Settings.';
        status = 'device_not_found';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Kamera sedang digunakan oleh aplikasi lain (seperti Zoom, Teams, atau tab lain).';
      } else if (err.name === 'OverconstrainedError') {
        errorMsg = 'Kamera Anda tidak mendukung spesifikasi resolusi yang diminta.';
      } else if (err.name === 'SecurityError') {
        errorMsg = 'Akses kamera diblokir. Pastikan aplikasi dibuka melalui localhost atau HTTPS.';
      } else if (err.message) {
        errorMsg = err.message;
      }

      setCameraState({
        status,
        hasPermission: false,
        isStreaming: false,
        errorMessage: errorMsg,
      });
    }
  }, [cameraState.isStreaming]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    cameraState,
    startCamera,
    stopCamera,
  };
}
