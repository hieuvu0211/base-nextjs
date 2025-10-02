import { z } from 'zod'

const phoneRegex = /^(\+84|0)\d{9,10}$/

const Step1Schema = z.object({
  fullName: z
    .string({ message: 'Họ tên học sinh là bắt buộc' })
    .min(5, 'Họ tên học sinh phải có ít nhất 5 ký tự')
    .min(1, 'Họ tên học sinh là bắt buộc'),
  schoolName: z.string({ message: 'Trường học là bắt buộc' }).min(1, 'Trường học là bắt buộc'),
  studentAddress: z.string().optional(),
  dateOfBirth: z.date({ message: 'Ngày sinh là bắt buộc' }), //đang bị lỗi => nếu nhập sẽ không bấm tiếp tục được:w
  className: z.string({ message: 'Tên lớp học là bắt buộc' }).min(1, 'Tên lớp học là bắt buộc'),
  schoolAddress: z
    .string({ message: 'Địa chỉ của trường là bắt buộc' })
    .min(1, 'Địa chỉ của trường là bắt buộc'),
  parentName: z
    .string({ message: 'Họ và tên phụ huynh là bắt buộc' })
    .min(1, 'Họ và tên phụ huynh là bắt buộc'),
  parentPhoneNumber: z
    .string({ message: 'Số điện thoại của phụ huynh là bắt buộc' })
    .min(1, 'Số điện thoại của phụ huynh là bắt buộc')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  parentEmail: z
    .string({ message: 'Email của phụ huynh là bắt buộc' })
    .email('Email không hợp lệ')
    .min(1, 'Email là bắt buộc'),
})

const Step2Schema = z
  .object({
    email: z
      .string({ message: 'Email là bắt buộc' })
      .email('Email không hợp lệ')
      .min(1, 'Email là bắt buộc'),
    username: z
      .string({ message: 'Tên đăng nhập là bắt buộc' })
      .min(5, 'Tên đăng nhập tối thiếu 5 ký tự')
      .regex(/^[a-zA-Z0-9]+$/, 'Tên đăng nhập chỉ được chứa chữ cái không dấu và số'),
    password: z.string({ message: 'Mật khẩu là bắt buộc' }).min(5, 'Mật khẩu tối thiểu 5 ký tự'),
    confirmPassword: z
      .string({ message: 'Xác nhận mật khẩu là bắt buộc' })
      .min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

const Step3Schema = z.object({
  contest_group_stage: z.string().default('1'),
  groupMemberInfo: z
    .array(
      z.object({
        name: z
          .string({ message: 'Tên thành viên là bắt buộc' })
          .min(5, 'Tên thành viên tối thiểu là 5 ký tự')
          .optional()
          .default(''),
        schoolName: z
          .string({ message: 'Trường học là bắt buộc' })
          .min(1, 'Trường học là bắt buộc')
          .optional()
          .default(''),
        phone: z
          .string({ message: 'Số điện thoại là bắt buộc' })
          .min(1, 'Số điện thoại là bắt buộc')
          .regex(phoneRegex, 'Số điện thoại không hợp lệ')
          .optional()
          .default(''),
        dob: z.date({ message: 'Ngày sinh là bắt buộc' }),
        parentName: z.string().optional(),
        //parentPhoneNumber only number
        parentPhoneNumber: z.string().optional(),
      })
    )
    .optional(),
})

export const wizardSchema = z.object({
  stepOne: Step1Schema,
  stepTwo: Step2Schema,
  stepThree: Step3Schema,
})

export type WizardSchema = z.infer<typeof wizardSchema>
