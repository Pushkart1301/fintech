import { useState } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'

interface CsvResultsProps {
  fraudCount: number
  normalCount: number
  rows: any[]
  totalRows?: number
  processedRows?: number
}

const PAGE_SIZE = 50

export default function CsvResults({ fraudCount, normalCount, rows, totalRows, processedRows }: CsvResultsProps) {
  const [page, setPage] = useState(0)

  if (rows.length === 0) return null

  const totalPages = Math.ceil(rows.length / PAGE_SIZE)
  const start = page * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)

  const downloadCsv = () => {
    const headers = Object.keys(rows[0]).join(',')
    const lines = rows.map(r => Object.values(r).join(','))
    const blob = new Blob([[headers, ...lines].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finguard_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-[#111827] rounded-xl border border-[#1F2937] overflow-hidden animate-fade-in">
      <div className="p-5 border-b border-[#1F2937] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Batch Results</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">CSV upload analysis results</p>
        </div>
        <button
          onClick={downloadCsv}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition shadow-lg shadow-blue-600/20"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </div>
      <div className="p-5 flex gap-3 flex-wrap items-center">
        <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          Fraud: {fraudCount}
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          Normal: {normalCount}
        </div>
        {(totalRows !== undefined && processedRows !== undefined) && (
          <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            Processed: {processedRows} / {totalRows} rows
            {totalRows > processedRows && <span className="text-[10px] ml-1 opacity-60">(limited to first 1000)</span>}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2 text-xs text-[#9CA3AF]">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded-md hover:bg-[#1F2937] disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono tabular-nums">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1 rounded-md hover:bg-[#1F2937] disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-xs">
          <thead className="bg-[#0B0F14] text-[#9CA3AF] sticky top-0 z-10">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">#</th>
              <th className="text-left px-4 py-2.5 font-medium">Time</th>
              <th className="text-left px-4 py-2.5 font-medium">Amount</th>
              <th className="text-left px-4 py-2.5 font-medium">Label</th>
              <th className="text-left px-4 py-2.5 font-medium">Score</th>
              <th className="text-left px-4 py-2.5 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr
                key={start + i}
                className={`border-t border-[#1F2937] transition-colors duration-150 ${
                  r.prediction_label === 'Fraud' ? 'bg-rose-500/[0.02] hover:bg-rose-500/5' : 'hover:bg-white/[0.02]'
                }`}
              >
                <td className="px-4 py-2.5 text-[#6B7280] font-mono">{start + i + 1}</td>
                <td className="px-4 py-2.5 font-mono text-[#9CA3AF]">{r.Time}</td>
                <td className="px-4 py-2.5 font-mono text-[#9CA3AF]">${typeof r.Amount === 'number' ? r.Amount.toFixed(2) : r.Amount}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    r.prediction_label === 'Fraud'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {r.prediction_label}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-white">{typeof r.anomaly_score === 'number' ? r.anomaly_score.toFixed(4) : r.anomaly_score}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[10px] font-medium ${
                    r.risk_level === 'High' ? 'text-rose-400' :
                    r.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {r.risk_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
