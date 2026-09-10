import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  QrCode,
  Bell,
  BarChart3,
  ShieldCheck,
  Sliders,
  Check,
  Leaf
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-gray-950 font-sans selection:bg-brand/20">
      {/* Navigation Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight font-heading">MessSync</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#impact" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Impact</a>
            <a href="#faq" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Sign In
            </button>
            <Button
              variant="primary"
              size="sm"
              className="!bg-brand hover:!bg-brand-hover"
              onClick={() => navigate('/login')}
            >
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-brand-light/20 via-transparent to-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Check className="h-3 w-3" /> Trusted by 40+ university hostels
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] font-heading">
              Cut hostel food waste. <span className="text-brand">Serve smarter.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              MessSync helps hostels prepare only what students will actually eat. Pre-register meals, scan QR attendance, and track no-shows — all from one beautiful dashboard.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="brand"
                size="lg"
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Get started free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  See how it works
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400 font-medium pt-2">
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-emerald-500" /> Free 30-Day Trial</span>
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-emerald-500" /> No setup fee</span>
            </div>
          </div>

          {/* Hero Illustration / Widget Mockup */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl relative select-none">
              {/* Header inside card */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Today - Wed, Jul 29</span>
                  <h3 className="font-bold text-gray-900 text-lg font-heading mt-0.5">Dinner registration</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  -42% waste this month
                </span>
              </div>

              {/* Progress items */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                    <span>Veg Biryani</span>
                    <span>264 students</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                    <span>Paneer Butter Masala</span>
                    <span>235 students</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '56%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                    <span>Fruit Custard</span>
                    <span>147 students</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-250 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 text-center">
                <div>
                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">Registered</span>
                  <span className="font-bold text-gray-900 text-base">386</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">Cooking For</span>
                  <span className="font-bold text-gray-900 text-base">410</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">Est. Saved</span>
                  <span className="font-bold text-gray-900 text-base">38 kg</span>
                </div>
              </div>

              {/* Scan Notification Overlay mockup */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-gray-100 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-float max-w-[200px]">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-brand shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-emerald-700 leading-none">Scan complete</span>
                  <span className="text-[10px] text-gray-400 font-medium">Aarav - Room B-204</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institution List */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powering mess halls at leading institutions</span>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 mt-6 text-sm font-semibold text-gray-400 font-heading">
            <span>IIT Ranchi</span>
            <span>NIT Trichy</span>
            <span>BITS Pilani</span>
            <span>VIT Vellore</span>
            <span>SRM University</span>
            <span>Manipal</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-brand border border-emerald-100/30">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-heading">Everything a modern mess needs.</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              From pre-registration to parent alerts — MessSync replaces registers, WhatsApp groups, and guesswork with one calm system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card hoverable className="flex flex-col items-start text-left">
              <span className="p-2.5 rounded-xl bg-brand-light text-brand mb-4">
                <Clock className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-gray-900 mb-2 font-heading">Meal pre-registration</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Students vote Yes/No before the cutoff so the kitchen cooks precisely for demand plus a safety buffer.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hoverable className="flex flex-col items-start text-left">
              <span className="p-2.5 rounded-xl bg-brand-light text-brand mb-4">
                <QrCode className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-gray-900 mb-2 font-heading">QR attendance</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Self-service scans at entry. No paper, no queues, no manual reconciliation.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hoverable className="flex flex-col items-start text-left">
              <span className="p-2.5 rounded-xl bg-brand-light text-brand mb-4">
                <Bell className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-gray-900 mb-2 font-heading">Smart notifications</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cutoff reminders, missed meal alerts, and configurable parent notifications for repeat offenses.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hoverable className="flex flex-col items-start text-left">
              <span className="p-2.5 rounded-xl bg-brand-light text-brand mb-4">
                <BarChart3 className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-gray-900 mb-2 font-heading">Live analytics</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                See registration, attendance, and waste in real-time. Export daily, weekly, monthly reports.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card hoverable className="flex flex-col items-start text-left">
              <span className="p-2.5 rounded-xl bg-brand-light text-brand mb-4">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-gray-900 mb-2 font-heading">Role-based access</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Dedicated dashboards for Students, Mess Staff, Wardens, and Admins with fine-grained permissions.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card hoverable className="flex flex-col items-start text-left">
              <span className="p-2.5 rounded-xl bg-brand-light text-brand mb-4">
                <Sliders className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-gray-900 mb-2 font-heading">Cutoff & buffer control</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tune cutoff times and safety buffers per meal. MessSync learns and suggests optimal values.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-brand border border-emerald-100/30">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-heading">Four steps from chaos to clarity.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-left space-y-4">
              <span className="text-4xl font-black text-brand leading-none">01</span>
              <h4 className="font-bold text-gray-900 text-sm font-heading">Vote before cutoff</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Students tap Yes or No for breakfast, lunch, and dinner.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-left space-y-4">
              <span className="text-4xl font-black text-brand leading-none">02</span>
              <h4 className="font-bold text-gray-900 text-sm font-heading">Kitchen cooks precisely</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Staff see live counts + safety buffer to prep the right quantity.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-left space-y-4">
              <span className="text-4xl font-black text-brand leading-none">03</span>
              <h4 className="font-bold text-gray-900 text-sm font-heading">QR scan at entry</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Attendance is captured in real-time as students walk in to collect food.
              </p>
            </div>
            {/* Step 4 */}
            <div className="text-left space-y-4">
              <span className="text-4xl font-black text-brand leading-none">04</span>
              <h4 className="font-bold text-gray-900 text-sm font-heading">Analytics & alerts</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Wasted food is tracked, and parents are notified after repeated missed meals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section id="impact" className="py-20 lg:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left panel */}
          <div className="text-left space-y-6">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-brand border border-emerald-100/35">
              <Leaf className="h-3 w-3 mr-1" /> Sustainability
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight font-heading">
              India throws away ₹92,000 crore of food every year.
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Hostel messes are among the biggest per-capita contributors. MessSync helps you cut waste at the source — by cooking only what students will actually eat.
            </p>
            <ul className="space-y-3 font-semibold text-gray-800 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-brand shrink-0" /> Average waste reduction: 35-47% within 30 days
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-brand shrink-0" /> Meal-prep accuracy: 96%+ after 2 weeks of data
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-brand shrink-0" /> Parent satisfaction: 4.8/5 across pilot hostels
              </li>
            </ul>
          </div>

          {/* Right panel (Metrics cards) */}
          <div className="grid grid-cols-2 gap-4 select-none">
            <Card className="text-left p-6">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700">Impact</span>
              <div className="text-3xl font-extrabold text-gray-900 mt-2 font-heading">42%</div>
              <p className="text-xs text-gray-500 font-semibold mt-1">Avg food waste reduction</p>
            </Card>

            <Card className="text-left p-6">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700">Impact</span>
              <div className="text-3xl font-extrabold text-gray-900 mt-2 font-heading">18k+</div>
              <p className="text-xs text-gray-500 font-semibold mt-1">Meals saved weekly</p>
            </Card>

            <Card className="text-left p-6">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700">Impact</span>
              <div className="text-3xl font-extrabold text-gray-900 mt-2 font-heading">₹4.2L</div>
              <p className="text-xs text-gray-500 font-semibold mt-1">Monthly savings per hostel</p>
            </Card>

            <Card className="text-left p-6">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700">Impact</span>
              <div className="text-3xl font-extrabold text-gray-900 mt-2 font-heading">96%</div>
              <p className="text-xs text-gray-500 font-semibold mt-1">Attendance accuracy</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white">
            <div className="h-7 w-7 rounded-md bg-brand flex items-center justify-center text-white font-bold text-base">
              M
            </div>
            <span className="font-bold text-sm tracking-tight font-heading">MessSync</span>
          </div>
          <p className="text-xs">
            © 2026 MessSync. Reduce Food Waste. Improve Student Well-being. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
export default LandingPage
