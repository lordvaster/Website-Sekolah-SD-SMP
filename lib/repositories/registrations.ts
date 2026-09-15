// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type RegistrationStatus = "baru" | "dihubungi" | "diterima" | "ditolak";

export type Registration = {
  id: number;
  childName: string;
  childAge: number;
  program: string;
  parentName: string;
  email: string;
  phone: string;
  status: RegistrationStatus;
  createdAt: string;
};

type RegistrationRow = {
  id: number;
  child_name: string;
  child_age: number;
  program: string;
  parent_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
};

function mapRow(row: RegistrationRow): Registration {
  return {
    id: row.id,
    childName: row.child_name,
    childAge: row.child_age,
    program: row.program,
    parentName: row.parent_name,
    email: row.email,
    phone: row.phone,
    status: row.status as RegistrationStatus,
    createdAt: row.created_at,
  };
}

export function listRegistrations(): Registration[] {
  const rows = db
    .prepare("SELECT * FROM registrations ORDER BY created_at DESC, id DESC")
    .all() as RegistrationRow[];
  return rows.map(mapRow);
}

export type RegistrationInput = {
  childName: string;
  childAge: number;
  program: string;
  parentName: string;
  email: string;
  phone: string;
};

export function createRegistration(input: RegistrationInput): Registration {
  const result = db
    .prepare(
      `INSERT INTO registrations (child_name, child_age, program, parent_name, email, phone)
       VALUES (@childName, @childAge, @program, @parentName, @email, @phone)`
    )
    .run(input);
  const row = db
    .prepare("SELECT * FROM registrations WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as RegistrationRow;
  return mapRow(row);
}

export function updateRegistrationStatus(id: number, status: RegistrationStatus): boolean {
  const result = db.prepare("UPDATE registrations SET status = ? WHERE id = ?").run(status, id);
  return result.changes > 0;
}
