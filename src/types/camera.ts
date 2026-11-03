export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'error'
  | 'permission_denied'
  | 'device_not_found';

export interface CameraState {
  status: CameraStatus;
  errorMessage: string | null;
  hasPermission: boolean;
  isStreaming: boolean;
  selectedDeviceId?: string;
}
