import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { PredictionResult } from '../types'

interface ChartsProps {
  predictions: PredictionResult[]
}

const COLORS = ['#22C55E', '#EF4444']

const tooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1F2937',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
}

export default function Charts({ predictions }: ChartsProps) {
  if (predictions.length === 0) return null

  const fraudCount = predictions.filter(p => p.prediction_label === 'Fraud').length
  const normalCount = predictions.filter(p => p.prediction_label === 'Normal').length

  const pieData = [
    { name: 'Normal', value: normalCount, color: '#22C55E' },
    { name: 'Fraud', value: fraudCount, color: '#EF4444' },
  ]

  const scoreData = [
    { name: '< -0.2', count: predictions.filter(p => p.anomaly_score < -0.2).length, fill: '#EF4444' },
    { name: '-0.2 to 0', count: predictions.filter(p => p.anomaly_score >= -0.2 && p.anomaly_score <= 0).length, fill: '#F59E0B' },
    { name: '> 0', count: predictions.filter(p => p.anomaly_score > 0).length, fill: '#22C55E' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Fraud vs Normal</h3>
        <p className="text-xs text-[#9CA3AF] mb-4">Distribution of predictions</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              dataKey="value"
              stroke="none"
              paddingAngle={4}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map(d => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-[#9CA3AF]">{d.name}: {d.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Score Distribution</h3>
        <p className="text-xs text-[#9CA3AF] mb-4">Anomaly score breakdown</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={scoreData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {scoreData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
