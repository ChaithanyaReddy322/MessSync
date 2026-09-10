import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import { Calendar, Search, Filter, CheckCircle2, XCircle, Clock, CalendarOff } from 'lucide-react'
import { cn } from '../../utils/cn'

interface HistoryRecord {
  date: string
  meal: string
  vote: 'yes' | 'no' | 'none'
  status: 'collected' | 'missed' | 'excused' | 'no-vote'
  menu: string
}

export const StudentMealHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [mealFilter, setMealFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'collected' | 'missed' | 'excused'>('all')

  const historyRecords: HistoryRecord[] = [
    { date: 'Jul 28, 2026', meal: 'Dinner', vote: 'yes', status: 'collected', menu: 'Veg Biryani, Raita, Mirchi ka Salan, Chapati' },
    { date: 'Jul 28, 2026', meal: 'Lunch', vote: 'yes', status: 'collected', menu: 'Jeera Rice, Dal Tadka, Paneer Butter Masala, Chapati' },
    { date: 'Jul 28, 2026', meal: 'Breakfast', vote: 'no', status: 'excused', menu: 'Masala Dosa, Sambar, Coconut Chutney' },
    { date: 'Jul 27, 2026', meal: 'Dinner', vote: 'yes', status: 'missed', menu: 'Dal Makhani, Butter Roti, Kheer' },
    { date: 'Jul 27, 2026', meal: 'Lunch', vote: 'yes', status: 'collected', menu: 'Veg Pulav, Kadhi Pakora, Mix Veg' },
    { date: 'Jul 27, 2026', meal: 'Breakfast', vote: 'yes', status: 'collected', menu: 'Idli Vada, Tomato Chutney, Tea' },
    { date: 'Jul 26, 2026', meal: 'Dinner', vote: 'yes', status: 'collected', menu: 'Egg Curry, Rice, Chapati' },
    { date: 'Jul 26, 2026', meal: 'Lunch', vote: 'yes', status: 'collected', menu: 'Chole Bhature, Boondi Raita, Onion Salad' },
    { date: 'Jul 26, 2026', meal: 'Breakfast', vote: 'no', status: 'excused', menu: 'Aloo Paratha, Curd, Pickle' }
  ]

  const getStatusBadge = (status: HistoryRecord['status']) => {
    switch (status) {
      case 'collected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-brand">
            <CheckCircle2 className="h-3.5 w-3.5" /> Collected
          </span>
        )
      case 'missed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-650">
            <XCircle className="h-3.5 w-3.5" /> Missed
          </span>
        )
      case 'excused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-500">
            <CalendarOff className="h-3.5 w-3.5" /> Excused (Leave)
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
            <Clock className="h-3.5 w-3.5" /> No Vote
          </span>
        )
    }
  }

  const getVoteBadge = (vote: HistoryRecord['vote']) => {
    if (vote === 'yes') return <span className="text-xs font-semibold text-brand bg-brand-light/35 px-2 py-0.5 rounded-md">Yes</span>
    if (vote === 'no') return <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">No</span>
    return <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">-</span>
  }

  const filteredRecords = historyRecords.filter(record => {
    const matchesSearch = record.menu.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMeal = mealFilter === 'all' || record.meal.toLowerCase() === mealFilter
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    return matchesSearch && matchesMeal && matchesStatus
  })

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Meal History</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">Your voting record and mess attendance logs.</p>
      </div>

      <Card className="p-6">
        {/* Filters Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search by menu items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 select-none">
              <Filter className="h-3.5 w-3.5 text-gray-450" />
              <select
                value={mealFilter}
                onChange={e => setMealFilter(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-gray-600 outline-none cursor-pointer py-1"
              >
                <option value="all">All Sessions</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 select-none">
              <Filter className="h-3.5 w-3.5 text-gray-450" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-gray-600 outline-none cursor-pointer py-1"
              >
                <option value="all">All Statuses</option>
                <option value="collected">Collected</option>
                <option value="missed">Missed</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100 select-none">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Meal Session</th>
                <th className="py-3 px-4">Registered Vote</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Menu Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No records found matching filters.</td>
                </tr>
              ) : (
                filteredRecords.map((record, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" /> {record.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900">{record.meal}</span>
                    </td>
                    <td className="py-3.5 px-4">{getVoteBadge(record.vote)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(record.status)}</td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">{record.menu}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
export default StudentMealHistory
