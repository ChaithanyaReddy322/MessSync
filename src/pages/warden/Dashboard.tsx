import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { notifyParentSMSAsync, fetchStudentsDirectoryAsync } from '../../store/slices/attendanceSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  Users,
  UserMinus,
  AlertTriangle,
  Heart,
  Megaphone,
  Check
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import { cn } from '../../utils/cn'

export const WardenDashboard: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  React.useEffect(() => {
    dispatch(fetchStudentsDirectoryAsync())
  }, [dispatch])

  const students = useAppSelector(state => state.attendance.students)
  const wasteTrend = useAppSelector(state => state.attendance.wasteTrend)

  // Sort students by missed count (highest first) for frequent missers table
  const frequentMissers = [...students]
    .sort((a, b) => b.missedCount7d - a.missedCount7d)
    .slice(0, 5)

  const handleNotify = (rollNo: string) => {
    dispatch(notifyParentSMSAsync(rollNo))
  }

  const customTooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #f1f5f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '8px 12px',
    fontSize: '12px'
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-150 p-6 rounded-2xl shadow-card select-none">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Warden overview</h1>
          <p className="text-gray-450 text-xs font-semibold">
            Nalanda Hostel · 420 students
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-1.5 font-bold cursor-pointer shrink-0"
          onClick={() => navigate('/warden/announcements')}
        >
          <Megaphone className="h-4.5 w-4.5 animate-float" /> Send announcement
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-brand border border-brand/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Students</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">420</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shrink-0">
            <UserMinus className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Missing Meals Today</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">14</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Repeat Missers (7D)</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">9</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-105 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Health Alerts</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">2</span>
          </div>
        </Card>
      </div>

      {/* Grid Content */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Frequent Meal Missers Table */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between">
            <h3 className="font-bold text-gray-900 text-sm font-heading mb-4 select-none">Frequent meal missers</h3>
            
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100 select-none">
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Room</th>
                    <th className="py-2.5 px-4">Attendance</th>
                    <th className="py-2.5 px-4">Missed (7d)</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                  {frequentMissers.map(student => (
                    <tr key={student.rollNo} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-[9px] text-gray-400 mt-0.5">{student.rollNo}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{student.room}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          'px-2 py-0.5 rounded-md text-[10px] font-bold',
                          student.attendancePercent < 75 ? 'bg-red-50 text-red-650' : 'bg-emerald-50 text-brand'
                        )}>
                          {student.attendancePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{student.missedCount7d}</td>
                      <td className="py-3 px-4 text-right select-none">
                        {student.parentNotified ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                            <Check className="h-3 w-3 text-emerald-500" /> Notified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleNotify(student.rollNo)}
                            className="px-2.5 py-1.5 bg-white border border-gray-250 text-gray-650 hover:bg-gray-50 rounded-lg text-[10px] font-bold shadow-3xs cursor-pointer active:scale-[0.98] transition-all"
                          >
                            Notify parent
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Waste Trend (Last 7 Days) */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-sm font-heading mb-1 select-none">Waste trend</h3>
              <span className="text-[10px] text-gray-400 font-semibold select-none">Last 7 days (kg)</span>
            </div>

            <div className="h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar name="Wasted Food (kg)" dataKey="wasteKg" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default WardenDashboard
