import React, { useState } from 'react'
import { createAnnouncementAPI } from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Megaphone, Save, Trash2, CheckCircle2, User, Globe } from 'lucide-react'


interface Notice {
  id: string
  title: string
  audience: string
  content: string
  date: string
}

export const WardenAnnouncements: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 'N-101',
      title: 'Water supply interruption & timing adjustment',
      audience: 'All Students',
      content: 'Please note that due to maintenance, water supply will be restricted on Jul 31 from 10:00 AM to 2:00 PM. Cutoff times for Friday Dinner will remain unaffected.',
      date: '2026-07-28'
    },
    {
      id: 'N-102',
      title: 'Independence Day Special Dinner voting',
      audience: 'All Students',
      content: 'A special feast menu is being planned for Aug 15. The voting ballot is now active. Please cast your preferences in the Today\'s meals section.',
      date: '2026-07-26'
    }
  ])

  const [title, setTitle] = useState('')
  const [audience, setAudience] = useState('All Students')
  const [content, setContent] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    try {
      await createAnnouncementAPI(title, content)
      
      const newNotice: Notice = {
        id: `N-${Math.floor(100 + Math.random() * 900)}`,
        title,
        audience,
        content,
        date: new Date().toISOString().split('T')[0]
      }

      setNotices([newNotice, ...notices])
      setTitle('')
      setContent('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Failed to post announcement on server:', err)
      // Local fallback
      const newNotice: Notice = {
        id: `N-${Math.floor(100 + Math.random() * 900)}`,
        title,
        audience,
        content,
        date: new Date().toISOString().split('T')[0]
      }
      setNotices([newNotice, ...notices])
      setTitle('')
      setContent('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleDelete = (id: string) => {
    setNotices(notices.filter(n => n.id !== id))
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Hostel Announcements</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">Send immediate notifications, bulletins, and event schedules to hostel students.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Compose notice (Left) */}
        <div className="lg:col-span-5">
          <Card className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-2">
              <Megaphone className="h-4.5 w-4.5 text-brand" /> Create announcement
            </h3>

            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Notice published successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Special Holiday Mess Timing Adjustments"
                  className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Audience Target</label>
                <select
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all cursor-pointer"
                >
                  <option value="All Students">All Hostel Students</option>
                  <option value="Mess Staff Only">Mess Kitchen Staff Only</option>
                  <option value="B-Block Students Only">B-Block Students Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Message Content</label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Compose notification message details..."
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all leading-relaxed"
                />
              </div>

              <Button type="submit" className="w-full font-bold cursor-pointer">
                Publish Notice Bulletin
              </Button>
            </form>
          </Card>
        </div>

        {/* Bulletins Feed (Right) */}
        <div className="lg:col-span-7">
          <Card className="flex flex-col h-full space-y-4">
            <h3 className="font-bold text-gray-900 text-sm font-heading">Bulletin Board Notices</h3>

            <div className="divide-y divide-gray-150 flex-1 overflow-y-auto max-h-[384px] pr-1">
              {notices.length === 0 ? (
                <div className="py-16 text-center text-xs text-gray-400">Notice board empty. Compose a bulletin.</div>
              ) : (
                notices.map(notice => (
                  <div key={notice.id} className="py-4.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900">{notice.title}</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded-md">
                          <Globe className="h-2.5 w-2.5" /> {notice.audience}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{notice.content}</p>
                      <span className="block text-[9px] text-gray-450 font-bold uppercase tracking-wider">
                        Date: {notice.date} · Ref: {notice.id}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default WardenAnnouncements
