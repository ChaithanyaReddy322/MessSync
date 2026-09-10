import React from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { fetchTodayMealsAsync, voteMealAsync } from '../../store/slices/mealSlice'
import {
  UtensilsCrossed,
  XCircle,
  Percent,
  Flame,
  Check,
  X,
  Clock,
  TrendingUp,
  AlertCircle,
  QrCode
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'

export const StudentDashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.currentUser)
  const todayMeals = useAppSelector(state => state.meals.todayMeals)
  const weeklyAttendance = useAppSelector(state => state.meals.weeklyAttendance)

  const [showQRModal, setShowQRModal] = React.useState(false)

  React.useEffect(() => {
    dispatch(fetchTodayMealsAsync())
  }, [dispatch])

  const handleVote = (id: string, vote: 'yes' | 'no') => {
    dispatch(voteMealAsync({ id, vote }))
  }

  // Calculate percentages
  const getPercentageString = (current: number, limit: number) => {
    return `${current}/${limit} - ${Math.round((current / limit) * 100)}%`
  }

  // Formatting for Recharts tooltip
  const customTooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #f1f5f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '8px 12px',
    fontSize: '12px'
  }

  if (!currentUser) return null

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-150 p-6 rounded-2xl shadow-card text-left select-none">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-heading flex items-center gap-2">
            Good morning, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 text-xs font-semibold">
            Wednesday, July 29 · 3 meals to vote on today
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 font-bold cursor-pointer border-brand/20 text-brand hover:bg-brand-light/35"
            onClick={() => setShowQRModal(true)}
          >
            <QrCode className="h-4 w-4" /> Show QR
          </Button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-brand border border-brand/10">
            <Flame className="h-4.5 w-4.5 fill-brand/20" /> On streak - 12 days
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left select-none">
        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-brand border border-brand/10 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Meals Taken</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{currentUser.stats?.mealsTaken}</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">This month</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Meals Missed</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{currentUser.stats?.mealsMissed}</span>
            <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5 mt-0.5">
              ↓ 2 vs last month
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Attendance</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{currentUser.stats?.attendancePercent}%</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Top 12% in hostel</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Food Saved</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{currentUser.stats?.foodSavedKg} kg</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">This month</span>
          </div>
        </Card>
      </div>

      {/* Today's Meals Section */}
      <div className="space-y-4 text-left">
        <h2 className="text-lg font-bold text-gray-900 font-heading">Today's meals</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {todayMeals.map(meal => {
            const hasVotedYes = meal.userVote === 'yes'
            const hasVotedNo = meal.userVote === 'no'
            const percentWidth = `${Math.round((meal.registrations / meal.limit) * 100)}%`

            return (
              <Card key={meal.id} className="flex flex-col justify-between overflow-hidden relative">
                {/* Visual gradient backdrop in header */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-brand-light/35 to-transparent -z-10" />
                
                <div>
                  {/* Title and Timings */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-gray-100 text-[10px] font-bold text-gray-700 shadow-3xs">
                      {meal.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {meal.time}
                    </span>
                  </div>

                  {/* Fork icon */}
                  <div className="h-12 w-12 rounded-full bg-white border border-gray-150 flex items-center justify-center mx-auto text-brand shadow-card mb-4">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>

                  {/* Menu text */}
                  <div className="space-y-1 mb-5 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Menu</span>
                    <p className="text-xs font-semibold text-gray-800 leading-relaxed px-4 line-clamp-3">
                      {meal.menu}
                    </p>
                  </div>

                  {/* Registration bar */}
                  <div className="space-y-1.5 mb-5 select-none">
                    <div className="flex justify-between text-[10px] font-semibold text-gray-500">
                      <span>Registration</span>
                      <span>{getPercentageString(meal.registrations, meal.limit)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-300"
                        style={{ width: percentWidth }}
                      />
                    </div>
                  </div>

                  {/* Deadlines badges */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-3.5 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" /> Cutoff {meal.cutoff}
                    </span>
                    <span className="text-amber-600 bg-amber-50 border border-amber-100/50 px-1.5 py-0.5 rounded-md font-semibold">
                      {meal.timeLeft}
                    </span>
                  </div>
                </div>

                {/* Vote buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto select-none">
                  <Button
                    variant={hasVotedYes ? 'primary' : 'outline'}
                    size="sm"
                    className="flex items-center justify-center gap-1 shadow-3xs cursor-pointer font-bold"
                    onClick={() => handleVote(meal.id, 'yes')}
                  >
                    <Check className="h-4.5 w-4.5" /> Yes
                  </Button>
                  <Button
                    variant={hasVotedNo ? 'danger' : 'outline'}
                    size="sm"
                    className="flex items-center justify-center gap-1 shadow-3xs cursor-pointer font-bold"
                    onClick={() => handleVote(meal.id, 'no')}
                  >
                    <X className="h-4.5 w-4.5" /> No
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Analytics & Activity splits */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Weekly Attendance Line Chart */}
        <div className="lg:col-span-8 text-left">
          <Card className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-sm font-heading">Weekly attendance</h3>
                <span className="text-[10px] text-gray-400 font-semibold">Registered vs served</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-brand px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> +8%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorServed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c49f" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#00c49f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" name="Registered" dataKey="registered" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRegistered)" />
                  <Area type="monotone" name="Served" dataKey="served" stroke="#00c49f" strokeWidth={2.5} fillOpacity={1} fill="url(#colorServed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-4 text-left">
          <Card className="h-full flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm font-heading mb-6">Recent activity</h3>
            
            <div className="space-y-4 overflow-y-auto flex-1 max-h-[264px] pr-1">
              <div className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 flex justify-between">
                    <span>Dinner - Jul 28</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md">Voted Yes</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Collected</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 flex justify-between">
                    <span>Lunch - Jul 28</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md">Voted Yes</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Collected</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 flex justify-between">
                    <span>Breakfast - Jul 28</span>
                    <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.2 rounded-md">Voted No</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" /> Leave Approved · Safe
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 flex justify-between">
                    <span>Dinner - Jul 27</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md">Voted Yes</span>
                  </div>
                  <div className="text-[10px] text-red-500 font-bold mt-0.5 flex items-center gap-0.5">
                    Missed Meal (Auto logged)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 flex justify-between">
                    <span>Lunch - Jul 27</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md">Voted Yes</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Collected</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center">
            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <span className="text-[10px] text-brand font-bold uppercase tracking-wider block mb-1">My Mess Access</span>
            <h3 className="font-bold text-gray-900 text-lg font-heading">Meal QR Pass</h3>
            <p className="text-gray-450 text-xs mt-1 px-4 leading-relaxed">
              Show this QR code to the scanner at the mess hall entrance to check-in.
            </p>

            {/* Generated QR Mockup */}
            <div className="my-6 p-4 bg-gray-50 rounded-2xl inline-block border border-gray-100 relative">
              {/* Green scanning line decoration */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-brand opacity-60 shadow-[0_0_8px_#00c49f] animate-bounce" />
              
              <svg className="h-48 w-48 mx-auto text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" />
                <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" />
                <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z" />
                
                <rect x="40" y="0" width="8" height="8" />
                <rect x="55" y="0" width="5" height="5" />
                <rect x="45" y="10" width="10" height="5" />
                <rect x="60" y="15" width="8" height="8" />
                <rect x="40" y="25" width="5" height="5" />
                
                <rect x="0" y="40" width="10" height="5" />
                <rect x="15" y="45" width="8" height="8" />
                <rect x="25" y="55" width="5" height="5" />
                
                <rect x="40" y="40" width="15" height="15" />
                <rect x="60" y="40" width="10" height="10" />
                <rect x="80" y="40" width="5" height="5" />
                <rect x="90" y="45" width="10" height="10" />
                
                <rect x="40" y="60" width="10" height="5" />
                <rect x="55" y="65" width="8" height="8" />
                <rect x="65" y="60" width="5" height="5" />
                <rect x="45" y="80" width="12" height="12" />
                <rect x="65" y="80" width="15" height="10" />
                <rect x="85" y="75" width="8" height="8" />
                <rect x="90" y="90" width="10" height="10" />
                <rect x="75" y="90" width="5" height="5" />
              </svg>
            </div>

            {/* Student details */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs text-gray-500 font-semibold space-y-1">
              <div className="flex justify-between">
                <span>Student:</span>
                <span className="text-gray-900 font-extrabold">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Roll ID:</span>
                <span className="text-gray-900 font-extrabold">{currentUser.rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span>Room No:</span>
                <span className="text-gray-900 font-extrabold">{currentUser.room}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default StudentDashboard
