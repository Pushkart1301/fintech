import { Clock } from 'lucide-react'
import type { PredictionResult } from '../types'

interface RecentPredictionsProps {
  predictions: PredictionResult[]
}

export default function RecentPredictions({ predictions }: RecentPredictionsProps) {
  if (predictions.length === 0) return null

  return (
    <div className="bg-[#111827] rounded-xl border border-[#1F2937] overflow-hidden">
      <div className="p-5 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#9CA3AF]" />
          <h2 className="text-lg font-semibold text-white">Recent Predictions</h2>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-0.5">Latest transaction analyses</p>
      </div>
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-sm">
          <thead className="bg-[#0B0F14] text-[#9CA3AF] sticky top-0 z-10">
            <tr>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider">#</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider">Label</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider">Score</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider">Risk</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p, i) => (
              <tr
                key={i}
                className={`border-t border-[#1F2937] transition-colors duration-150 animate-slide-in ${
                  p.prediction_label === 'Fraud' ? 'bg-rose-500/[0.02] hover:bg-rose-500/5' : 'hover:bg-white/[0.02]'
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="px-5 py-3 text-[#6B7280] text-xs font-mono">{predictions.length - i}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    p.prediction_label === 'Fraud'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {p.prediction_label}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-white text-xs">{p.anomaly_score.toFixed(4)}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center text-xs font-medium ${
                    p.risk_level === 'High' ? 'text-rose-400' :
                    p.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      p.risk_level === 'High' ? 'bg-rose-400' :
                      p.risk_level === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    {p.risk_level}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className={`w-2 h-2 rounded-full ${
                    p.prediction_label === 'Fraud' ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
