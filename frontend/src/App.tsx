import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import PredictionForm from './components/PredictionForm'
import ResultCard from './components/ResultCard'
import RecentPredictions from './components/RecentPredictions'
import Charts from './components/Charts'
import CsvResults from './components/CsvResults'
import { apiUpload } from './api'
import type { PredictionResult } from './types'

export default function App() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [latestResult, setLatestResult] = useState<PredictionResult | null>(null)
  const [csvResults, setCsvResults] = useState<{ fraudCount: number; normalCount: number; rows: any[]; totalRows?: number; processedRows?: number }>({ fraudCount: 0, normalCount: 0, rows: [] })

  const handlePredict = (result: PredictionResult) => {
    setLatestResult(result)
    setPredictions(prev => [result, ...prev].slice(0, 50))
  }

  const handleBatchPredict = (results: PredictionResult[]) => {
    setPredictions(prev => [...results, ...prev].slice(0, 50))
  }

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const data = await apiUpload('/api/predict-batch', formData)
      setCsvResults({
        fraudCount: data.fraud_count,
        normalCount: data.normal_count,
        rows: data.rows || [],
        totalRows: data.total_rows,
        processedRows: data.processed_rows
      })
      if (data.predictions) {
        handleBatchPredict(data.predictions)
      }
    } catch (e: any) {
      alert(e.message || 'Batch prediction failed')
    }
  }

  const total = predictions.length
  const fraud = predictions.filter(p => p.prediction_label === 'Fraud').length
  const normal = predictions.filter(p => p.prediction_label === 'Normal').length
  const latestScore = predictions.length > 0 ? predictions[0].anomaly_score : null

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-12">
        <Dashboard
          totalPredictions={total}
          fraudDetected={fraud}
          normalTransactions={normal}
          latestScore={latestScore}
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <PredictionForm onPredict={handlePredict} onBatchPredict={handleBatchPredict} onFileUpload={handleFileUpload} />
          </div>
          <div className="lg:col-span-2">
            <ResultCard result={latestResult} />
          </div>
        </div>
        <Charts predictions={predictions} />
        {csvResults.rows.length > 0 && (
          <CsvResults
            fraudCount={csvResults.fraudCount}
            normalCount={csvResults.normalCount}
            rows={csvResults.rows}
            totalRows={csvResults.totalRows}
            processedRows={csvResults.processedRows}
          />
        )}
        <RecentPredictions predictions={predictions} />
      </main>
    </div>
  )
}
