from flask import Flask, jsonify
from flask_cors import CORS
import os
import joblib
from services.prediction_service import PredictionService
from routes.predict import predict_bp

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "isolation_forest_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "artifacts", "scaler.pkl")
METRICS_PATH = os.path.join(BASE_DIR, "artifacts", "metrics.json")

prediction_service = PredictionService(MODEL_PATH, SCALER_PATH, METRICS_PATH)

app.register_blueprint(predict_bp)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": prediction_service.is_ready()})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
