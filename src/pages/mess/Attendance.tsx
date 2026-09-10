import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { markAttendanceManual, fetchStudentsDirectoryAsync, triggerQRScanAsync } from '../../store/slices/attendanceSlice'
import Card from '../../components/ui/Card'
import { Search, Filter, CheckCircle2, AlertCircle, Clock, UserCheck, XCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

export const MessAttendance: React.FC = () => {
  const dispatch = useAppDispatch()
  const students = useAppSelector(state => state.attendance.students)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch')
  const [statusFilter, setStatusFilter] = useState<'all' | 'served' | 'missed' | 'pending' | 'no-vote'>('all')

  React.useEffect(() => {
    dispatch(fetchStudentsDirectoryAsync())
  }, [dispatch])

  const handleToggleAttendance = (rollNo: string, currentStatus: string) => {
    if (currentStatus === 'served') {
      dispatch(markAttendanceManual({ rollNo, meal: selectedMeal, status: 'pending' }))
    } else {
      const mealName = selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)
      dispatch(triggerQRScanAsync({ rollNo, mealName }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'served':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-brand">
            <CheckCircle2 className="h-3.5 w-3.5" /> Served
          </span>
        )
      case 'missed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
            <XCircle className="h-3.5 w-3.5" /> Missed Meal
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-450">
            <Clock className="h-3.5 w-3.5" /> Checked-in pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-650">
            <AlertCircle className="h-3.5 w-3.5" /> No Vote
          </span>
        )
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.room.toLowerCase().includes(searchTerm.toLowerCase())
    
    const mealStatus = student.todayStatus?.[selectedMeal] || 'no-vote'
    const matchesStatus = statusFilter === 'all' || mealStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Student Attendance</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">Manual overrides and daily registration verification records.</p>
      </div>

      <Card className="p-6">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-0.5 rounded-xl flex select-none">
              {(['breakfast', 'lunch', 'dinner'] as const).map(meal => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                    selectedMeal === meal ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-48">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 select-none">
              <Filter className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-gray-600 outline-none cursor-pointer py-1"
              >
                <option value="all">All States</option>
                <option value="served">Served</option>
                <option value="missed">Missed</option>
                <option value="pending">Pending</option>
                <option value="no-vote">No Vote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Attendance Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100 select-none">
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Room No</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Manual Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No records found matching filters.</td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const mealStatus = student.todayStatus?.[selectedMeal] || 'no-vote'
                  return (
                    <tr key={student.rollNo} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-[10px] text-gray-450 mt-0.5">{student.rollNo}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900">{student.room}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={cn(
                          student.attendancePercent < 75 ? 'text-red-500 font-bold' : 'text-gray-500'
                        )}>
                          {student.attendancePercent}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(mealStatus)}</td>
                      <td className="py-3.5 px-4 text-right select-none">
                        <button
                          onClick={() => handleToggleAttendance(student.rollNo, mealStatus)}
                          disabled={mealStatus === 'no-vote'}
                          className={cn(
                            'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                            mealStatus === 'served'
                              ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                              : 'bg-brand/10 border-brand/20 text-brand hover:bg-brand hover:text-white shadow-3xs'
                          )}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          {mealStatus === 'served' ? 'Unmark served' : 'Check-in served'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
export default MessAttendance
