import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { fetchLeavesAsync, submitLeaveAsync } from '../../store/slices/leaveSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Calendar, AlertCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react'
import { cn } from '../../utils/cn'

export const StudentLeaveRequest: React.FC = () => {
  const dispatch = useAppDispatch()
  const leaves = useAppSelector(state => state.leaves.leaves)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  React.useEffect(() => {
    dispatch(fetchLeavesAsync())
  }, [dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || !reason) return

    setIsSubmitting(true)
    dispatch(submitLeaveAsync({ startDate, endDate, reason }))
      .unwrap()
      .then(() => {
        setIsSubmitting(false)
        setSuccessMsg('Leave request submitted successfully! Pending Warden approval.')
        setStartDate('')
        setEndDate('')
        setReason('')
        setTimeout(() => setSuccessMsg(''), 4000)
      })
      .catch(() => {
        setIsSubmitting(false)
      })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-[10px] font-bold bg-emerald-50 text-brand border border-brand/10 px-2 py-0.5 rounded-full capitalize">Approved</span>
      case 'pending':
        return <span className="text-[10px] font-bold bg-amber-50 text-amber-650 border border-amber-100/50 px-2 py-0.5 rounded-full capitalize">Pending</span>
      case 'completed':
        return <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full capitalize">Completed</span>
      default:
        return <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full capitalize">{status}</span>
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Leave Request</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">Submit mess leave requests to suspend food preparations during absences.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Submit Form (Left) */}
        <div className="lg:col-span-5">
          <Card className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-brand" /> Request Leave
            </h3>

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 select-none animate-fadeIn">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Reason for absence</label>
                <textarea
                  required
                  rows={4}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Traveling back home for national holidays or medical rest."
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                />
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex gap-2.5 text-[10px] font-semibold text-gray-500 leading-normal select-none">
                <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>
                  Requests must be submitted before 05:00 PM the day before leave begins. Leaves suspend food waste tracking and auto-register your votes as Excused.
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold select-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Submit Leave Request'
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* Leaves Log (Right) */}
        <div className="lg:col-span-7">
          <Card className="flex flex-col h-full space-y-4">
            <h3 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-brand" /> Leave Log
            </h3>

            <div className="divide-y divide-gray-150 flex-1 overflow-y-auto max-h-[384px]">
              {leaves.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">No leave requests found.</div>
              ) : (
                leaves.map(leave => (
                  <div key={leave.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">
                          {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                          {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">({leave.totalDays} days)</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{leave.reason}</p>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        Submitted: {leave.submittedAt} · Ref: {leave.id}
                      </span>
                    </div>
                    <div className="shrink-0">{getStatusBadge(leave.status)}</div>
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
export default StudentLeaveRequest
