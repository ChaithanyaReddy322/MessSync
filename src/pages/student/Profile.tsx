import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateProfile } from '../../store/slices/authSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { User, Mail, Phone, Home, Hash, ShieldAlert, Award, Save } from 'lucide-react'

export const StudentProfile: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.currentUser)

  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [parentName, setParentName] = useState(currentUser?.parentName || '')
  const [parentPhone, setParentPhone] = useState(currentUser?.parentPhone || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  if (!currentUser) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      dispatch(updateProfile({ phone, parentName, parentPhone }))
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 500)
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">My Profile</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">Manage personal contact metadata and parent contact details.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Profile Card & Bio */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="text-center relative select-none">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-brand-light/35 to-transparent" />
            <div className="relative pt-6">
              <div className="h-20 w-20 rounded-full bg-brand text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md mx-auto">
                {currentUser.avatar}
              </div>
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mt-4 font-heading">{currentUser.name}</h2>
              <span className="text-[10px] text-brand font-bold bg-brand-light/35 px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                {currentUser.roleName}
              </span>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hostel</span>
                <span className="font-bold text-gray-900 text-xs mt-1 block">{currentUser.hostel}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Room No</span>
                <span className="font-bold text-gray-900 text-xs mt-1 block">{currentUser.room}</span>
              </div>
            </div>
          </Card>

          {/* Streak achievements */}
          <Card className="flex items-center gap-4 select-none">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5 fill-amber-550/15" />
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hostel Streak Status</span>
              <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">{currentUser.streak} days active streak</span>
              <p className="text-[10px] text-gray-450 mt-0.5">Top 5% streak holders in Nalanda Hall!</p>
            </div>
          </Card>
        </div>

        {/* Profile Settings form */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            <h3 className="font-bold text-gray-900 text-sm font-heading mb-6 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-brand" /> Profile details
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Details Read-Only Grid */}
              <div className="grid sm:grid-cols-2 gap-6 select-none">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" /> Roll number
                  </span>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs font-semibold text-gray-500">
                    {currentUser.rollNo}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Institutional Email
                  </span>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs font-semibold text-gray-500 truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Contact Number
                  </span>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                  />
                </div>
              </div>

              {/* Parent Emergency contact detail */}
              <div className="border-t border-gray-150 pt-6 space-y-4">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-red-500 select-none">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" /> Parent / Guardian Notification details
                </h4>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Guardian Name</span>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={e => setParentName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Guardian SMS Mobile No</span>
                    <input
                      type="text"
                      required
                      value={parentPhone}
                      onChange={e => setParentPhone(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4 select-none">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save changes
                </Button>

                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 animate-fadeIn">
                    ✓ Changes updated successfully!
                  </span>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default StudentProfile
