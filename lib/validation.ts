// Author: Zeday | https://join.co.id
import { z } from "zod";
import type { Dictionary } from "./i18n/dictionaries";

// Skema tervalidasi di server SELALU pakai pesan Bahasa Indonesia (lihat
// contactSchema/registrationSchema di bawah) - route handler tidak tahu
// bahasa UI pengunjung. Versi getXxxSchema(dict) di bawah dipakai di
// client (ContactForm/RegistrationForm) supaya validasi real-time sebelum
// submit tampil sesuai bahasa yang dipilih pengunjung.
function buildPhoneSchema(msg: Dictionary["contactForm"]["validation"]) {
  return z
    .string()
    .trim()
    .min(9, msg.phoneMin)
    .max(15, msg.phoneMax)
    .regex(/^[0-9+()\s-]+$/, msg.phoneDigitsOnly)
    .regex(/\d/, msg.phoneMustHaveDigit);
}

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

export function getContactSchema(dict: Dictionary) {
  const { validation: msg } = dict.contactForm;
  return z.object({
    name: z.string().trim().min(2, msg.nameMin).max(100),
    email: z.string().trim().email(msg.emailInvalid),
    phone: buildPhoneSchema(msg),
    message: z.string().trim().min(10, msg.messageMin).max(2000),
  });
}

export const registrationSchema = z.object({
  childName: z.string().trim().min(2, "Nama anak minimal 2 karakter").max(100),
  childAge: z.coerce.number().int().min(3, "Usia minimal 3 tahun").max(13, "Usia maksimal 13 tahun"),
  program: z.string().trim().min(1, "Pilih jenjang yang dituju").max(120),
  parentName: z.string().trim().min(2, "Nama orang tua minimal 2 karakter").max(100),
  email: emailSchema,
  phone: phoneSchema,
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export function getRegistrationSchema(dict: Dictionary) {
  const { validation: msg } = dict.registrationForm;
  const { validation: contactMsg } = dict.contactForm;
  return z.object({
    childName: z.string().trim().min(2, msg.childNameMin).max(100),
    childAge: z.coerce.number().int().min(3, msg.childAgeMin).max(13, msg.childAgeMax),
    program: z.string().trim().min(1, msg.programRequired).max(120),
    parentName: z.string().trim().min(2, msg.parentNameMin).max(100),
    email: z.string().trim().email(contactMsg.emailInvalid),
    phone: buildPhoneSchema(contactMsg),
  });
}
