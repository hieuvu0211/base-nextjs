'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle,
  XCircle,
  FileText,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Info,
  Loader2,
} from 'lucide-react'

// Validation rule interface
interface ValidationRule {
  field: string
  rule: string
  isValid: boolean
  message: string
}

// Form field interface
interface FormField {
  name: string
  value: string
  errors: string[]
  warnings: string[]
  isValid: boolean
  isTouched: boolean
}

// Validation engine
class ValidationEngine {
  static rules = {
    required: (value: string) => !!value?.trim() || 'This field is required',
    minLength: (min: number) => (value: string) =>
      value?.length >= min || `Minimum ${min} characters required`,
    maxLength: (max: number) => (value: string) =>
      value?.length <= max || `Maximum ${max} characters allowed`,
    email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email format',
    phone: (value: string) =>
      (/^[\d\s\-\+\(\)]+$/.test(value) && value?.replace(/\D/g, '').length >= 10) ||
      'Invalid phone number',
    password: (value: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value) ||
      'Password must contain uppercase, lowercase, number, and special character',
    creditCard: (value: string) =>
      (/^[\d\s\-]{13,19}$/.test(value) && this.luhnCheck(value.replace(/\s/g, '-'))) ||
      'Invalid credit card number',
    url: (value: string) => /^https?:\/\/.+/.test(value) || 'Invalid URL format',
    numeric: (value: string) => /^\d+$/.test(value) || 'Must be numeric',
    alphanumeric: (value: string) =>
      /^[a-zA-Z0-9]+$/.test(value) || 'Only letters and numbers allowed',
    date: (value: string) => {
      const date = new Date(value)
      return !isNaN(date.getTime()) || 'Invalid date format'
    },
    age: (min: number, max: number) => (value: string) => {
      const age = parseInt(value)
      return (age >= min && age <= max) || `Age must be between ${min} and ${max}`
    },
    file: (allowedTypes: string[]) => (file: File) => {
      return (
        allowedTypes.includes(file.type) ||
        `File type not allowed. Allowed: ${allowedTypes.join(', ')}`
      )
    },
    fileSize: (maxSizeMB: number) => (file: File) => {
      return file.size <= maxSizeMB * 1024 * 1024 || `File size must be less than ${maxSizeMB}MB`
    },
  }

  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0
    let isEven = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  static validateField(_fieldName: string, value: string | File, fieldRules: string[]): string[] {
    const errors: string[] = []

    for (const rule of fieldRules) {
      const ruleMatch = rule.match(/(\w+)(?:\((.*)\))?/)
      if (!ruleMatch) continue

      const [, ruleName, params] = ruleMatch
      const ruleFunc = this.rules[ruleName as keyof typeof this.rules]

      if (ruleFunc && typeof ruleFunc === 'function') {
        let validationResult: string | boolean
        if (params) {
          const paramValues = params.split(',').map((p) => p.trim())
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          validationResult = (ruleFunc as any)(...paramValues)(value)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          validationResult = (ruleFunc as any)(value)
        }

        if (typeof validationResult === 'string') {
          errors.push(validationResult)
        }
      }
    }

    return errors
  }
}

