import { z } from "zod";

export const createCustomerFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama tidak boleh kosong" })
    .max(150, { message: "Nama tidak boleh lebih dari 150 karakter" }),

  email: z
    .string()
    .max(150, { message: "Email tidak boleh lebih dari 150 karakter" })
    .optional()
    .refine(
      (email) => !email || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email),
      {
        message: "Format email tidak valid",
      },
    ),

  address: z
    .string()
    .min(1, { message: "Alamat tidak boleh kosong" })
    .max(255, { message: "Alamat tidak boleh lebih dari 255 karakter" }),

  phone: z
    .string()
    .min(1, { message: "Nomor telepon tidak boleh kosong" })
    .max(20, { message: "Nomor telepon tidak boleh lebih dari 20 karakter" })
    .regex(/^\d+$/, { message: "Nomor telepon hanya boleh berisi angka" }), // Validasi hanya angka
});

export const updateCustomerFormSchema = createCustomerFormSchema.partial();
