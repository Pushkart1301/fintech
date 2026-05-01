# FinGuard AI

A complete end-to-end fintech web application for credit card fraud detection using machine learning.

## Overview

FinGuard AI detects fraudulent vs normal credit card transactions using an Isolation Forest model trained on the `creditcard.csv` dataset. The system provides:

- Real-time single transaction prediction
- Batch CSV upload and processing
- Interactive dashboard with KPIs, charts, and recent predictions
- Risk level classification (Low / Medium / High)

## Tech Stack

- **Backend**: Python, Flask, scikit-learn, pandas, joblib
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Recharts
- **ML Model**: Isolation Forest with StandardScaler preprocessing

## Project Structure

```
finguard-ai/
├── backend/
│   ├── app.py
│   ├── train.py
│   ├── requirements.txt
│   ├── routes/
│   │   └── predict.py
│   ├── services/
│   │   └── prediction_service.py
│   ├── utils/
│   │   └── helpers.py
│   ├── artifacts/
│   │   ├── isolation_forest_model.pkl
│   │   ├── scaler.pkl
│   │   ├── metrics.json
│   │   └── confusion_matrix.png
│   └── data/
│       ├── creditcard.csv
│       ├── sample_transactions.json
│       └── sample_batch.csv
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types.ts
│       └── components/
│           ├── Navbar.tsx
│           ├── Dashboard.tsx
│           ├── PredictionForm.tsx
│           ├── ResultCard.tsx
│           ├── RecentPredictions.tsx
│           ├── Charts.tsx
│           └── CsvResults.tsx
└── README.md
```

## Setup

### Backend

1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. Train the model (one-time):
   ```bash
   python backend/train.py
   ```

3. Start the Flask server:
   ```bash
   python backend/app.py
   ```

The backend runs on `http://127.0.0.1:5000`.

### Frontend

1. Install Node dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

The frontend runs on `http://127.0.0.1:5173` and proxies API calls to the backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| POST | `/predict` | Single transaction prediction |
| POST | `/predict-batch` | Batch prediction (JSON array or CSV file) |
| GET | `/metrics` | Training metrics |

### Sample API Request

```bash
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Time": 0,
    "V1": -1.3598,
    "V2": -0.07278,
    "V3": 2.5363,
    "V4": 1.3781,
    "V5": -0.3383,
    "V6": 0.4623,
    "V7": 0.2395,
    "V8": 0.09869,
    "V9": 0.3637,
    "V10": 0.09079,
    "V11": -0.5515,
    "V12": -0.6178,
    "V13": -0.9913,
    "V14": -0.3111,
    "V15": 1.4681,
    "V16": -0.4704,
    "V17": 0.2079,
    "V18": 0.02579,
    "V19": 0.4039,
    "V20": 0.2514,
    "V21": -0.0183,
    "V22": 0.2778,
    "V23": -0.1104,
    "V24": 0.0669,
    "V25": 0.1285,
    "V26": -0.1891,
    "V27": 0.1335,
    "V28": -0.02105,
    "Amount": 149.62
  }'
```

## Model Details

- **Algorithm**: Isolation Forest
- **Contamination**: 0.001
- **Preprocessing**: StandardScaler applied to `Time` and `Amount` only
- **Feature set**: Time, V1-V28, Amount (30 features)
- **Output mapping**:
  - `-1` -> Fraud
  - `1` -> Normal
- **Risk levels**:
  - `score < -0.2` -> High Risk
  - `-0.2 <= score <= 0` -> Medium Risk
  - `score > 0` -> Low Risk

## Sample Data

Sample transactions are provided in:
- `backend/data/sample_transactions.json` (5 samples)
- `backend/data/sample_batch.csv` (5 rows)

## Screenshots

1. Dashboard with KPI cards and charts
2. Single prediction with result card
3. Batch CSV upload with highlighted fraud rows
4. Recent predictions table

## Notes

- The dataset `creditcard.csv` is highly imbalanced (0.17% fraud).
- Isolation Forest is well-suited for this anomaly detection scenario.
- The frontend uses sample transactions to avoid manual V1-V28 input.
