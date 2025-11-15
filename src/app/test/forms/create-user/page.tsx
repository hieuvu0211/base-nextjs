'use client'

import { useState } from 'react'

export default function CreateFormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const steps = [
    { id: 1, name: 'Personal Info' },
    { id: 2, name: 'Contact' },
    { id: 3, name: 'Additional' },
    { id: 4, name: 'Review' },
  ]

  const totalSteps = steps.length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complex User Form</h1>
          <p className="text-gray-600">
            Multi-field user creation with conditional logic and state persistence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : step.id < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    step.id === currentStep ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  {step.name}
                </span>
                {step.id < totalSteps && (
                  <div className="w-24 h-1 bg-gray-200 ml-4">
                    <div
                      className={`h-1 ${step.id < currentStep ? 'bg-green-600' : 'bg-gray-200'}`}
                      style={{ width: step.id < currentStep ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Content Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Step {currentStep}: {steps[currentStep - 1].name}
            </h3>
            <p className="text-gray-600 mb-6">
              This step should contain form fields for {steps[currentStep - 1].name.toLowerCase()}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => {
                  setSaving(true)
                  setTimeout(() => {
                    setSaving(false)
                    alert('Form submitted successfully!')
                  }, 2000)
                }}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {saving ? 'Submitting...' : 'Submit Form'}
              </button>
            )}
          </div>
        </div>

        {/* Expected Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Expected Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Form Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Multi-step wizard with progress bar</li>
                <li>✅ Step validation guards</li>
                <li>✅ Back/forward navigation</li>
                <li>✅ Form data accumulation</li>
                <li>✅ Save progress indicator</li>
                <li>✅ Summary before final submission</li>
                <li>✅ Form abandonment handling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Field Types:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Text inputs (name, email, phone)</li>
                <li>• Address autocomplete</li>
                <li>• Date range picker</li>
                <li>• Phone number formatting</li>
                <li>• File upload with preview</li>
                <li>• Multi-select tags</li>
                <li>• Toggle switches</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> This is a placeholder page. The actual implementation should
              include: Form state persistence, auto-save to localStorage, conditional field logic,
              and real-time validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
