const { Pool } = require("pg");
require("dotenv/config");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    // Create database if not exists
    await pool.query("CREATE DATABASE attendace_marker");
    console.log("Database created successfully");
    
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        email VARCHAR UNIQUE,
        role VARCHAR DEFAULT 'STUDENT',
        status VARCHAR DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        code VARCHAR UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        code VARCHAR UNIQUE,
        description TEXT,
        department_id UUID REFERENCES departments(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS academic_years (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        is_current BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS semesters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        year UUID REFERENCES academic_years(id),
        code VARCHAR,
        is_current BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        register_number VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        email VARCHAR UNIQUE,
        phone VARCHAR,
        department_id UUID REFERENCES departments(id),
        course_id UUID REFERENCES courses(id),
        current_semester_id UUID REFERENCES semesters(id),
        profile_id UUID UNIQUE REFERENCES profiles(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR,
        last_name VARCHAR,
        email VARCHAR UNIQUE,
        phone VARCHAR,
        department_id UUID REFERENCES departments(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        code VARCHAR UNIQUE,
        credits INTEGER,
        department_id UUID REFERENCES departments(id),
        faculty_id UUID REFERENCES faculty(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        code VARCHAR UNIQUE,
        semester_id UUID REFERENCES semesters(id),
        teacher_id UUID REFERENCES faculty(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS class_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        class_id UUID REFERENCES classes(id),
        subject_id UUID REFERENCES subjects(id),
        date TIMESTAMP,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        status VARCHAR DEFAULT 'OPEN',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id),
        class_session_id UUID REFERENCES class_sessions(id),
        status VARCHAR DEFAULT 'ABSENT' CHECK (status IN ('PRESENT', 'ABSENT', 'ON_DUTY', 'APPROVED_LEAVE', 'CANCELLED_SESSION')),
        marked_at TIMESTAMP DEFAULT NOW(),
        marked_by UUID REFERENCES faculty(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS internal_assessments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR,
        type VARCHAR,
        max_marks INTEGER,
        min_attendance INTEGER,
        weight FLOAT DEFAULT 1.0,
        semester_id UUID REFERENCES semesters(id),
        subject_id UUID REFERENCES subjects(id),
        faculty_id UUID REFERENCES faculty(id),
        academic_year_id UUID REFERENCES academic_years(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS internal_marks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id),
        subject_id UUID REFERENCES subjects(id),
        assessment_id UUID REFERENCES internal_assessments(id),
        obtained_marks INTEGER,
        attendance_percentage FLOAT,
        final_grade VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id),
        course_id UUID REFERENCES courses(id),
        semester_id UUID REFERENCES semesters(id),
        academic_year_id UUID REFERENCES academic_years(id),
        status VARCHAR DEFAULT 'ACTIVE',
        enrolled_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action VARCHAR,
        entity_type VARCHAR,
        entity_id VARCHAR,
        performed_by VARCHAR,
        performed_by_role VARCHAR,
        details JSON,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key VARCHAR UNIQUE,
        value VARCHAR,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await pool.end();
  }
}

setupDatabase();