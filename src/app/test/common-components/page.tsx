'use client'

import { useState } from 'react'
import { Button } from '@/components/commons/common-button'
import { Input } from '@/components/commons/common-input'
import { CommonTable } from '@/components/commons/common-table'
import Modal from '@/components/commons/common-modal'
import { ColumnDef } from '@tanstack/react-table'

type User = {
  id: number
  name: string
  email: string
  role: string
  status: string
}

const columns: ColumnDef<User>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: (info) => info.getValue() as string,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: (info) => info.getValue() as string,
  },
  {
    header: 'Role',
    accessorKey: 'role',
    cell: (info) => (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (info) => {
      const status = info.getValue() as string
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            status === 'Active'
              ? 'bg-green-100 text-green-800'
              : status === 'Inactive'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span>
      )
    },
  },
]

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Pending' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Active' },
  { id: 7, name: 'Edward Norton', email: 'edward@example.com', role: 'User', status: 'Inactive' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'Editor', status: 'Pending' },
]

export default function CommonComponentsTest() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    search: '',
  })
  const [tablePage, setTablePage] = useState(1)

  const handleButtonClick = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Button clicked!')
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Common Components Test</h1>

        {/* Buttons Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleButtonClick} loading={loading}>
              Primary Button
            </Button>
            <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
              Secondary Button
            </Button>
            <Button variant="outline" onClick={() => alert('Outline clicked!')}>
              Outline Button
            </Button>
            <Button variant="ghost" onClick={() => alert('Ghost clicked!')}>
              Ghost Button
            </Button>
            <Button disabled>Disabled Button</Button>
            <Button loading>Loading Button</Button>
            <Button size="sm">Small Button</Button>
            <Button size="lg">Large Button</Button>
            <Button fullWidth>Full Width Button</Button>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inputs</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              hint="We'll never share your email with anyone else."
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Input
              label="Search"
              type="search"
              placeholder="Search users..."
              value={formData.search}
              onChange={(e) => setFormData({ ...formData, search: e.target.value })}
              showSearchIcon
            />
            <Input label="Disabled Input" placeholder="This is disabled" disabled />
            <Input
              label="Input with Error"
              placeholder="This has an error"
              error="This field is required"
            />
            <Button type="submit">Submit Form</Button>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table</h2>
          <CommonTable<User>
            data={sampleData}
            columns={columns}
            page={tablePage}
            totalPage={2}
            totalDocs={sampleData.length}
            docsPerPage={5}
            enableRowSelection
            enableIndexColumn
            onPageChange={(newPage) => setTablePage(newPage)}
            onRowClick={(row) => console.log('Row clicked:', row.original)}
            onRowSelection={(selection) => console.log('Row selection:', selection)}
          />
        </div>

        {/* Modal Trigger */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Test Modal"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a test modal to demonstrate the CommonModal component functionality.
            </p>
            <Input label="Modal Input" placeholder="Type something..." />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Modal confirmed!')
                  setIsModalOpen(false)
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
