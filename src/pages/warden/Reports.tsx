import React from 'react'
import Card from '../../components/ui/Card'
import { FileText, Download, BarChart2, Calendar, FileSpreadsheet } from 'lucide-react'

export const WardenReports: React.FC = () => {
  const reportsList = [
    { title: 'Weekly Mess Waste & Cost Analysis (Jul 20 - Jul 26)', date: 'Jul 26, 2026', size: '2.4 MB', type: 'PDF' },
    { title: 'Monthly Attendance Log & Safety Margin Audit (June)', date: 'Jul 01, 2026', size: '14.8 MB', type: 'XLSX' },
    { title: 'Warden Summary Report - High Missers SMS Track', date: 'Jul 01, 2026', size: '840 KB', type: 'PDF' }
  ]

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Reports Directory</h1>
        <p className="text-gray-450 text-xs font-semibold mt-1">Download cost statements, raw grocery logs, and monthly student audit summaries.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="space-y-2 select-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Average Monthly Waste</span>
          <div className="text-2xl font-black text-gray-900">410 kg</div>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Represents a 45% drop from pre-MessSync averages.</p>
        </Card>
        
        <Card className="space-y-2 select-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Est. Grocery Savings</span>
          <div className="text-2xl font-black text-gray-900">₹1,84,000</div>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Accumulated financial margin over the current trimester.</p>
        </Card>

        <Card className="space-y-2 select-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Attendance accuracy</span>
          <div className="text-2xl font-black text-gray-900">96.4%</div>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Calculated via daily QR barcode scan records.</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between select-none">
          <span className="text-xs font-bold text-gray-900">Available documents</span>
        </div>

        <div className="divide-y divide-gray-150">
          {reportsList.map((rep, idx) => (
            <div key={idx} className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center shrink-0">
                  {rep.type === 'PDF' ? <FileText className="h-5 w-5" /> : <FileSpreadsheet className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">{rep.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold mt-1">
                    <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" /> Published: {rep.date}</span>
                    <span>· File size: {rep.size}</span>
                  </div>
                </div>
              </div>

              <button className="p-2 text-gray-450 hover:text-brand hover:bg-brand-light/30 border border-gray-200 rounded-lg hover:border-brand-light transition-all flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer select-none">
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
export default WardenReports
