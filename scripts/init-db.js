const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database
const db = new Database('registrations.db');

console.log('Initializing database...');

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
    timing_files TEXT,
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

// Insert default admin user
const adminPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // admin123
db.prepare(`
  INSERT OR IGNORE INTO users (username, password_hash, role) 
  VALUES (?, ?, ?)
`).run('admin', adminPassword, 'admin');

// Insert default data
const distributors = ['Distributor A', 'Distributor B', 'Distributor C', 'Other'];
distributors.forEach(name => {
  db.prepare(`
    INSERT OR IGNORE INTO distributors (name) VALUES (?)
  `).run(name);
});

const cabinetTypes = ['Type A', 'Type B', 'Type C', 'Other'];
cabinetTypes.forEach(name => {
  db.prepare(`
    INSERT OR IGNORE INTO cabinet_types (name) VALUES (?)
  `).run(name);
});

const tlsConnections = ['TLS 1.2', 'TLS 1.3', 'Other'];
tlsConnections.forEach(name => {
  db.prepare(`
    INSERT OR IGNORE INTO tls_connections (name) VALUES (?)
  `).run(name);
});

const detectionIOs = ['I/O Type A', 'I/O Type B', 'I/O Type C', 'Other'];
detectionIOs.forEach(name => {
  db.prepare(`
    INSERT OR IGNORE INTO detection_ios (name) VALUES (?)
  `).run(name);
});

console.log('Database initialized successfully!');
console.log('Default admin credentials:');
console.log('Username: admin');
console.log('Password: admin123');
console.log('');
console.log('⚠️  IMPORTANT: Change these credentials after first login!');

db.close();
