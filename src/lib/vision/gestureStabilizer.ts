import {
  GestureClassificationResult,
  GestureNumber,
  GestureStabilizationState,
} from '../../types/gesture';

export interface GestureStabilizerOptions {
  stabilityDurationMs?: number; // Default 600ms
  rearmDurationMs?: number; // Default 300ms
  onGestureConfirmed: (digit: GestureNumber) => void;
}

export class GestureStabilizer {
  private stabilityDurationMs: number;
  private rearmDurationMs: number;
  private onGestureConfirmed: (digit: GestureNumber) => void;

  private candidate: GestureNumber | null = null;
  private startTime: number | null = null;
  private isLocked: boolean = false;
  private handAbsentStartTime: number | null = null;
  private confirmedNumber: GestureNumber | null = null;

  constructor(options: GestureStabilizerOptions) {
    this.stabilityDurationMs = options.stabilityDurationMs ?? 600;
    this.rearmDurationMs = options.rearmDurationMs ?? 300;
    this.onGestureConfirmed = options.onGestureConfirmed;
  }

  public getState(now: number = performance.now()): GestureStabilizationState {
    if (this.isLocked) {
      return {
        candidate: null,
        progress: 1.0,
        isStabilizing: false,
        isLocked: true,
        confirmedNumber: this.confirmedNumber,
        statusMessage: 'Turunkan tangan untuk input berikutnya',
      };
    }

    if (this.candidate !== null && this.startTime !== null) {
      const elapsed = now - this.startTime;
      const progress = Math.min(1.0, elapsed / this.stabilityDurationMs);
      return {
        candidate: this.candidate,
        progress,
        isStabilizing: true,
        isLocked: false,
        confirmedNumber: null,
        statusMessage: `Menstabilkan angka ${this.candidate} (${Math.round(progress * 100)}%)`,
      };
    }

    return {
      candidate: null,
      progress: 0,
      isStabilizing: false,
      isLocked: false,
      confirmedNumber: null,
      statusMessage: 'Silakan tunjukkan gestur tangan Anda.',
    };
  }

  public process(
    result: GestureClassificationResult | null,
    isHandPresent: boolean,
    now: number = performance.now(),
  ): GestureStabilizationState {
    // Case 1: No hand present in camera frame
    if (!isHandPresent || !result) {
      if (this.handAbsentStartTime === null) {
        this.handAbsentStartTime = now;
      }

      const absentElapsed = now - this.handAbsentStartTime;

      // Re-arm when hand has left the camera frame for at least rearmDurationMs
      if (this.isLocked && absentElapsed >= this.rearmDurationMs) {
        this.isLocked = false;
        this.candidate = null;
        this.startTime = null;
        this.confirmedNumber = null;
      } else if (!this.isLocked) {
        this.candidate = null;
        this.startTime = null;
      }

      return this.getState(now);
    }

    // Hand is present -> reset absent timer
    this.handAbsentStartTime = null;

    // Case 2: System is locked waiting for hand to leave frame
    if (this.isLocked) {
      return this.getState(now);
    }

    // Case 3: Gesture is unrecognized or ambiguous
    const predictedNumber = result.number;
    if (predictedNumber === null || result.isAmbiguous) {
      this.candidate = null;
      this.startTime = null;
      return {
        candidate: null,
        progress: 0,
        isStabilizing: false,
        isLocked: false,
        confirmedNumber: null,
        statusMessage: 'Gestur belum dikenali. Sesuaikan konfigurasi jari.',
      };
    }

    // Case 4: Candidate gesture matching
    if (this.candidate !== predictedNumber) {
      this.candidate = predictedNumber;
      this.startTime = now;
      return {
        candidate: predictedNumber,
        progress: 0,
        isStabilizing: true,
        isLocked: false,
        confirmedNumber: null,
        statusMessage: `Mendeteksi angka ${predictedNumber}... Tahan gestur.`,
      };
    }

    // Candidate remains consistent -> check elapsed duration
    const elapsed = this.startTime !== null ? now - this.startTime : 0;
    const progress = Math.min(1.0, elapsed / this.stabilityDurationMs);

    if (progress >= 1.0) {
      const confirmed = this.candidate;
      this.isLocked = true;
      this.confirmedNumber = confirmed;
      this.candidate = null;
      this.startTime = null;

      if (confirmed !== null) {
        this.onGestureConfirmed(confirmed);
      }

      return {
        candidate: null,
        progress: 1.0,
        isStabilizing: false,
        isLocked: true,
        confirmedNumber: confirmed,
        statusMessage: `Angka ${confirmed} dikonfirmasi! Turunkan tangan.`,
      };
    }

    return {
      candidate: predictedNumber,
      progress,
      isStabilizing: true,
      isLocked: false,
      confirmedNumber: null,
      statusMessage: `Menstabilkan angka ${predictedNumber} (${Math.round(progress * 100)}%)`,
    };
  }

  public reset(): void {
    this.candidate = null;
    this.startTime = null;
    this.isLocked = false;
    this.handAbsentStartTime = null;
    this.confirmedNumber = null;
  }
}
