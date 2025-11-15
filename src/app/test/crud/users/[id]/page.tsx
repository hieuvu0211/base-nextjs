'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserById, updateUser } from '@/services/user-service'
import { User } from '@/types/common'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton-card'
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  MapPin,
  Phone,
  Globe,
  Building,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Camera,
} from 'lucide-react'

// Extended User interface for additional fields
interface ExtendedUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  company?: string
}

// Form interface for editable fields
interface UserFormData {
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  company?: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    avatar: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    company: '',
  })

  const userId = params.id as string

  // Fetch user data
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsEditing(false)
      // Show success message
    },
    onError: (error) => {
      console.error('Failed to update user:', error)
      // Show error message
    },
  })

  // Initialize form data when user is loaded
  React.useEffect(() => {
    if (user?.data) {
      const userData = user.data as ExtendedUser
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar || '',
        bio: userData.bio || '',
        location: userData.location || '',
        phone: userData.phone || '',
        website: userData.website || '',
        company: userData.company || '',
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original user data
    if (user?.data) {
      const userData = user.data as ExtendedUser
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar || '',
        bio: userData.bio || '',
        location: userData.location || '',
        phone: userData.phone || '',
        website: userData.website || '',
        company: userData.company || '',
      })
    }
  }

  const handleSave = async () => {
    if (!user?.data) return

    const updateData: Partial<User> & Partial<ExtendedUser> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: formData.avatar,
      updatedAt: new Date().toISOString(),
    }

    // Add optional fields if they exist
    if (formData.bio) updateData.bio = formData.bio
    if (formData.location) updateData.location = formData.location
    if (formData.phone) updateData.phone = formData.phone
    if (formData.website) updateData.website = formData.website
    if (formData.company) updateData.company = formData.company

    updateMutation.mutate({ id: userId, data: updateData })
  }

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
          <SkeletonCard lines={8} />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !user?.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">User not found</span>
              </div>
              <p className="mt-2 text-gray-600">
                The user you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const userInfo = user.data as ExtendedUser

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  loading={updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {updateMutation.isSuccess && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">User updated successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {updateMutation.isError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Failed to update user</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Please try again or contact support if the problem persists.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {formData.avatar ? (
                        <Image
                          src={formData.avatar}
                          alt={formData.name}
                          width={80}
                          height={80}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        formData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Full name"
                        />
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{userInfo.name}</h2>
                        <div className="flex items-center text-gray-500">
                          <Mail className="w-4 h-4 mr-2" />
                          {userInfo.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Role:</span>
                  {isEditing ? (
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange('role', e.target.value as 'user' | 'admin')
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userInfo.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      {userInfo.role}
                    </span>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600">{userInfo.bio || 'No bio provided'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 w-20">Location:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, Country"
                    />
                  ) : (
                    <span className="text-gray-600">{userInfo.location || 'Not specified'}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 w-20">Phone:</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <span className="text-gray-600">{userInfo.phone || 'Not specified'}</span>
                  )}
                </div>

                {/* Website */}
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 w-20">Website:</span>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {userInfo.website ? (
                        <a
                          href={userInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {userInfo.website}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </span>
                  )}
                </div>

                {/* Company */}
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 w-20">Company:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company name"
                    />
                  ) : (
                    <span className="text-gray-600">{userInfo.company || 'Not specified'}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Member Since</span>
                  <span className="text-sm text-gray-600">
                    {new Date(userInfo.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Last Updated</span>
                  <span className="text-sm text-gray-600">
                    {new Date(userInfo.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  View Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Activity Log
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Deactivate User
                </Button>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">142</div>
                    <div className="text-xs text-gray-500">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <div className="text-xs text-gray-500">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">4.8</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
