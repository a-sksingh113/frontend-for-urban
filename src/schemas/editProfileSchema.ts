import { z } from "zod";

// Helpers
const emptyToUndefined = z.literal("").transform(() => undefined);
const optionalTrimmed = (max: number, msg?: string) =>
  z.string().trim().max(max, msg).optional().or(emptyToUndefined);

// Patterns
const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;
const zipRegex = /^[A-Za-z0-9\s-]{3,20}$/;

export const editProfileSchema = z.object({
  fullName: optionalTrimmed(80, "Name is too long."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone is too long.")
    .regex(phoneRegex, "Enter a valid phone number")
    .optional()
    .or(emptyToUndefined),
  city: optionalTrimmed(60),
  state: optionalTrimmed(60),
  country: optionalTrimmed(60),
  zipCode: z
    .string()
    .trim()
    .max(20, "ZIP / Postcode is too long.")
    .regex(zipRegex, "Enter a valid ZIP / Postcode")
    .optional()
    .or(emptyToUndefined),
});

// Handy type for the form
export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
