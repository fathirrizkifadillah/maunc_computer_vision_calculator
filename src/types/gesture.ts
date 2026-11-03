export type FingerStates = {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
};

export type GestureNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface GestureDefinition {
  number: GestureNumber;
  fingerStates: FingerStates;
  binaryVector: string; // e.g. "01100"
  description: string;
}

export type GestureClassificationResult = {
  number: GestureNumber | null;
  binaryVector: string;
  fingerStates: FingerStates;
  isAmbiguous: boolean;
};

export type GestureStabilizationState = {
  candidate: GestureNumber | null;
  progress: number; // 0 to 1
  isStabilizing: boolean;
  isLocked: boolean;
  confirmedNumber: GestureNumber | null;
  statusMessage: string;
};
