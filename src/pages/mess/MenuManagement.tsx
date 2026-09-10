import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateMealMenuAsync, updateMealSettingsAsync } from '../../store/slices/mealSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { CalendarDays, Save, Clock, Percent, ListPlus, Settings, CheckCircle2 } from 'lucide-react'

export const MessMenuManagement: React.FC = () => {
  const dispatch = useAppDispatch()
  const todayMeals = useAppSelector(state => state.meals.todayMeals)

  const [activeTab, setActiveTab] = useState<'menu' | 'timings'>('menu')
  const [successMsg, setSuccessMsg] = useState('')

  // Form states for menu editor
  const [bfMenu, setBfMenu] = useState(todayMeals.find(m => m.id === 'breakfast')?.menu || '')
  const [lhMenu, setLhMenu] = useState(todayMeals.find(m => m.id === 'lunch')?.menu || '')
  const [dnMenu, setDnMenu] = useState(todayMeals.find(m => m.id === 'dinner')?.menu || '')

  // Form states for timings config
  const [bfTime, setBfTime] = useState(todayMeals.find(m => m.id === 'breakfast')?.time || '')
  const [bfCutoff, setBfCutoff] = useState(todayMeals.find(m => m.id === 'breakfast')?.cutoff || '')
  const [bfLimit, setBfLimit] = useState(todayMeals.find(m => m.id === 'breakfast')?.limit || 420)

  const [lhTime, setLhTime] = useState(todayMeals.find(m => m.id === 'lunch')?.time || '')
  const [lhCutoff, setLhCutoff] = useState(todayMeals.find(m => m.id === 'lunch')?.cutoff || '')
  const [lhLimit, setLhLimit] = useState(todayMeals.find(m => m.id === 'lunch')?.limit || 420)

  const [dnTime, setDnTime] = useState(todayMeals.find(m => m.id === 'dinner')?.time || '')
  const [dnCutoff, setDnCutoff] = useState(todayMeals.find(m => m.id === 'dinner')?.cutoff || '')
  const [dnLimit, setDnLimit] = useState(todayMeals.find(m => m.id === 'dinner')?.limit || 420)

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateMealMenuAsync({ id: 'breakfast', menu: bfMenu }))
    dispatch(updateMealMenuAsync({ id: 'lunch', menu: lhMenu }))
    dispatch(updateMealMenuAsync({ id: 'dinner', menu: dnMenu }))

    setSuccessMsg('Weekly menu text items saved successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleSaveTimings = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateMealSettingsAsync({ id: 'breakfast', time: bfTime, cutoff: bfCutoff, limit: Number(bfLimit) }))
    dispatch(updateMealSettingsAsync({ id: 'lunch', time: lhTime, cutoff: lhCutoff, limit: Number(lhLimit) }))
    dispatch(updateMealSettingsAsync({ id: 'dinner', time: dnTime, cutoff: dnCutoff, limit: Number(dnLimit) }))

    setSuccessMsg('Meal cutoff times and margins configured!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card flex items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Menu Management</h1>
          <p className="text-gray-450 text-xs font-semibold mt-1">Configure daily kitchen menu schedules, timing brackets, and buffer margins.</p>
        </div>

        <div className="bg-gray-100 p-0.5 rounded-xl flex shrink-0">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Daily Menus
          </button>
          <button
            onClick={() => setActiveTab('timings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timings' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Cutoff Timings
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 select-none animate-fadeIn">
          <CheckCircle2 className="h-4.5 w-4.5 text-brand shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {activeTab === 'menu' ? (
        <form onSubmit={handleSaveMenu} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Breakfast Card */}
            <Card className="space-y-4">
              <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[9px] font-bold text-gray-450 select-none">Breakfast Menu</span>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block select-none">Menu Text Items</label>
                <textarea
                  required
                  rows={6}
                  value={bfMenu}
                  onChange={e => setBfMenu(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all leading-relaxed"
                />
              </div>
            </Card>

            {/* Lunch Card */}
            <Card className="space-y-4">
              <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[9px] font-bold text-gray-450 select-none">Lunch Menu</span>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block select-none">Menu Text Items</label>
                <textarea
                  required
                  rows={6}
                  value={lhMenu}
                  onChange={e => setLhMenu(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all leading-relaxed"
                />
              </div>
            </Card>

            {/* Dinner Card */}
            <Card className="space-y-4">
              <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[9px] font-bold text-gray-450 select-none">Dinner Menu</span>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block select-none">Menu Text Items</label>
                <textarea
                  required
                  rows={6}
                  value={dnMenu}
                  onChange={e => setDnMenu(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all leading-relaxed"
                />
              </div>
            </Card>
          </div>

          <div className="text-right select-none">
            <Button type="submit" className="font-bold cursor-pointer inline-flex items-center gap-1.5">
              <Save className="h-4 w-4" /> Save Weekly Menu Changes
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSaveTimings} className="space-y-6">
          <Card className="space-y-6">
            <h3 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-2 border-b border-gray-50 pb-4 select-none">
              <Settings className="h-4.5 w-4.5 text-brand" /> Timing default thresholds
            </h3>

            {/* Session Settings List */}
            <div className="space-y-6">
              {/* Breakfast Config Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="font-bold text-xs text-gray-900 uppercase tracking-wider select-none md:pb-2.5">
                  🥗 Breakfast Session
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Timings Window</label>
                  <input
                    type="text"
                    value={bfTime}
                    onChange={e => setBfTime(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Cutoff Deadline</label>
                  <input
                    type="text"
                    value={bfCutoff}
                    onChange={e => setBfCutoff(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Capacity limit</label>
                  <input
                    type="number"
                    value={bfLimit}
                    onChange={e => setBfLimit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              {/* Lunch Config Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="font-bold text-xs text-gray-900 uppercase tracking-wider select-none md:pb-2.5">
                  🍲 Lunch Session
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Timings Window</label>
                  <input
                    type="text"
                    value={lhTime}
                    onChange={e => setLhTime(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Cutoff Deadline</label>
                  <input
                    type="text"
                    value={lhCutoff}
                    onChange={e => setLhCutoff(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Capacity limit</label>
                  <input
                    type="number"
                    value={lhLimit}
                    onChange={e => setLhLimit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              {/* Dinner Config Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="font-bold text-xs text-gray-900 uppercase tracking-wider select-none md:pb-2.5">
                  🍛 Dinner Session
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Timings Window</label>
                  <input
                    type="text"
                    value={dnTime}
                    onChange={e => setDnTime(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Cutoff Deadline</label>
                  <input
                    type="text"
                    value={dnCutoff}
                    onChange={e => setDnCutoff(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block select-none">Capacity limit</label>
                  <input
                    type="number"
                    value={dnLimit}
                    onChange={e => setDnLimit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="text-right select-none">
            <Button type="submit" className="font-bold cursor-pointer inline-flex items-center gap-1.5">
              <Save className="h-4 w-4" /> Save Cutoff Configurations
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
export default MessMenuManagement
