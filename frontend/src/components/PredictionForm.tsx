import { useState } from 'react'
import { Zap, Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { apiPost } from '../api'
import type { PredictionResult } from '../types'


interface PredictionFormProps {
  onPredict: (result: PredictionResult) => void
  onBatchPredict: (results: PredictionResult[]) => void
  onFileUpload: (file: File) => void
}

const sampleTransactions = [
  { Time: 0, V1: -1.3598, V2: -0.07278, V3: 2.5363, V4: 1.3781, V5: -0.3383, V6: 0.4623, V7: 0.2395, V8: 0.09869, V9: 0.3637, V10: 0.09079, V11: -0.5515, V12: -0.6178, V13: -0.9913, V14: -0.3111, V15: 1.4681, V16: -0.4704, V17: 0.2079, V18: 0.02579, V19: 0.4039, V20: 0.2514, V21: -0.0183, V22: 0.2778, V23: -0.1104, V24: 0.0669, V25: 0.1285, V26: -0.1891, V27: 0.1335, V28: -0.02105, Amount: 149.62 },
  { Time: 1, V1: -1.3583, V2: -1.3401, V3: 1.7732, V4: 0.3797, V5: -0.5031, V6: 1.8004, V7: 0.7914, V8: 0.2476, V9: -1.5146, V10: 0.2076, V11: 0.6245, V12: 0.0660, V13: 0.7172, V14: -0.1659, V15: 2.3458, V16: -2.8900, V17: 1.1099, V18: -0.1213, V19: -2.2618, V20: 0.5249, V21: 0.2479, V22: 0.7716, V23: 0.9094, V24: -0.6892, V25: -0.3276, V26: -0.1390, V27: -0.0553, V28: -0.0597, Amount: 378.66 },
  { Time: 2, V1: -0.4259, V2: 0.9606, V3: 1.1411, V4: -0.1680, V5: 0.4209, V6: -0.0297, V7: 0.4762, V8: 0.2603, V9: -0.5686, V10: -0.3716, V11: 1.3464, V12: 2.0322, V13: -0.1940, V14: 0.0826, V15: -0.1178, V16: -0.2100, V17: 0.7286, V18: 0.3102, V19: -0.1718, V20: 0.1044, V21: -0.2249, V22: 0.3964, V23: 0.1459, V24: 0.2805, V25: -0.1462, V26: -0.2297, V27: -0.1545, V28: -0.0239, Amount: 12.99 },
]

const vKeys = Array.from({ length: 28 }, (_, i) => `V${i + 1}`)

export default function PredictionForm({ onPredict, onFileUpload }: PredictionFormProps) {
  const [sampleIndex, setSampleIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [csvLoading, setCsvLoading] = useState(false)
  const [showV, setShowV] = useState(false)
  const [form, setForm] = useState<Record<string, number>>(sampleTransactions[0])

  const useSample = () => {
    const next = (sampleIndex + 1) % sampleTransactions.length
    setSampleIndex(next)
    setForm(sampleTransactions[next])
  }

  const handlePredict = async () => {
    setLoading(true)
    try {
      const data = await apiPost('/api/predict', form)
      onPredict(data)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvLoading(true)
    try {
      await onFileUpload(file)
    } finally {
      setCsvLoading(false)
    }
  }

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: parseFloat(v) || 0 }))

  return (
    <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Transaction Analysis</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Analyze a single transaction for fraud</p>
        </div>
        <button
          onClick={useSample}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-sm text-[#9CA3AF] transition border border-[#374151]"
        >
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          Use Sample ({sampleIndex + 1}/{sampleTransactions.length})
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Time</label>
          <input
            type="number"
            value={form.Time}
            onChange={e => update('Time', e.target.value)}
            className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={form.Amount}
            onChange={e => update('Amount', e.target.value)}
            className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>
      </div>

      <button
        onClick={() => setShowV(v => !v)}
        className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition"
      >
        {showV ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {showV ? 'Hide' : 'Show'} V1–V28 PCA Features ({showV ? 'expanded' : 'collapsed'})
      </button>

      {showV && (
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 animate-fade-in">
          {vKeys.map(k => (
            <div key={k} className="space-y-1">
              <label className="text-[9px] text-[#9CA3AF] font-mono">{k}</label>
              <input
                type="number"
                step="0.0001"
                value={form[k] ?? 0}
                onChange={e => update(k, e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-md px-2 py-1 text-[11px] font-mono text-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-[#1F2937] text-white font-medium transition shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:scale-[0.98] disabled:active:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing...
          </span>
        ) : (
          'Predict'
        )}
      </button>

      <div className="border-t border-[#1F2937] pt-6">
        <h2 className="text-lg font-semibold text-white mb-1">Batch Upload</h2>
        <p className="text-xs text-[#9CA3AF] mb-3">Upload a CSV file for batch prediction</p>
        <label className={`flex flex-col items-center justify-center gap-2 w-full py-6 rounded-lg border-2 border-dashed cursor-pointer transition ${csvLoading ? 'border-blue-500 bg-blue-500/5' : 'border-[#374151] hover:border-[#4B5563] bg-[#0B0F14]/50'}`}>
          <Upload className={`w-6 h-6 ${csvLoading ? 'text-blue-400 animate-spin' : 'text-[#9CA3AF]'}`} />
          <span className="text-sm text-[#9CA3AF]">{csvLoading ? 'Processing batch...' : 'Drop CSV or click to upload'}</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} disabled={csvLoading} />
        </label>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#6B7280]">
          <FileText className="w-3.5 h-3.5" />
          <span>Expected columns: Time, V1-V28, Amount</span>
        </div>
      </div>
    </div>
  )
}
