import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { addStudent, removeStudent } from '../../store/slices/attendanceSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  Building,
  Users,
  Settings,
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  Download,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react'

interface HostelRecord {
  name: string
  studentsCount: number
  warden: string
  messWastePercent: number
  status: 'active' | 'maintenance'
}

export const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const students = useAppSelector(state => state.attendance.students)

  // Determine active sub-route path
  const activeTab = location.pathname.split('/').pop() || 'dashboard'

  // Hostels list state
  const [hostels, setHostels] = useState<HostelRecord[]>([
    { name: 'Nalanda Hostel (Boys)', studentsCount: 420, warden: 'Priya Sinha', messWastePercent: 14, status: 'active' },
    { name: 'Sarojini Hostel (Girls)', studentsCount: 310, warden: 'Dr. Meena Iyer', messWastePercent: 12, status: 'active' },
    { name: 'Tagore Block (PG)', studentsCount: 180, warden: 'Rajesh Saxena', messWastePercent: 19, status: 'active' }
  ])

  // Form states for adding a student
  const [newName, setNewName] = useState('')
  const [newRoll, setNewRoll] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [success, setSuccess] = useState('')

  // Form states for adding a hostel
  const [newHostelName, setNewHostelName] = useState('')
  const [newWardenName, setNewWardenName] = useState('')
  const [newCapacity, setNewCapacity] = useState('')

  // Form states for timings config
  const [safetyBuffer, setSafetyBuffer] = useState(8)
  const [bfCutoff, setBfCutoff] = useState('07:00')
  const [lunchCutoff, setLunchCutoff] = useState('11:00')
  const [dinnerCutoff, setDinnerCutoff] = useState('17:00')
  const [configSuccess, setConfigSuccess] = useState('')

  // Reports download simulation states
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newRoll || !newRoom) return

    dispatch(addStudent({
      id: `student-${Math.floor(Math.random() * 1000)}`,
      name: newName,
      rollNo: newRoll,
      room: newRoom,
      status: 'active',
      parentName: 'Emergency contact',
      parentPhone: '+91 99999 99999'
    }))

    setNewName('')
    setNewRoll('')
    setNewRoom('')
    setSuccess('Student added to roster database successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleRemoveStudent = (rollNo: string) => {
    dispatch(removeStudent(rollNo))
  }

  const handleAddHostel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHostelName || !newWardenName || !newCapacity) return

    const newHostel: HostelRecord = {
      name: newHostelName,
      studentsCount: parseInt(newCapacity) || 0,
      warden: newWardenName,
      messWastePercent: 0,
      status: 'active'
    }

    setHostels([...hostels, newHostel])
    setNewHostelName('')
    setNewWardenName('')
    setNewCapacity('')
    setSuccess('Hostel block registered successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault()
    setConfigSuccess('Configurations updated successfully!')
    setTimeout(() => setConfigSuccess(''), 3000)
  }

  const triggerDownloadReport = (reportName: string) => {
    setDownloadingReport(reportName)
    setDownloadProgress(0)
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setDownloadingReport(null), 800)
          return 100
        }
        return prev + 25
      })
    }, 200)
  }

  // Get Page details based on active route
  const getHeaderDetails = () => {
    switch (activeTab) {
      case 'hostels':
        return {
          title: 'Hostel Block Registry',
          desc: 'Configure wing allocations, assign chief wardens, and audit waste averages per block.'
        }
      case 'users':
        return {
          title: 'Student Roster Directory',
          desc: 'Register new hostel admissions, manage directory entries, and revoke access keys.'
        }
      case 'configs':
        return {
          title: 'System Timing Settings',
          desc: 'Configure daily meal cutoff boundaries, session timings, and buffer limits.'
        }
      case 'reports':
        return {
          title: 'Institutional Audit Reports',
          desc: 'Generate monthly waste statistics sheets, download attendance ledgers, and view trends.'
        }
      default:
        return {
          title: 'Institution Administrator Console',
          desc: 'Global administrative setups, user registrations, and capacity configurations.'
        }
    }
  }

  const header = getHeaderDetails()

  return (
    <div className="space-y-6 text-left select-none">
      {/* Dynamic Header Banner */}
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">{header.title}</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">{header.desc}</p>
      </div>

      {/* Global Administrative Metrics Cards (Visible across overall Overview or specific tabs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-brand border border-brand/10 flex items-center justify-center shrink-0">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Hostels</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{hostels.length}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Registered Students</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{students.length + 900}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Safety Buffer</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{safetyBuffer}%</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">System Status</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-0.5 block">Healthy</span>
          </div>
        </Card>
      </div>

      {/* RENDER ACTIVE TAB VIEW */}

      {/* Tab 1: OVERVIEW DASHBOARD */}
      {(activeTab === 'dashboard' || activeTab === 'admin') && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-heading">Hostels Registry</h3>
              <div className="space-y-3.5">
                {hostels.map((hostel, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-150/50">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{hostel.name}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold">Warden: {hostel.warden} · Capacity: {hostel.studentsCount}</span>
                    </div>
                    <span className="text-[10px] font-bold text-brand bg-emerald-50 px-2 py-0.5 rounded-md border border-brand/10">
                      {hostel.messWastePercent}% waste avg
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6">
            <Card className="space-y-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm font-heading mb-4">System Alerts & Operations</h3>
                <div className="space-y-3 text-xs font-semibold text-gray-650">
                  <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <div>
                      <span className="font-extrabold block">Dinner cutoff approaching</span>
                      <span className="text-[10px] opacity-90 block mt-0.5">Dinner registration closing in 45 minutes for Tagore block.</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block">Twilio integration online</span>
                      <span className="text-[10px] opacity-90 block mt-0.5">All SMS alerts sent out dynamically to parents on student absent logs.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-brand cursor-pointer hover:underline">
                <span>View System Security Audits</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: HOSTELS CONFIG */}
      {activeTab === 'hostels' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-heading">Hostels Registry</h3>
              <div className="space-y-3.5">
                {hostels.map((hostel, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-150/50">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{hostel.name}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold">Warden: {hostel.warden} · Capacity: {hostel.studentsCount}</span>
                    </div>
                    <span className="text-[10px] font-bold text-brand bg-emerald-50 px-2 py-0.5 rounded-md border border-brand/10">
                      {hostel.messWastePercent}% waste avg
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-heading">Register New Hostel Block</h3>
              
              {success && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleAddHostel} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hostel Block Name</label>
                  <input
                    type="text"
                    required
                    value={newHostelName}
                    onChange={e => setNewHostelName(e.target.value)}
                    placeholder="e.g. Ramanujan Tower (C-Block)"
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assign Warden</label>
                    <input
                      type="text"
                      required
                      value={newWardenName}
                      onChange={e => setNewWardenName(e.target.value)}
                      placeholder="e.g. Prof. Satish Pillai"
                      className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Occupancy Capacity</label>
                    <input
                      type="number"
                      required
                      value={newCapacity}
                      onChange={e => setNewCapacity(e.target.value)}
                      placeholder="e.g. 240"
                      className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 transition-all"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full font-bold flex items-center justify-center gap-1">
                  <Plus className="h-4.5 w-4.5" /> Initialize Hostel Block
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-heading">Register New Student</h3>
              
              {success && (
                <div className="bg-emerald-55 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Student Name</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Varun Nair"
                      className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Roll Number ID</label>
                    <input
                      type="text"
                      required
                      value={newRoll}
                      onChange={e => setNewRoll(e.target.value)}
                      placeholder="e.g. MS2024095"
                      className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Room Allocation</label>
                  <input
                    type="text"
                    required
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    placeholder="e.g. B-205"
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 transition-all"
                  />
                </div>

                <Button type="submit" className="w-full font-bold flex items-center justify-center gap-1">
                  <Plus className="h-4.5 w-4.5" /> Register Student Resident
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-6">
            <Card className="space-y-3.5 h-[340px] flex flex-col">
              <h4 className="text-xs font-bold text-gray-900">Student Directory Registry</h4>
              <div className="divide-y divide-gray-150 overflow-y-auto flex-1 pr-1">
                {students.map(s => (
                  <div key={s.rollNo} className="py-2.5 flex justify-between items-center gap-4 text-xs font-semibold text-gray-700">
                    <div>
                      <span className="font-bold text-gray-900 block">{s.name}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">{s.rollNo} · Room {s.room}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(s.rollNo)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete student"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 4: SYSTEM CONFIGS */}
      {activeTab === 'configs' && (
        <Card className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-brand" /> Threshold Configurations
            </h3>
            <span className="text-[10px] font-bold text-gray-400">Default settings active</span>
          </div>

          {configSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-brand shrink-0" />
              <span>{configSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveConfigs} className="space-y-6">
            {/* Cutoffs timings */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand" /> Meal Cutoff Timings
              </h4>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 block">Breakfast Cutoff</label>
                  <input
                    type="time"
                    value={bfCutoff}
                    onChange={e => setBfCutoff(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 block">Lunch Cutoff</label>
                  <input
                    type="time"
                    value={lunchCutoff}
                    onChange={e => setLunchCutoff(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 block">Dinner Cutoff</label>
                  <input
                    type="time"
                    value={dinnerCutoff}
                    onChange={e => setDinnerCutoff(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Slider safety buffer percentage */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Safety Procurement Buffer</h4>
                <span className="text-sm font-extrabold text-brand bg-emerald-50 px-2 py-0.5 border border-brand/10 rounded-md">+{safetyBuffer}%</span>
              </div>
              <p className="text-gray-400 text-[10px] leading-relaxed">
                Define the safety percentage buffer added to cumulative student meal registrations to compute the final quantity of meals to cook.
              </p>
              <input
                type="range"
                min="5"
                max="20"
                value={safetyBuffer}
                onChange={e => setSafetyBuffer(parseInt(e.target.value))}
                className="w-full accent-brand h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-450 font-bold select-none">
                <span>Minimum (+5%)</span>
                <span>Recommended (+8%)</span>
                <span>Maximum (+20%)</span>
              </div>
            </div>

            <Button type="submit" className="w-full font-bold">
              Save Default Configurations
            </Button>
          </form>
        </Card>
      )}

      {/* Tab 5: AUDIT REPORTS */}
      {activeTab === 'reports' && (
        <Card className="max-w-2xl mx-auto space-y-4">
          <h3 className="font-bold text-gray-900 text-sm font-heading select-none mb-2">Download Audit Registers</h3>
          <div className="divide-y divide-gray-150">
            {[
              { name: 'July 2026 - Monthly Waste Ledger', size: '1.4 MB', type: 'CSV Spreadsheet' },
              { name: 'Roster Attendance Audit Week 30', size: '840 KB', type: 'Excel Document' },
              { name: 'Hostel Meal Capacity Forecast Q3', size: '2.1 MB', type: 'PDF Document' }
            ].map((report, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0 text-gray-450">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{report.name}</h4>
                    <span className="text-[9px] text-gray-400 font-semibold">{report.type} · {report.size}</span>
                  </div>
                </div>

                {downloadingReport === report.name ? (
                  <div className="w-28 space-y-1.5 text-right">
                    <div className="text-[9px] font-bold text-brand">Downloading... {downloadProgress}%</div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-brand h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => triggerDownloadReport(report.name)}
                    className="text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
export default AdminDashboard
