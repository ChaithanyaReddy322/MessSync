import React from 'react'
import Card from '../../components/ui/Card'
import { BarChart3, Download, TrendingUp, Calendar, AlertCircle, Sparkles } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts'

export const MessAnalytics: React.FC = () => {
  // Mock data for waste and savings
  const wasteHistory = [
    { week: 'Week 1', waste: 210, saved: 340, savings: 8500 },
    { week: 'Week 2', waste: 180, saved: 390, savings: 9750 },
    { week: 'Week 3', waste: 140, saved: 410, savings: 10250 },
    { week: 'Week 4', waste: 98, saved: 460, savings: 11500 }
  ]

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
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card flex items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Kitchen Analytics</h1>
          <p className="text-gray-450 text-xs font-semibold mt-1">Detailed metrics on savings, portions, and waste reduction patterns.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-650 hover:bg-gray-50 flex items-center gap-1 cursor-pointer">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Analytics highlights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="space-y-2 select-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Food waste cut</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900">42%</span>
            <span className="text-[10px] text-brand font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +14% vs last month
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">System-wide averages indicate savings of 120 portions daily.</p>
        </Card>

        <Card className="space-y-2 select-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Procurement Saved</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900">₹42,000</span>
            <span className="text-[10px] text-brand font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Sparkles className="h-3 w-3 fill-brand/20" /> Low Waste
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Savings accrued from reduced counts on raw groceries.</p>
        </Card>

        <Card className="space-y-2 select-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Safety Buffer Accuracy</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900">96.8%</span>
            <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              Ideal Margin
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">No meal sessions suffered shortage, keeping student satisfaction high.</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Waste Reduction Trend Line Chart */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-sm font-heading">Waste vs saved portions</h3>
                <span className="text-[10px] text-gray-400 font-semibold">Weekly tracking (portions)</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wasteHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                  <Line name="portions wasted" type="monotone" dataKey="waste" stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line name="portions saved" type="monotone" dataKey="saved" stroke="#00c49f" strokeWidth={2.5} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Cost Savings Column Chart */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-sm font-heading">Weekly savings</h3>
                <span className="text-[10px] text-gray-400 font-semibold">INR savings accrued weekly</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar name="Groceries Savings (₹)" dataKey="savings" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default MessAnalytics
