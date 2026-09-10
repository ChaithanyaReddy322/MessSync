import React from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { fetchPendingLeavesAsync, reviewLeaveRequestAsync } from '../../store/slices/leaveSlice'
import { fetchStudentsDirectoryAsync } from '../../store/slices/attendanceSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { AlertTriangle, Clock, ShieldAlert, Heart, Calendar, Check, X } from 'lucide-react'
import { cn } from '../../utils/cn'

export const WardenAlerts: React.FC = () => {
  const dispatch = useAppDispatch()
  const students = useAppSelector(state => state.attendance.students)
  const leaves = useAppSelector(state => state.leaves.leaves)
  
  React.useEffect(() => {
    dispatch(fetchPendingLeavesAsync())
    dispatch(fetchStudentsDirectoryAsync())
  }, [dispatch])

  // Filter students who have low attendance (<75%) or high missed counts (>=5)
  const alertStudents = students.filter(s => s.attendancePercent < 75 || s.missedCount7d >= 5)

  // Filter pending leaves
  const pendingLeaves = leaves.filter(l => l.status === 'pending')

  const handleApprove = (id: string) => {
    dispatch(reviewLeaveRequestAsync({ id, status: 'approved' }))
  }

  const handleReject = (id: string) => {
    dispatch(reviewLeaveRequestAsync({ id, status: 'rejected' }))
  }

  return (
    <div className="space-y-6 text-left select-none">
      {/* Header Banner */}
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Hostel Alerts & Leaves</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">
          Review critical attendance alerts and process resident leave request applications.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Attendance Alerts (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 text-red-500" /> Attendance Warnings
              </h3>
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                {alertStudents.length} Flagged
              </span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {alertStudents.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <ShieldAlert className="h-9 w-9 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-semibold">No critical warnings</p>
                  <p className="text-[10px] mt-0.5">All resident attendance values are within safety margins.</p>
                </div>
              ) : (
                alertStudents.map(student => (
                  <div key={student.rollNo} className="p-5 flex items-start gap-4 hover:bg-gray-50/20 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-xs font-bold text-gray-900">
                          {student.name}
                        </h4>
                        <span className="text-[9px] text-red-650 font-bold bg-red-50 px-1.5 py-0.2 rounded-md">
                          Irregular
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">
                        Missed {student.missedCount7d} meals this week. Attendance rate is{' '}
                        <span className="font-bold text-red-655">{student.attendancePercent}%</span>.
                      </p>
                      <div className="flex items-center gap-4 text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                        <span>Room: {student.room}</span>
                        <span>Roll: {student.rollNo}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Leave Requests Approvals (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-brand" /> Leave Approvals
              </h3>
              <span className="text-[10px] font-bold text-brand bg-emerald-50 px-2 py-0.5 rounded-full">
                {pendingLeaves.length} Pending
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[460px] overflow-y-auto pr-1">
              {pendingLeaves.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Check className="h-9 w-9 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-semibold">No pending requests</p>
                  <p className="text-[10px] mt-0.5">All resident leave requests have been reviewed.</p>
                </div>
              ) : (
                pendingLeaves.map(leave => (
                  <div key={leave.id} className="p-5 space-y-3 hover:bg-gray-50/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand/10 text-brand font-black text-xs flex items-center justify-center shrink-0">
                        {leave.studentName ? leave.studentName.split(' ').map((n: string) => n[0]).join('') : 'ST'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {leave.studentName || 'Resident Student'}
                          </h4>
                          <span className="text-[9px] font-bold text-gray-450 bg-gray-50 px-1.5 py-0.2 rounded">
                            {leave.totalDays} days
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-semibold mt-0.5">
                          Roll: {leave.studentRollNo || 'N/A'} · Room: {leave.studentRoom || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-[10px] font-medium text-gray-650 leading-relaxed">
                      <span className="font-bold text-gray-400 block uppercase text-[8px] mb-0.5">Dates: {leave.startDate} to {leave.endDate}</span>
                      "{leave.reason}"
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleApprove(leave.id)}
                        variant="primary"
                        size="xs"
                        className="flex-1 font-bold py-1.5 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <button
                        onClick={() => handleReject(leave.id)}
                        className="flex-1 py-1.5 bg-white border border-red-200 text-red-650 hover:bg-red-50/30 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98] transition-all"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
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
export default WardenAlerts
