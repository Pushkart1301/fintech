import { Activity, AlertTriangle, CheckCircle, Gauge } from 'lucide-react'

interface DashboardProps {
  totalPredictions: number
  fraudDetected: number
  normalTransactions: number
  latestScore: number | null
}

const kpiCards = [
  {
    label: 'Total Predictions',
    key: 'total' as const,
    icon: Activity,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    label: 'Fraud Detected',
    key: 'fraud' as const,
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
    gradient: 'from-rose-500/20 to-rose-600/5',
  },
  {
    label: 'Normal Transactions',
    key: 'normal' as const,
    icon: CheckCircle,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    label: 'Latest Score',
    key: 'score' as const,
    icon: Gauge,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20 to-amber-600/5',
  },
]

export default function Dashboard({ totalPredictions, fraudDetected, normalTransactions, latestScore }: DashboardProps) {
  const values = {
    total: totalPredictions,
    fraud: fraudDetected,
    normal: normalTransactions,
    score: latestScore !== null ? latestScore.toFixed(4) : '-',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((card) => {
        const Icon = card.icon
        const value = values[card.key]
        return (
          <div
            key={card.key}
            className="group relative bg-[#111827] rounded-xl p-5 border border-[#1F2937] hover:border-[#374151] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${card.iconBg} ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#9CA3AF] tracking-wide uppercase">{card.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5 tracking-tight">{value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
