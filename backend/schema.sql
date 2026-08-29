-- Digital Library schema (derived from SQL queries in backend/routes/*)
-- Apply with: mysql -u root < backend/schema.sql

CREATE DATABASE IF NOT EXISTS student_records;
CREATE DATABASE IF NOT EXISTS digital_library;
CREATE DATABASE IF NOT EXISTS content_db;
CREATE DATABASE IF NOT EXISTS adminDb;

-- students (backend/db.js -> student_records)
USE student_records;
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  class_name VARCHAR(50),
  password VARCHAR(255)
);

-- books (backend/bookDb.js -> digital_library)
USE digital_library;
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  department VARCHAR(100),
  bookposter VARCHAR(255),
  bookpdf VARCHAR(255)
);

-- teachers + content (backend/teacherDb.js, contentDb.js -> content_db)
USE content_db;
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(20),
  department VARCHAR(100),
  username VARCHAR(100),
  password VARCHAR(255),
  profile_photo VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT,
  class_name VARCHAR(50),
  subject VARCHAR(100),
  category VARCHAR(100),
  study_material VARCHAR(255),
  material_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_content_teacher FOREIGN KEY (teacher_id)
    REFERENCES teachers (id) ON DELETE CASCADE
);

-- admins (backend/routes/adminLogin.js -> adminDb)
USE adminDb;
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
