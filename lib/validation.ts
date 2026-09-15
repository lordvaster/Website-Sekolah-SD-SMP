// Author: Zeday | https://join.co.id
import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(9, "Nomor telepon minimal 9 digit")
  .max(15, "Nomor telepon maksimal 15 digit")
  .regex(/^[0-9+()\s-]+$/, "Nomor telepon hanya boleh berisi angka")
  .regex(/\d/, "Nomor telepon harus berisi angka");

const emailSchema = z.string().trim().email("Format email tidak valid");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const registrationSchema = z.object({
  childName: z.string().trim().min(2, "Nama anak minimal 2 karakter").max(100),
  childAge: z.coerce.number().int().min(3, "Usia minimal 3 tahun").max(13, "Usia maksimal 13 tahun"),
  program: z.string().trim().min(1, "Pilih jenjang yang dituju").max(120),
  parentName: z.string().trim().min(2, "Nama orang tua minimal 2 karakter").max(100),
  email: emailSchema,
  phone: phoneSchema,
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
