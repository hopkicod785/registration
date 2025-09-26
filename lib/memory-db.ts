// Simple in-memory database for Vercel deployment
// This is a temporary solution - in production you'd use a proper database

interface Registration {
  id: number;
  intersection_name: string;
  end_user: string;
  distributor: string;
  cabinet_type: string;
  cabinet_type_other?: string;
  tls_connection: string;
  tls_connection_other?: string;
  detection_io: string;
  detection_io_other?: string;
  phasing_text?: string;
  phasing_file_path?: string;
  timing_files?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  password_hash: string;
  role: string;
}

interface DropdownItem {
  id: number;
  name: string;
}

// In-memory storage
let registrations: Registration[] = [];
let users: User[] = [
  {
    id: 1,
    username: 'admin',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'admin'
  }
];

const distributors: DropdownItem[] = [
  { id: 1, name: 'Distributor A' },
  { id: 2, name: 'Distributor B' },
  { id: 3, name: 'Distributor C' },
  { id: 4, name: 'Other' }
];

const cabinetTypes: DropdownItem[] = [
  { id: 1, name: 'Type A' },
  { id: 2, name: 'Type B' },
  { id: 3, name: 'Type C' },
  { id: 4, name: 'Other' }
];

const tlsConnections: DropdownItem[] = [
  { id: 1, name: 'TLS 1.2' },
  { id: 2, name: 'TLS 1.3' },
  { id: 3, name: 'Other' }
];

const detectionIOs: DropdownItem[] = [
  { id: 1, name: 'I/O Type A' },
  { id: 2, name: 'I/O Type B' },
  { id: 3, name: 'I/O Type C' },
  { id: 4, name: 'Other' }
];

export const memoryDb = {
  // User functions
  getUserByUsername: async (username: string): Promise<User | null> => {
    return users.find(user => user.username === username) || null;
  },

  // Registration functions
  createRegistration: async (data: any): Promise<{ lastInsertRowid: number }> => {
    const newRegistration: Registration = {
      id: registrations.length + 1,
      intersection_name: data.intersectionName,
      end_user: data.endUser,
      distributor: data.distributor,
      cabinet_type: data.cabinetType,
      cabinet_type_other: data.cabinetTypeOther || null,
      tls_connection: data.tlsConnection,
      tls_connection_other: data.tlsConnectionOther || null,
      detection_io: data.detectionIO,
      detection_io_other: data.detectionIOOther || null,
      phasing_text: data.phasingText || null,
      phasing_file_path: data.phasingFilePath || null,
      timing_files: data.timingFiles ? JSON.stringify(data.timingFiles) : null,
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      created_at: new Date().toISOString()
    };

    registrations.push(newRegistration);
    return { lastInsertRowid: newRegistration.id };
  },

  getAllRegistrations: async (): Promise<Registration[]> => {
    return [...registrations].reverse(); // Return newest first
  },

  getRegistrationById: async (id: number): Promise<Registration | null> => {
    return registrations.find(reg => reg.id === id) || null;
  },

  // Dropdown data functions
  getDistributors: async (): Promise<DropdownItem[]> => {
    return [...distributors];
  },

  getCabinetTypes: async (): Promise<DropdownItem[]> => {
    return [...cabinetTypes];
  },

  getTLSConnections: async (): Promise<DropdownItem[]> => {
    return [...tlsConnections];
  },

  getDetectionIOs: async (): Promise<DropdownItem[]> => {
    return [...detectionIOs];
  }
};
