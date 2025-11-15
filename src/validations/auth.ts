import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .transform((val) => val.trim()),
    email: z
      .string()
      .email('Invalid email address')
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase, lowercase, and number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
