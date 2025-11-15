'use client'

import React, { useState } from 'react'
import { useCreateUser } from '@/hooks/use-users'
import { Button } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Mail,
  Lock,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'

// Form validation types
interface FormField {
  value: string
  error: string
  touched: boolean
}

interface FormData {
  name: FormField
  email: FormField
  password: FormField
  confirmPassword: FormField
  role: FormField
}

// Validation functions
const validateName = (name: string): string => {
  if (!name.trim()) return 'Name is required'
  if (name.length < 2) return 'Name must be at least 2 characters'
  if (name.length > 50) return 'Name must be less than 50 characters'
  if (!/^[a-zA-Z\s'-]+$/.test(name))
    return 'Name can only contain letters, spaces, hyphens, and apostrophes'
  return ''
}

const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return ''
}

const validatePassword = (password: string): string => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (password.length > 128) return 'Password must be less than 128 characters'
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter'
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter'
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number'
  if (!/(?=.*[@$!%*?&])/.test(password))
    return 'Password must contain at least one special character'
  return ''
}

const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}

const validateRole = (role: string): string => {
  if (!role) return 'Please select a role'
  if (!['user', 'admin'].includes(role)) return 'Invalid role selected'
  return ''
}

// Password strength indicator
const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: 'Enter password', color: 'bg-gray-200' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[@$!%*?&]/.test(password)) score++

  const levels = [
    { score: 0, label: 'Very Weak', color: 'bg-red-500' },
    { score: 1, label: 'Weak', color: 'bg-red-400' },
    { score: 2, label: 'Fair', color: 'bg-yellow-500' },
    { score: 3, label: 'Good', color: 'bg-blue-500' },
    { score: 4, label: 'Strong', color: 'bg-green-500' },
    { score: 5, label: 'Very Strong', color: 'bg-green-600' },
  ]

  return levels[score] || levels[0]
}

function CreateForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: { value: '', error: '', touched: false },
    email: { value: '', error: '', touched: false },
    password: { value: '', error: '', touched: false },
    confirmPassword: { value: '', error: '', touched: false },
    role: { value: 'user', error: '', touched: false },
  })

  const createUserMutation = useCreateUser({
    onSuccess: () => {
      // Reset form on success
      setFormData({
        name: { value: '', error: '', touched: false },
        email: { value: '', error: '', touched: false },
        password: { value: '', error: '', touched: false },
        confirmPassword: { value: '', error: '', touched: false },
        role: { value: 'user', error: '', touched: false },
      })
      alert('User created successfully!')
    },
    onError: (error: Error) => {
      alert(`Error creating user: ${error.message}`)
    },
  })

  const updateField = (fieldName: keyof FormData, value: string) => {
    let error = ''

    switch (fieldName) {
      case 'name':
        error = validateName(value)
        break
      case 'email':
        error = validateEmail(value)
        break
      case 'password':
        error = validatePassword(value)
        // Re-validate confirm password if it has been touched
        if (formData.confirmPassword.touched) {
          setFormData((prev) => ({
            ...prev,
            [fieldName]: { value, error, touched: true },
            confirmPassword: {
              ...prev.confirmPassword,
              error: validateConfirmPassword(value, prev.confirmPassword.value),
            },
          }))
          return
        }
        break
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password.value, value)
        break
      case 'role':
        error = validateRole(value)
        break
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: { value, error, touched: true },
    }))
  }

  const validateForm = (): boolean => {
    const errors = {
      name: validateName(formData.name.value),
      email: validateEmail(formData.email.value),
      password: validatePassword(formData.password.value),
      confirmPassword: validateConfirmPassword(
        formData.password.value,
        formData.confirmPassword.value
      ),
      role: validateRole(formData.role.value),
    }

    setFormData((prev) => ({
      name: { ...prev.name, error: errors.name, touched: true },
      email: { ...prev.email, error: errors.email, touched: true },
      password: { ...prev.password, error: errors.password, touched: true },
      confirmPassword: { ...prev.confirmPassword, error: errors.confirmPassword, touched: true },
      role: { ...prev.role, error: errors.role, touched: true },
    }))

    return Object.values(errors).every((error) => !error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await createUserMutation.mutateAsync({
        name: formData.name.value.trim(),
        email: formData.email.value.trim(),
        password: formData.password.value,
        role: formData.role.value as 'user' | 'admin',
      })
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password.value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
        <CardDescription>
          Add a new user to the system with proper validation and security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="name"
                type="text"
                value={formData.name.value}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={() =>
                  setFormData((prev) => ({ ...prev, name: { ...prev.name, touched: true } }))
                }
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.name.touched && formData.name.error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter full name"
                disabled={createUserMutation.isPending}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {formData.name.touched &&
                  (formData.name.error ? (
                    <X className="w-4 h-4 text-red-500" />
                  ) : (
                    formData.name.value && <Check className="w-4 h-4 text-green-500" />
                  ))}
              </div>
            </div>
            {formData.name.touched && formData.name.error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formData.name.error}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="email"
                type="email"
                value={formData.email.value}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={() =>
                  setFormData((prev) => ({ ...prev, email: { ...prev.email, touched: true } }))
                }
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.email.touched && formData.email.error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="user@example.com"
                disabled={createUserMutation.isPending}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {formData.email.touched &&
                  (formData.email.error ? (
                    <X className="w-4 h-4 text-red-500" />
                  ) : (
                    formData.email.value && <Check className="w-4 h-4 text-green-500" />
                  ))}
              </div>
            </div>
            {formData.email.touched && formData.email.error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formData.email.error}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password.value}
                onChange={(e) => updateField('password', e.target.value)}
                onBlur={() =>
                  setFormData((prev) => ({
                    ...prev,
                    password: { ...prev.password, touched: true },
                  }))
                }
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.password.touched && formData.password.error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter password"
                disabled={createUserMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password.value && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password strength</span>
                  <span className="text-xs font-medium">{passwordStrength.label}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {formData.password.touched && formData.password.error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formData.password.error}
              </p>
            )}

            {/* Password Requirements */}
            <div className="mt-2 text-xs text-gray-600">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li className={/(?=.*[a-z])/.test(formData.password.value) ? 'text-green-600' : ''}>
                  At least one lowercase letter
                </li>
                <li className={/(?=.*[A-Z])/.test(formData.password.value) ? 'text-green-600' : ''}>
                  At least one uppercase letter
                </li>
                <li className={/\d/.test(formData.password.value) ? 'text-green-600' : ''}>
                  At least one number
                </li>
                <li className={/[@$!%*?&]/.test(formData.password.value) ? 'text-green-600' : ''}>
                  At least one special character (@$!%*?&)
                </li>
                <li className={formData.password.value.length >= 8 ? 'text-green-600' : ''}>
                  At least 8 characters
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword.value}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                onBlur={() =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: { ...prev.confirmPassword, touched: true },
                  }))
                }
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.confirmPassword.touched && formData.confirmPassword.error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Confirm password"
                disabled={createUserMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.confirmPassword.touched && formData.confirmPassword.error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formData.confirmPassword.error}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                id="role"
                value={formData.role.value}
                onChange={(e) => updateField('role', e.target.value)}
                onBlur={() =>
                  setFormData((prev) => ({ ...prev, role: { ...prev.role, touched: true } }))
                }
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
                  formData.role.touched && formData.role.error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                disabled={createUserMutation.isPending}
              >
                <option value="">Select a role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {formData.role.touched &&
                  (formData.role.error ? (
                    <X className="w-4 h-4 text-red-500" />
                  ) : (
                    formData.role.value && <Check className="w-4 h-4 text-green-500" />
                  ))}
              </div>
            </div>
            {formData.role.touched && formData.role.error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formData.role.error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={createUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createUserMutation.isPending}
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? 'Creating User...' : 'Create User'}
            </Button>
          </div>

          {/* Error Display */}
          {createUserMutation.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800">Error creating user</h4>
                  <p className="mt-1 text-sm text-red-700">
                    {createUserMutation.error instanceof Error
                      ? createUserMutation.error.message
                      : 'An unexpected error occurred'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default function CreateUserPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Creation</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive form validation with real-time feedback and security requirements
          </p>
        </div>

        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>

        <CreateForm />

        {/* Feature Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Form Validation Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold">Real-time Validation:</h3>
              <ul>
                <li>Field validation on change and blur events</li>
                <li>Visual feedback with checkmarks and X icons</li>
                <li>Error messages with contextual icons</li>
                <li>Disabled state during submission</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Security Features:</h3>
              <ul>
                <li>Password strength indicator with visual feedback</li>
                <li>Comprehensive password requirements</li>
                <li>Password confirmation validation</li>
                <li>Secure input handling with proper sanitization</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">User Experience:</h3>
              <ul>
                <li>Clear error messages with helpful descriptions</li>
                <li>Input icons for better field identification</li>
                <li>Password visibility toggle</li>
                <li>Loading states during API calls</li>
                <li>Form reset on successful submission</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Type Safety:</h3>
              <ul>
                <li>Fully typed form data structure</li>
                <li>Type-safe validation functions</li>
                <li>Proper error handling with types</li>
                <li>TanStack Query integration with type safety</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Validation Rules:</h3>
              <ul>
                <li>Name: 2-50 characters, letters only</li>
                <li>Email: Valid email format required</li>
                <li>Password: 8+ chars with mixed case, numbers, and special chars</li>
                <li>Role: Must select user or admin</li>
                <li>All fields: No trimming of whitespace</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