export default function ValidationErrorsPage() {
  // Form state
  const [formFields, setFormFields] = useState<Record<string, FormField>>({
    username: {
      name: 'username',
      value: '',
      errors: [],
      warnings: [],
      isValid: false,
      isTouched: false,
    },
    email: { name: 'email', value: '', errors: [], warnings: [], isValid: false, isTouched: false },
    password: {
      name: 'password',
      value: '',
      errors: [],
      warnings: [],
      isValid: false,
      isTouched: false,
    },
    confirmPassword: {
      name: 'confirmPassword',
      value: '',
      errors: [],
      warnings: [],
      isValid: false,
      isTouched: false,
    },
    phone: { name: 'phone', value: '', errors: [], warnings: [], isValid: false, isTouched: false },
    age: { name: 'age', value: '', errors: [], warnings: [], isValid: false, isTouched: false },
    website: {
      name: 'website',
      value: '',
      errors: [],
      warnings: [],
      isValid: false,
      isTouched: false,
    },
    address: {
      name: 'address',
      value: '',
      errors: [],
      warnings: [],
      isValid: false,
      isTouched: false,
    },
    creditCard: {
      name: 'creditCard',
      value: '',
      errors: [],
      warnings: [],
      isValid: false,
      isTouched: false,
    },
    zipCode: {
      name: 'zipCode',
      value: '',
      errors: [],
      warnings: [],
      isValid: false,
      isTouched: false,
    },
  })

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<ValidationRule[]>([])
  const [showRealTimeValidation, setShowRealTimeValidation] = useState(true)

  // Field validation rules
  const fieldRules: Record<string, string[]> = {
    username: ['required', 'minLength(3)', 'maxLength(20)', 'alphanumeric'],
    email: ['required', 'email'],
    password: ['required', 'minLength(8)', 'maxLength(128)', 'password'],
    confirmPassword: ['required', 'minLength(8)', 'maxLength(128)'],
    phone: ['required', 'phone'],
    age: ['required', 'numeric', 'age(18, 120)'],
    website: ['url'],
    address: ['required', 'maxLength(200)'],
    creditCard: ['creditCard'],
    zipCode: ['required', 'alphanumeric', 'minLength(5)', 'maxLength(10)'],
  }

  // Validate single field
  const validateField = (fieldName: string, value: string) => {
    const rules = fieldRules[fieldName] || []
    const errors = ValidationEngine.validateField(fieldName, value, rules)

    // Special validation for confirm password
    if (fieldName === 'confirmPassword' && value) {
      if (value !== formFields.password.value) {
        errors.push('Passwords do not match')
      }
    }

    return errors
  }

  // Handle field change
  const handleFieldChange = (fieldName: string, value: string) => {
    const errors = validateField(fieldName, value)
    const isValid = errors.length === 0

    setFormFields((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        errors,
        isValid,
        isTouched: true,
      },
    }))

    if (showRealTimeValidation) {
      updateValidationResults()
    }
  }

  // Update validation results
  const updateValidationResults = () => {
    const results: ValidationRule[] = []

    Object.entries(formFields).forEach(([fieldName, field]) => {
      if (field.isTouched) {
        Object.entries(fieldRules).forEach(([name, rules]) => {
          if (name === fieldName) {
            rules.forEach((rule) => {
              const ruleMatch = rule.match(/(\w+)(?:\((.*)\))?/)
              if (ruleMatch) {
                const [, ruleName] = ruleMatch
                const ruleFunc =
                  ValidationEngine.rules[ruleName as keyof typeof ValidationEngine.rules]

                if (ruleFunc && typeof ruleFunc === 'function') {
                  try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const result = (ruleFunc as any)(field.value)
                    results.push({
                      field: fieldName,
                      rule,
                      isValid: result === true,
                      message: typeof result === 'string' ? result : 'Valid',
                    })
                  } catch {
                    // Skip invalid rule parameters
                  }
                }
              }
            })
          }
        })
      }
    })

    setValidationResults(results)
  }

  // Validate entire form
  const validateForm = async () => {
    setIsValidating(true)

    // Mark all fields as touched
    const updatedFields: Record<string, FormField> = {}

    Object.entries(formFields).forEach(([fieldName, field]) => {
      const errors = validateField(fieldName, field.value)
      updatedFields[fieldName] = {
        ...field,
        errors,
        isValid: errors.length === 0,
        isTouched: true,
      }
    })

    setFormFields(updatedFields)
    updateValidationResults()

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate async validation
    setIsValidating(false)
  }

  // Clear form
  const clearForm = () => {
    const clearedFields: Record<string, FormField> = {}

    Object.keys(formFields).forEach((fieldName) => {
      clearedFields[fieldName] = {
        name: fieldName,
        value: '',
        errors: [],
        warnings: [],
        isValid: false,
        isTouched: false,
      }
    })

    setFormFields(clearedFields)
    setValidationResults([])
  }

  // Fill with valid data
  const fillValidData = () => {
    const validData: Record<string, string> = {
      username: 'john_doe123',
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      phone: '+1 (555) 123-4567',
      age: '25',
      website: 'https://example.com',
      address: '123 Main St, City, State',
      creditCard: '4242 4242 4242 4242',
      zipCode: '12345',
    }

    Object.entries(validData).forEach(([fieldName, value]) => {
      handleFieldChange(fieldName, value)
    })
  }

  // Fill with invalid data
  const fillInvalidData = () => {
    const invalidData: Record<string, string> = {
      username: 'ab',
      email: 'invalid-email',
      password: 'weak',
      confirmPassword: 'different',
      phone: 'abc',
      age: '150',
      website: 'not-a-url',
      address: '',
      creditCard: '1234',
      zipCode: 'a',
    }

    Object.entries(invalidData).forEach(([fieldName, value]) => {
      handleFieldChange(fieldName, value)
    })
  }

  const totalErrors = Object.values(formFields).reduce((sum, field) => sum + field.errors.length, 0)
  const isFormValid = Object.values(formFields).every((field) => field.isValid || !field.isTouched)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Validation Error Testing</h1>
          <p className="text-gray-600">
            Test various validation scenarios and error handling patterns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={fillValidData} variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Fill Valid Data
                  </Button>
                  <Button onClick={fillInvalidData} variant="outline" size="sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    Fill Invalid Data
                  </Button>
                  <Button onClick={validateForm} disabled={isValidating} loading={isValidating}>
                    <Loader2 className="w-4 h-4 mr-2" />
                    Validate Form
                  </Button>
                  <Button onClick={clearForm} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Form
                  </Button>
                  <Button
                    onClick={() => setShowRealTimeValidation(!showRealTimeValidation)}
                    variant={showRealTimeValidation ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Real-time: {showRealTimeValidation ? 'On' : 'Off'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    User Registration Form
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      totalErrors === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {totalErrors} {totalErrors === 1 ? 'Error' : 'Errors'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Username */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    Username
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formFields.username.value}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formFields.username.errors.length > 0
                        ? 'border-red-300 bg-red-50'
                        : formFields.username.isValid && formFields.username.isTouched
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300'
                    }`}
                    placeholder="Enter username (3-20 chars, alphanumeric)"
                  />
                  {formFields.username.errors.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {formFields.username.errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-1" />
                    Email Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    value={formFields.email.value}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formFields.email.errors.length > 0
                        ? 'border-red-300 bg-red-50'
                        : formFields.email.isValid && formFields.email.isTouched
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {formFields.email.errors.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {formFields.email.errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 mr-1" />
                      Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.password ? 'text' : 'password'}
                        value={formFields.password.value}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formFields.password.errors.length > 0
                            ? 'border-red-300 bg-red-50'
                            : formFields.password.isValid && formFields.password.isTouched
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-300'
                        }`}
                        placeholder="Enter secure password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            password: !prev.password,
                          }))
                        }
                        className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.password ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {formFields.password.errors.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {formFields.password.errors.map((error, index) => (
                          <div key={index} className="flex items-center text-sm text-red-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 mr-1" />
                      Confirm Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirmPassword ? 'text' : 'password'}
                        value={formFields.confirmPassword.value}
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formFields.confirmPassword.errors.length > 0
                            ? 'border-red-300 bg-red-50'
                            : formFields.confirmPassword.isValid &&
                                formFields.confirmPassword.isTouched
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-300'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirmPassword: !prev.confirmPassword,
                          }))
                        }
                        className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {formFields.confirmPassword.errors.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {formFields.confirmPassword.errors.map((error, index) => (
                          <div key={index} className="flex items-center text-sm text-red-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-1" />
                      Phone Number
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formFields.phone.value}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formFields.phone.errors.length > 0
                          ? 'border-red-300 bg-red-50'
                          : formFields.phone.isValid && formFields.phone.isTouched
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {formFields.phone.errors.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {formFields.phone.errors.map((error, index) => (
                          <div key={index} className="flex items-center text-sm text-red-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      Age
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      value={formFields.age.value}
                      onChange={(e) => handleFieldChange('age', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formFields.age.errors.length > 0
                          ? 'border-red-300 bg-red-50'
                          : formFields.age.isValid && formFields.age.isTouched
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300'
                      }`}
                      placeholder="18-120"
                    />
                    {formFields.age.errors.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {formFields.age.errors.map((error, index) => (
                          <div key={index} className="flex items-center text-sm text-red-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={validateForm}
                    disabled={!isFormValid || isValidating}
                    loading={isValidating}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Submit Registration
                  </Button>
                  {!isFormValid && (
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Please fix all validation errors before submitting
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Validation Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Validation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-medium mb-2">Required Fields:</div>
                  <div className="text-gray-600">• Username (3-20 chars, alphanumeric)</div>
                  <div className="text-gray-600">• Email (valid format)</div>
                  <div className="text-gray-600">• Password (8+ chars, complex)</div>
                  <div className="text-gray-600">• Confirm Password (matches)</div>
                  <div className="text-gray-600">• Phone (10+ digits)</div>
                  <div className="text-gray-600">• Age (18-120)</div>
                  <div className="text-gray-600">• Address (max 200 chars)</div>
                  <div className="text-gray-600">• Zip Code (5-10 chars, alphanumeric)</div>
                  <div className="text-gray-600">• Website (valid URL, optional)</div>
                  <div className="text-gray-600">• Credit Card (valid format, optional)</div>
                </div>
              </CardContent>
            </Card>

            {/* Validation Results */}
            {validationResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Validation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {validationResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          result.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                      >
                        <div className="font-medium">
                          {result.field} - {result.rule}
                        </div>
                        <div className="text-xs mt-1 opacity-75">{result.message}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Field Status */}
            <Card>
              <CardHeader>
                <CardTitle>Field Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(formFields).map(([fieldName, field]) => (
                    <div
                      key={fieldName}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm font-medium capitalize">
                        {fieldName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center space-x-2">
                        {field.isTouched && (
                          <>
                            {field.isValid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            {field.errors.length > 0 && (
                              <span className="text-xs text-red-600 font-medium">
                                {field.errors.length}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
