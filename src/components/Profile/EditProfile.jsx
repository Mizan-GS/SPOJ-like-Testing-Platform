import React, { useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function EditProfile({ user, onSave, onCancel }) {
  const initial = user?.profile || {}
  const [profile, setProfile] = useState({
    firstName: initial.firstName || '',
    lastName: initial.lastName || '',
    bio: initial.bio || '',
    avatar: {
      url: initial?.avatar?.url || '',
      publicId: initial?.avatar?.publicId || '',
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setProfile((p) => ({
        ...p,
        [parent]: {
          ...(p[parent] || {}),
          [child]: value,
        },
      }))
      return
    }
    setProfile((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    // required fields
    if (!profile.firstName || !profile.lastName || !profile.bio) {
      setError('First name, last name and bio are required')
      return
    }
    if (!profile.avatar?.url || !profile.avatar?.publicId) {
      setError('Avatar url and publicId are required')
      return
    }

    setLoading(true)
    try {
      const body = { profile }
      const res = await api.patch('/users/me', body)
      const payload = res?.data?.data || res?.data || user
      toast.success(res?.data?.message || 'Profile updated')
      if (onSave) onSave(payload)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-500">First Name</label>
          <input name="firstName" value={profile.firstName} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Last Name</label>
          <input name="lastName" value={profile.lastName} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
        </div>
       
      </div>

      <div>
        <label className="text-sm text-gray-500">Bio</label>
        <textarea name="bio" value={profile.bio} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2 h-24" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 rounded cursor-pointer border">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-purple-600 text-white cursor-pointer">{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}
