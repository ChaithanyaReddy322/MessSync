import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { fetchStudentsDirectoryAsync, notifyParentSMSAsync } from '../../store/slices/attendanceSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Search, Filter, Mail, Phone, Calendar, ArrowUpRight, X, Check, User, ShieldAlert } from 'lucide-react'
import { cn } from '../../utils/cn'

export const WardenStudentSearch: React.FC = () => {
  const dispatch = useAppDispatch()
  const students = useAppSelector(state => state.attendance.students)

  const [search, setSearch] = useState('')
  const [roomFilter, setRoomFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)

  React.useEffect(() => {
    dispatch(fetchStudentsDirectoryAsync())
  }, [dispatch])

  const roomsList = Array.from(new Set(students.map(s => s.room.split('-')[0])))

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(search.toLowerCase())
    const matchesRoom = roomFilter === 'all' || s.room.startsWith(roomFilter)
    return matchesSearch && matchesRoom
  })

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Student Directory</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">Registry directory of all residents in Nalanda hostel.</p>
      </div>

      <Card className="p-6">
        {/* Search controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 select-none">
            <Filter className="h-3.5 w-3.5 text-gray-450" />
            <select
              value={roomFilter}
              onChange={e => setRoomFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-600 outline-none cursor-pointer py-1"
            >
              <option value="all">All Wings</option>
              {roomsList.map(wing => (
                <option key={wing} value={wing}>Wing {wing}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-gray-400 col-span-full">No student records match criteria.</div>
          ) : (
            filteredStudents.map(student => (
              <Card key={student.rollNo} className="p-5 flex flex-col justify-between hover:shadow-premium-hover border-gray-150 transition-all select-none">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-tight">{student.name}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold">{student.rollNo}</span>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold bg-gray-105 border border-gray-200 text-gray-700">
                      Room {student.room}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                    <div className="text-left">
                      <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Attendance Rate</span>
                      <span className={cn(
                        'text-xs font-black mt-1 block',
                        student.attendancePercent < 75 ? 'text-red-500' : 'text-emerald-600'
                      )}>{student.attendancePercent}%</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Missed (7d)</span>
                      <span className="text-xs font-black text-gray-900 mt-1 block">{student.missedCount7d} meals</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> SMS Alerts Active</span>
                  <span
                    onClick={() => setSelectedStudent(student)}
                    className="text-brand flex items-center gap-0.5 font-bold cursor-pointer hover:underline"
                  >
                    View profile <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-left">
            {/* Close button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-50 pb-4">
              <div className="h-14 w-14 rounded-full bg-brand text-white font-black text-lg flex items-center justify-center border border-brand/10 shrink-0">
                {selectedStudent.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base leading-tight font-heading">{selectedStudent.name}</h3>
                <span className="inline-flex px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-700 mt-1">
                  Room {selectedStudent.room} · Roll: {selectedStudent.rollNo}
                </span>
              </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <div>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Attendance Rate</span>
                <span className={cn(
                  "text-lg font-black mt-1 block",
                  selectedStudent.attendancePercent < 75 ? 'text-red-500' : 'text-emerald-600'
                )}>{selectedStudent.attendancePercent}%</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-450 font-bold uppercase tracking-wider">Missed Meals (7d)</span>
                <span className="text-lg font-black text-gray-900 mt-1 block">{selectedStudent.missedCount7d} portions</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 select-none border-b border-gray-50 pb-1.5">
                <User className="h-4 w-4 text-brand" /> Contact Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700">
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Resident Mobile No</span>
                  <span className="block text-gray-900 mt-0.5">{selectedStudent.phone || '+91 99999 88888'}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Resident Email</span>
                  <span className="block text-gray-900 mt-0.5 truncate">{selectedStudent.rollNo.toLowerCase()}@institution.edu</span>
                </div>
              </div>
            </div>

            {/* Parent Emergency contacts details */}
            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-red-500 text-xs uppercase tracking-wider flex items-center gap-1.5 select-none border-b border-gray-50 pb-1.5">
                <ShieldAlert className="h-4 w-4 shrink-0" /> Parent / Guardian Alerts
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700">
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Guardian Name</span>
                  <span className="block text-gray-900 mt-0.5">{selectedStudent.parentName || 'Ramesh Sharma'}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Guardian SMS Mobile</span>
                  <span className="block text-gray-900 mt-0.5">{selectedStudent.parentPhone || '+91 99999 77777'}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="select-none flex items-center gap-3">
              {selectedStudent.parentNotified ? (
                <div className="w-full text-center text-xs font-bold text-gray-400 bg-gray-50 border border-gray-200 py-2.5 rounded-xl flex items-center justify-center gap-1">
                  <Check className="h-4 w-4 text-emerald-500" /> Parent Notified via SMS
                </div>
              ) : (
                <Button
                  onClick={() => {
                    dispatch(notifyParentSMSAsync(selectedStudent.rollNo))
                    setSelectedStudent({ ...selectedStudent, parentNotified: true })
                  }}
                  className="w-full font-bold py-2.5"
                >
                  Trigger Parent SMS Notification
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default WardenStudentSearch
