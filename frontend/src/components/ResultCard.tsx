import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react'
import type { PredictionResult } from '../types'

interface ResultCardProps {
  result: PredictionResult | null
}

export default function ResultCard({ result }: ResultCardProps) {
  if (!result) {
    return (
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 flex flex-col items-center justify-center min-h-[200px] text-[#9CA3AF]">
        <ShieldAlert className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm">Run a prediction to see results</p>
      </div>
    )
  }

  const isFraud = result.prediction_label === 'Fraud'

  const config = isFraud
    ? {
        glow: 'glow-red',
        border: 'border-rose-500/30',
        bg: 'bg-rose-500/5',
        iconBg: 'bg-rose-500/15',
        iconColor: 'text-rose-400',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      }
    : {
        glow: 'glow-green',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/5',
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      }

  const Icon = isFraud ? AlertTriangle : CheckCircle

  return (
    <div className={`relative rounded-xl border p-6 animate-fade-in ${config.border} ${config.bg} ${config.glow}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${config.iconBg} transition-transform duration-300 hover:scale-110`}>
          <Icon className={`w-7 h-7 ${config.iconColor}`} />
        </div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.badge}`}>
            {result.risk_level} Risk
          </span>
          <h3 className={`text-3xl font-bold mt-1 ${config.iconColor}`}>
            {result.prediction_label}
          </h3>
        </div>
      </div>

      <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">{result.message}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0B0F14] rounded-lg p-3 border border-[#1F2937]">
          <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Anomaly Score</p>
          <p className="text-xl font-mono font-semibold text-white mt-1">{result.anomaly_score.toFixed(4)}</p>
        </div>
        <div className="bg-[#0B0F14] rounded-lg p-3 border border-[#1F2937]">
          <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Confidence</p>
          <p className="text-xl font-semibold text-white mt-1">
            {Math.abs(result.anomaly_score).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
