import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  Users,
  ChefHat,
  CheckCircle2,
  Flame,
  QrCode,
  TrendingUp,
  Clock
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export const MessDashboard: React.FC = () => {
  const navigate = useNavigate()
  const todayMeals = useAppSelector(state => state.meals.todayMeals)
  const weeklyAttendance = useAppSelector(state => state.meals.weeklyAttendance)
  const sessionStats = useAppSelector(state => state.meals.sessionStats)

  // Pie chart stats
  const pieData = [
    { name: 'Breakfast', value: 312 },
    { name: 'Lunch', value: 386 },
    { name: 'Dinner', value: 274 }
  ]
  const COLORS = ['#00c49f', '#3b82f6', '#f59e0b']

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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-150 p-6 rounded-2xl shadow-card select-none">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Kitchen dashboard</h1>
          <p className="text-gray-450 text-xs font-semibold">
            Live registrations, prep counts and attendance for today.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-1.5 font-bold cursor-pointer shrink-0"
          onClick={() => navigate('/staff/scanner')}
        >
          <QrCode className="h-4.5 w-4.5" /> Open scanner
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-brand border border-brand/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Registered Today</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">972</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Across 3 meals</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Recommended Prep</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">1,050</span>
            <span className="text-[10px] text-blue-500 font-bold block mt-0.5">Incl. 8% safety buffer</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Meals Served</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">586</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Live - updating</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Food Saved</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">14.2 kg</span>
            <span className="text-[10px] text-gray-450 font-medium block mt-0.5">vs last Wed</span>
          </div>
        </Card>
      </div>

      {/* Sessions Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {todayMeals.map(meal => {
          const stats = sessionStats[meal.id as 'breakfast' | 'lunch' | 'dinner']
          const percentWidth = `${Math.round((meal.registrations / meal.limit) * 100)}%`

          return (
            <Card key={meal.id} className="relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-brand-light/20 to-transparent -z-10" />

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-900 font-heading">{meal.name}</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100/50 flex items-center gap-0.5">
                    <Clock className="h-3 w-3" /> Cutoff {meal.cutoff.replace(' cutoff', '')}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 font-semibold line-clamp-2 leading-relaxed mb-4">
                  {meal.menu}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-5 select-none">
                  <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                    <span>Registered</span>
                    <span>{meal.registrations}/{meal.limit}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: percentWidth }} />
                  </div>
                </div>
              </div>

              {/* Cooking statistics grid */}
              <div className="grid grid-cols-3 gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100 text-center select-none mt-auto">
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Cook</span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">{stats.cook}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Served</span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">{stats.served}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase text-brand">Saved</span>
                  <span className="font-bold text-brand text-sm mt-0.5 block">{stats.savedKg}kg</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Visual Analytics Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Registrations vs Served Bar Chart */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-sm font-heading">Registrations vs served</h3>
                <span className="text-[10px] text-gray-400 font-semibold">Last 7 days</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-brand px-2 py-0.5 rounded-full select-none">
                <TrendingUp className="h-3 w-3" /> Waste reduced by 14%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                  <Bar name="Registered" dataKey="registered" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={16} />
                  <Bar name="Served" dataKey="served" fill="#00c49f" radius={[4, 4, 0, 0]} maxBarSize={16} />
                  <Bar name="Wasted portions" dataKey="wasted" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Today's Split Donut Chart */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm font-heading mb-1">Today's split</h3>
              <span className="text-[10px] text-gray-400 font-semibold">Meals by session</span>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Absolute center details */}
              <div className="absolute flex flex-col items-center select-none">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
                <span className="text-xl font-extrabold text-gray-900">972</span>
              </div>
            </div>

            {/* Custom Pie Legend */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-gray-600 border-t border-gray-100 pt-4 select-none">
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#00c49f]" /> Bf</span>
                <span className="text-gray-900 font-extrabold mt-0.5">312</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#3b82f6]" /> Lh</span>
                <span className="text-gray-900 font-extrabold mt-0.5">386</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Dn</span>
                <span className="text-gray-900 font-extrabold mt-0.5">274</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default MessDashboard
