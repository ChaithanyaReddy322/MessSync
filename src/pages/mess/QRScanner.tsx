import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { triggerQRScanAsync, clearScanLogs } from '../../store/slices/attendanceSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  Scan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import { cn } from '../../utils/cn'

export const MessQRScanner: React.FC = () => {
  const dispatch = useAppDispatch()
  const scannedLogs = useAppSelector(state => state.attendance.scannedLogs)
  const students = useAppSelector(state => state.attendance.students)

  const [selectedRoll, setSelectedRoll] = useState('MS2024001')
  const [selectedMeal, setSelectedMeal] = useState('Dinner')
  const [scanning, setScanning] = useState(false)
  const [successAnimation, setSuccessAnimation] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      dispatch(triggerQRScanAsync({ rollNo: selectedRoll, mealName: selectedMeal }))
        .unwrap()
        .then(() => {
          setScanning(false)
          setSuccessAnimation(true)
          setTimeout(() => setSuccessAnimation(false), 1500)
        })
        .catch(() => {
          setScanning(false)
        })
    }, 800)
  }

  const getLogBadgeColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-brand border-emerald-100'
      case 'warning':
        return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'error':
        return 'bg-red-50 text-red-650 border-red-150'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600'
    }
  }

  const getLogIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 shrink-0" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 shrink-0" />
      default:
        return <XCircle className="h-4 w-4 shrink-0" />
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">QR Attendance Scanner</h1>
          <p className="text-gray-450 text-xs font-semibold mt-1">Scan student ID barcodes or QR codes at the mess hall entrance.</p>
        </div>
        <button
          onClick={() => dispatch(clearScanLogs())}
          className="text-xs text-gray-450 hover:text-red-500 font-bold flex items-center gap-1 cursor-pointer select-none"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear logs
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Scanner Viewfinder (Left) */}
        <div className="lg:col-span-7">
          <Card className="flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gray-950 border-gray-800 text-white min-h-[420px]">
            {/* Mock camera view */}
            <div className="absolute inset-0 bg-radial-at-c from-gray-900/60 to-black pointer-events-none" />
            
            {/* Bounding box animation */}
            <div className="relative h-64 w-64 border-2 border-gray-700/50 rounded-3xl flex items-center justify-center p-2 mb-6">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-brand rounded-tl-2xl" />
              <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-brand rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-brand rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-brand rounded-br-2xl" />
              
              {/* Laser line animation */}
              <div className="w-full h-0.5 bg-brand shadow-[0_0_12px_#00c49f] relative -translate-y-4 animate-bounce" />
              
              {scanning ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl animate-fadeIn">
                  <div className="text-center space-y-2">
                    <Camera className="h-8 w-8 text-brand animate-pulse mx-auto" />
                    <span className="text-xs font-bold text-gray-200 tracking-wider">Decoding QR Code...</span>
                  </div>
                </div>
              ) : successAnimation ? (
                <div className="absolute inset-0 flex items-center justify-center bg-brand/10 border-2 border-brand rounded-3xl animate-fadeIn">
                  <div className="text-center space-y-1">
                    <Sparkles className="h-8 w-8 text-brand animate-float mx-auto" />
                    <span className="text-xs font-bold text-brand tracking-widest">SUCCESS</span>
                  </div>
                </div>
              ) : (
                <Scan className="h-12 w-12 text-gray-600 animate-pulse" />
              )}
            </div>

            {/* Test Scanner Form Overlay */}
            <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-4 shadow-xl text-left select-none z-10">
              <div className="text-xs font-bold text-brand uppercase tracking-wider">Simulate Card Scan</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Select Student</label>
                  <select
                    value={selectedRoll}
                    onChange={e => setSelectedRoll(e.target.value)}
                    className="w-full bg-gray-805 text-xs text-white font-semibold py-1.5 px-2.5 rounded-lg outline-none border border-gray-700"
                  >
                    {students.map(s => (
                      <option key={s.rollNo} value={s.rollNo}>
                        {s.name} ({s.room})
                      </option>
                    ))}
                    <option value="MS9999">Unknown Card ID</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Meal Session</label>
                  <select
                    value={selectedMeal}
                    onChange={e => setSelectedMeal(e.target.value)}
                    className="w-full bg-gray-805 text-xs text-white font-semibold py-1.5 px-2.5 rounded-lg outline-none border border-gray-700"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </div>

              <Button
                variant="brand"
                size="sm"
                className="w-full font-bold py-2 cursor-pointer flex items-center justify-center gap-1.5"
                onClick={handleScan}
                disabled={scanning}
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Trigger Scanner Sensor
              </Button>
            </div>
          </Card>
        </div>

        {/* Live Logs Feed (Right) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Scan Profile Card */}
          {scannedLogs.length > 0 && (
            (() => {
              const lastScan = scannedLogs[0]
              const lastStudent = students.find(s => s.rollNo === lastScan.rollNo)
              const initials = lastStudent 
                ? lastStudent.name.split(' ').map(n => n[0]).join('')
                : 'UN'

              return (
                <Card className="border-brand/20 bg-gradient-to-tr from-brand-light/10 to-white select-none animate-fadeIn">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] text-brand font-bold uppercase tracking-wider">Active Scan Profile</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize",
                      lastScan.status === 'success' ? 'bg-emerald-50 text-brand border-brand/20' :
                      lastScan.status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-red-50 text-red-650 border-red-150'
                    )}>
                      {lastScan.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-brand text-white font-black text-sm flex items-center justify-center border border-brand/10 shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                        {lastStudent ? lastStudent.name : 'Unregistered Resident'}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Roll: {lastScan.rollNo} · Room: {lastStudent ? lastStudent.room : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-center text-[10px] font-semibold text-gray-500">
                    <div className="text-left">
                      <span>Attendance Rate:</span>
                      <span className={cn(
                        "block text-xs font-black mt-0.5",
                        lastStudent && lastStudent.attendancePercent < 75 ? 'text-red-500' : 'text-gray-900'
                      )}>
                        {lastStudent ? `${lastStudent.attendancePercent}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span>Meal Vote:</span>
                      <span className="block text-xs font-black text-gray-900 mt-0.5 uppercase">
                        {lastStudent ? 'Voted Yes' : 'No Vote'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "mt-4 p-2.5 rounded-xl text-center text-xs font-bold leading-normal border",
                    lastScan.status === 'success' ? 'bg-emerald-50/50 text-brand border-brand/10' :
                    lastScan.status === 'warning' ? 'bg-amber-50/50 text-amber-600 border-amber-100/50' :
                    'bg-red-50/50 text-red-650 border-red-150/50'
                  )}>
                    {lastScan.message}
                  </div>
                </Card>
              )
            })()
          )}

          <Card className="flex flex-col h-[280px] space-y-4">
            <h3 className="font-bold text-gray-900 text-sm font-heading">Recent scan logs</h3>
            <div className="divide-y divide-gray-150 flex-1 overflow-y-auto pr-1">
              {scannedLogs.length === 0 ? (
                <div className="py-16 text-center text-xs text-gray-400">Viewfinder ready. Waiting for student cards...</div>
              ) : (
                scannedLogs.map(log => (
                  <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                    <div className={cn('h-8 w-8 rounded-lg border flex items-center justify-center shrink-0', getLogBadgeColor(log.status))}>
                      {getLogIcon(log.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-gray-900">{log.studentName}</span>
                        <span className="text-[9px] text-gray-400 font-bold">{log.time}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Roll: {log.rollNo} · Room: {log.room} · Session: {log.meal}
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 leading-normal mt-0.5">{log.message}</p>
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
export default MessQRScanner
