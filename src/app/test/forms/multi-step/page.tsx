'use client'

import { useState } from 'react'

export default function MultiStepFormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    { id: 1, title: 'Account Details', description: 'Choose your username and password' },
    { id: 2, title: 'Personal Information', description: 'Tell us about yourself' },
    { id: 3, title: 'Preferences', description: 'Customize your experience' },
    { id: 4, title: 'Review & Submit', description: 'Confirm your information' },
  ]

  const totalSteps = steps.length

  const handleStepClick = (stepId: number) => {
    // Can only navigate to completed steps or next step
    if (completedSteps.includes(stepId) || stepId === completedSteps.length + 1) {
      setCurrentStep(stepId)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const newCompleted = [...completedSteps, currentStep]
      setCompletedSteps(newCompleted)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Step Form</h1>
          <p className="text-gray-600">
            Wizard-style form flow with step validation and progress tracking
          </p>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="space-y-4">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = step.id === currentStep
              const isAccessible =
                completedSteps.includes(step.id) || step.id === completedSteps.length + 1

              return (
                <div
                  key={step.id}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : isCompleted
                        ? 'border-green-500 bg-green-50'
                        : isAccessible
                          ? 'border-gray-300 bg-white cursor-pointer hover:border-gray-400'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <div className="ml-4">
                      <h3
                        className={`font-semibold ${
                          isCurrent
                            ? 'text-blue-900'
                            : isCompleted
                              ? 'text-green-900'
                              : 'text-gray-600'
                        }`}
                      >
                        Step {step.id}: {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="ml-4 text-green-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {completedSteps.length} of {totalSteps} steps completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.length / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{steps[currentStep - 1].title}</h2>

          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-blue-600">{currentStep}</span>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              This is step {currentStep} of {totalSteps}
            </p>
            <p className="text-gray-500">{steps[currentStep - 1].description}</p>
          </div>

          {/* Form Fields Placeholder */}
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-white border border-gray-300 rounded"></div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-white border border-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
          >
            Previous Step
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={() => {
                alert('Form submitted successfully!')
                setCurrentStep(1)
                setCompletedSteps([])
              }}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Application
            </button>
          )}
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Multi-Step Form Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">✓ Implemented Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Step validation guards</li>
                <li>Back/forward navigation</li>
                <li>Step completion tracking</li>
                <li>Visual progress indicator</li>
                <li>Click to navigate completed steps</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-600">○ To Implement:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Form data accumulation</li>
                <li>Auto-save progress to localStorage</li>
                <li>Step-specific validation</li>
                <li>Form abandonment recovery</li>
                <li>Summary before submission</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Navigation Rules:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Can navigate to any completed step</li>
              <li>• Can only proceed to next uncompleted step</li>
              <li>• Cannot skip steps</li>
              <li>• Progress is tracked visually</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
