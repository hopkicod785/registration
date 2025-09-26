import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

// File paths
const getDataDir = () => {
  return process.env.NODE_ENV === 'production' 
    ? '/tmp/data' 
    : join(process.cwd(), 'data');
};

const getRegistrationsFile = () => join(getDataDir(), 'registrations.json');
const getUsersFile = () => join(getDataDir(), 'users.json');

// Initialize data directory
const ensureDataDir = async () => {
  const dataDir = getDataDir();
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
};

// Read JSON file
const readJsonFile = async <T>(filePath: string, defaultValue: T): Promise<T> => {
  try {
    if (!existsSync(filePath)) {
      // If file doesn't exist, create it with default value
      await writeJsonFile(filePath, defaultValue);
      return defaultValue;
    }
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
};

// Write JSON file
const writeJsonFile = async <T>(filePath: string, data: T): Promise<void> => {
  try {
    await ensureDataDir();
    await writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
};

export const jsonDb = {
  // User functions
  getUserByUsername: async (username: string): Promise<User | null> => {
    const users = await readJsonFile<User[]>(getUsersFile(), [
      {
        id: 1,
        username: 'admin',
        password_hash: 'admin123', // Simple password for now
        role: 'admin'
      }
    ]);
    return users.find(user => user.username === username) || null;
  },

  // Registration functions
  createRegistration: async (data: any): Promise<{ lastInsertRowid: number }> => {
    const registrations = await readJsonFile<Registration[]>(getRegistrationsFile(), []);
    
    const newRegistration: Registration = {
      id: registrations.length > 0 ? Math.max(...registrations.map(r => r.id)) + 1 : 1,
      intersection_name: data.intersectionName,
      end_user: data.endUser,
      distributor: data.distributor,
      cabinet_type: data.cabinetType,
      cabinet_type_other: data.cabinetTypeOther || undefined,
      tls_connection: data.tlsConnection,
      tls_connection_other: data.tlsConnectionOther || undefined,
      detection_io: data.detectionIO,
      detection_io_other: data.detectionIOOther || undefined,
      phasing_text: data.phasingText || undefined,
      phasing_file_path: data.phasingFilePath || undefined,
      timing_files: data.timingFiles ? JSON.stringify(data.timingFiles) : undefined,
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      created_at: new Date().toISOString()
    };

    registrations.push(newRegistration);
    await writeJsonFile(getRegistrationsFile(), registrations);
    
    return { lastInsertRowid: newRegistration.id };
  },

  getAllRegistrations: async (): Promise<Registration[]> => {
    const registrations = await readJsonFile<Registration[]>(getRegistrationsFile(), []);
    return registrations.reverse(); // Return newest first
  },

  getRegistrationById: async (id: number): Promise<Registration | null> => {
    const registrations = await readJsonFile<Registration[]>(getRegistrationsFile(), []);
    return registrations.find(reg => reg.id === id) || null;
  },

  // Dropdown data functions
  getDistributors: async (): Promise<DropdownItem[]> => {
    return [
      { id: 1, name: 'Orange Traffic' },
      { id: 2, name: 'ITS' },
      { id: 3, name: 'CTC' },
      { id: 4, name: 'Southwest Traffic Systems' },
      { id: 5, name: 'TAPCO Swarco' },
      { id: 6, name: 'Blackstar' },
      { id: 7, name: 'Marlin' },
      { id: 8, name: 'HighAngle' },
      { id: 9, name: 'General Traffic Controls' },
      { id: 10, name: 'TCC' },
      { id: 11, name: 'Traffic Signal Controls' },
      { id: 12, name: 'General Highway Products' },
      { id: 13, name: 'Texas Highway Products' },
      { id: 14, name: 'Transportation Solutions & Lighting' },
      { id: 15, name: 'Utilicom' },
      { id: 16, name: 'Paradigm' },
      { id: 17, name: 'Other' }
    ];
  },

  getCabinetTypes: async (): Promise<DropdownItem[]> => {
    return [
      { id: 1, name: 'NEMA TS 1' },
      { id: 2, name: 'NEMA TS 2' },
      { id: 3, name: 'ATC' },
      { id: 4, name: 'ITS' },
      { id: 5, name: '33X' },
      { id: 6, name: 'Other' }
    ];
  },

  getTLSConnections: async (): Promise<DropdownItem[]> => {
    return [
      { id: 1, name: 'NTCIP' },
      { id: 2, name: 'SDLC' },
      { id: 3, name: 'C1/C4 Harness' },
      { id: 4, name: 'DB25 Spade Cables' }
    ];
  },

  getDetectionIOs: async (): Promise<DropdownItem[]> => {
    return [
      { id: 1, name: 'DB37 to Spades' },
      { id: 2, name: 'SDLC - 15 PIN' },
      { id: 3, name: 'SDLC - 25/15 PIN' },
      { id: 4, name: 'NTCIP' }
    ];
  }
};
