export interface DropdownData {
  distributors: Array<{ id: number; name: string }>;
  cabinetTypes: Array<{ id: number; name: string }>;
  tlsConnections: Array<{ id: number; name: string }>;
  detectionIOs: Array<{ id: number; name: string }>;
}

export interface RegistrationFormData {
  intersectionName: string;
  endUser: string;
  distributor: string;
  cabinetType: string;
  cabinetTypeOther?: string;
  tlsConnection: string;
  tlsConnectionOther?: string;
  detectionIO: string;
  detectionIOOther?: string;
  phasingText?: string;
  phasingFile?: File;
  timingFiles?: File[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}
