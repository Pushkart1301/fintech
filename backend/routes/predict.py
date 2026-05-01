from flask import Blueprint, request, jsonify
import pandas as pd
import os
from services.prediction_service import PredictionService

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "isolation_forest_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "artifacts", "scaler.pkl")
METRICS_PATH = os.path.join(BASE_DIR, "artifacts", "metrics.json")
prediction_service = PredictionService(MODEL_PATH, SCALER_PATH, METRICS_PATH)

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict_single():
    try:
        data = request.get_json(force=True)
        if not isinstance(data, dict):
            return jsonify({"error": "Expected JSON object"}), 400
        results = prediction_service.predict(data)
        return jsonify(results[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@predict_bp.route("/predict-batch", methods=["POST"])
def predict_batch():
    try:
        if request.content_type and "multipart/form-data" in request.content_type:
            file = request.files.get("file")
            if not file:
                return jsonify({"error": "No file uploaded"}), 400
            df = pd.read_csv(file)
            total_rows = len(df)
            if total_rows > 10000:
                df = df.head(10000)
            results = prediction_service.predict(df)
            df["prediction_label"] = [r["prediction_label"] for r in results]
            df["anomaly_score"] = [r["anomaly_score"] for r in results]
            df["risk_level"] = [r["risk_level"] for r in results]
            # Only send display columns to frontend to reduce payload size
            display_df = df[["Time", "Amount", "prediction_label", "anomaly_score", "risk_level"]].copy()
            return jsonify({
                "predictions": results,
                "fraud_count": sum(1 for r in results if r["prediction_label"] == "Fraud"),
                "normal_count": sum(1 for r in results if r["prediction_label"] == "Normal"),
                "rows": display_df.to_dict(orient="records"),
                "total_rows": int(total_rows),
                "processed_rows": len(results)
            })
        else:
            data = request.get_json(force=True)
            if not isinstance(data, list):
                return jsonify({"error": "Expected JSON array or CSV file"}), 400
            results = prediction_service.predict(data)
            return jsonify({
                "predictions": results,
                "fraud_count": sum(1 for r in results if r["prediction_label"] == "Fraud"),
                "normal_count": sum(1 for r in results if r["prediction_label"] == "Normal")
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@predict_bp.route("/metrics", methods=["GET"])
def get_metrics():
    try:
        metrics = prediction_service.get_metrics()
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
