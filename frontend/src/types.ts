export interface PredictionResult {
  prediction_label: 'Fraud' | 'Normal'
  anomaly_score: number
  risk_level: 'High' | 'Medium' | 'Low'
  message: string
}

export interface MetricsData {
  precision: number
  recall: number
  f1_score: number
  accuracy: number
  confusion_matrix: number[][]
  dataset_size: number
  fraud_count: number
  normal_count: number
}
