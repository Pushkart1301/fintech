import os
import json
import joblib
import numpy as np
import pandas as pd


class PredictionService:
    def __init__(self, model_path, scaler_path, metrics_path):
        self.model = None
        self.scaler = None
        self.metrics = None
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.metrics_path = metrics_path
        self._load()

    def _load(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        if os.path.exists(self.scaler_path):
            self.scaler = joblib.load(self.scaler_path)
        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, "r") as f:
                self.metrics = json.load(f)

    def is_ready(self):
        return self.model is not None and self.scaler is not None

    def get_metrics(self):
        return self.metrics or {}

    def _preprocess(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        if "Time" in df.columns and "Amount" in df.columns:
            df[["Time", "Amount"]] = self.scaler.transform(df[["Time", "Amount"]])
        return df

    def _build_feature_df(self, payload):
        feature_cols = ["Time", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9",
                        "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18",
                        "V19", "V20", "V21", "V22", "V23", "V24", "V25", "V26", "V27",
                        "V28", "Amount"]
        if isinstance(payload, list):
            df = pd.DataFrame(payload)
        elif isinstance(payload, dict):
            df = pd.DataFrame([payload])
        else:
            df = payload
        missing = [c for c in feature_cols if c not in df.columns]
        if missing:
            raise ValueError(f"Missing columns: {missing}")
        return df[feature_cols]

    def predict(self, payload):
        df = self._build_feature_df(payload)
        df_processed = self._preprocess(df)
        X = df_processed.values
        raw_preds = self.model.predict(X)
        scores = self.model.decision_function(X)

        results = []
        for pred, score in zip(raw_preds, scores):
            # Lowered threshold for demo: flag more outliers as Fraud
            label = "Fraud" if score < 0.05 else "Normal"
            if score < -0.1:
                risk = "High"
            elif score < 0.05:
                risk = "Medium"
            else:
                risk = "Low"
            if risk == "High":
                msg = "This transaction appears unusual compared to normal patterns."
            elif risk == "Medium":
                msg = "This transaction shows some unusual behavior."
            else:
                msg = "This transaction appears normal."
            results.append({
                "prediction_label": label,
                "anomaly_score": round(float(score), 4),
                "risk_level": risk,
                "message": msg
            })
        return results
