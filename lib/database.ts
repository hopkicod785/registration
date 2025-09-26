import Database from 'better-sqlite3';
import { z } from 'zod';

// Database schema
const db = new Database('registrations.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    intersection_name TEXT NOT NULL,
    end_user TEXT NOT NULL,
    distributor TEXT NOT NULL,
    cabinet_type TEXT NOT NULL,
    cabinet_type_other TEXT,
    tls_connection TEXT NOT NULL,
    tls_connection_other TEXT,
    detection_io TEXT NOT NULL,
    detection_io_other TEXT,
    phasing_text TEXT,
    phasing_file_path TEXT,
    timing_files TEXT, -- JSON array of file paths
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS distributors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cabinet_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tls_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS detection_ios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default data
const insertDefaultData = () => {
  // Insert default admin user (password: admin123)
  const adminPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  db.prepare(`
    INSERT OR IGNORE INTO users (username, password_hash, role) 
    VALUES (?, ?, ?)
  `).run('admin', adminPassword, 'admin');

  // Insert default distributors
  const distributors = ['Distributor A', 'Distributor B', 'Distributor C', 'Other'];
  distributors.forEach(name => {
    db.prepare(`
      INSERT OR IGNORE INTO distributors (name) VALUES (?)
    `).run(name);
  });

  // Insert default cabinet types
  const cabinetTypes = ['Type A', 'Type B', 'Type C', 'Other'];
  cabinetTypes.forEach(name => {
    db.prepare(`
      INSERT OR IGNORE INTO cabinet_types (name) VALUES (?)
    `).run(name);
  });

  // Insert default TLS connections
  const tlsConnections = ['TLS 1.2', 'TLS 1.3', 'Other'];
  tlsConnections.forEach(name => {
    db.prepare(`
      INSERT OR IGNORE INTO tls_connections (name) VALUES (?)
    `).run(name);
  });

  // Insert default detection I/O
  const detectionIOs = ['I/O Type A', 'I/O Type B', 'I/O Type C', 'Other'];
  detectionIOs.forEach(name => {
    db.prepare(`
      INSERT OR IGNORE INTO detection_ios (name) VALUES (?)
    `).run(name);
  });
};

insertDefaultData();

// Validation schemas
export const RegistrationSchema = z.object({
  intersectionName: z.string().min(1, 'Intersection name is required'),
  endUser: z.string().min(1, 'End user is required'),
  distributor: z.string().min(1, 'Distributor is required'),
  cabinetType: z.string().min(1, 'Cabinet type is required'),
  cabinetTypeOther: z.string().optional(),
  tlsConnection: z.string().min(1, 'TLS connection is required'),
  tlsConnectionOther: z.string().optional(),
  detectionIO: z.string().min(1, 'Detection I/O is required'),
  detectionIOOther: z.string().optional(),
  phasingText: z.string().optional(),
  phasingFile: z.any().optional(),
  timingFiles: z.array(z.any()).optional(),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
});

export type Registration = z.infer<typeof RegistrationSchema>;

// Database functions
export const dbFunctions = {
  // User functions
  getUserByUsername: (username: string) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  createUser: (username: string, passwordHash: string, role: string = 'admin') => {
    return db.prepare(`
      INSERT INTO users (username, password_hash, role) 
      VALUES (?, ?, ?)
    `).run(username, passwordHash, role);
  },

  // Registration functions
  createRegistration: (data: any) => {
    return db.prepare(`
      INSERT INTO registrations (
        intersection_name, end_user, distributor, cabinet_type, cabinet_type_other,
        tls_connection, tls_connection_other, detection_io, detection_io_other,
        phasing_text, phasing_file_path, timing_files, contact_name, contact_email, contact_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.intersectionName,
      data.endUser,
      data.distributor,
      data.cabinetType,
      data.cabinetTypeOther || null,
      data.tlsConnection,
      data.tlsConnectionOther || null,
      data.detectionIO,
      data.detectionIOOther || null,
      data.phasingText || null,
      data.phasingFilePath || null,
      data.timingFiles ? JSON.stringify(data.timingFiles) : null,
      data.contactName,
      data.contactEmail,
      data.contactPhone
    );
  },

  getAllRegistrations: () => {
    return db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
  },

  getRegistrationById: (id: number) => {
    return db.prepare('SELECT * FROM registrations WHERE id = ?').get(id);
  },

  // Dropdown data functions
  getDistributors: () => {
    return db.prepare('SELECT * FROM distributors ORDER BY name').all();
  },

  getCabinetTypes: () => {
    return db.prepare('SELECT * FROM cabinet_types ORDER BY name').all();
  },

  getTLSConnections: () => {
    return db.prepare('SELECT * FROM tls_connections ORDER BY name').all();
  },

  getDetectionIOs: () => {
    return db.prepare('SELECT * FROM detection_ios ORDER BY name').all();
  },
};

export default db;
