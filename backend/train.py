import os
import json
import pandas as pd
import numpy as np
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score, accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "creditcard.csv")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")

print("\n--- Basic EDA ---")
print(df["Class"].value_counts())
print(f"Fraud ratio: {df['Class'].mean():.4f}")

features = df.drop(columns=["Class"])
target = df["Class"]

feature_cols = features.columns.tolist()
print(f"Feature columns ({len(feature_cols)}): {feature_cols[:5]}...{feature_cols[-3:]}")

print("\n--- Preprocessing ---")
scaler = StandardScaler()
features_scaled = features.copy()
features_scaled[["Time", "Amount"]] = scaler.fit_transform(features[["Time", "Amount"]])

print("Training Isolation Forest...")
model = IsolationForest(contamination=0.001, random_state=42, n_jobs=-1)
model.fit(features_scaled.values)

raw_preds = model.predict(features_scaled.values)
preds = np.where(raw_preds == -1, 1, 0)

scores = model.decision_function(features_scaled.values)

print("\n--- Evaluation ---")
cm = confusion_matrix(target, preds)
print("Confusion Matrix:\n", cm)

precision = precision_score(target, preds, zero_division=0)
recall = recall_score(target, preds, zero_division=0)
f1 = f1_score(target, preds, zero_division=0)
accuracy = accuracy_score(target, preds)

print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1-Score:  {f1:.4f}")
print(f"Accuracy:  {accuracy:.4f}")

metrics = {
    "precision": float(precision),
    "recall": float(recall),
    "f1_score": float(f1),
    "accuracy": float(accuracy),
    "confusion_matrix": cm.tolist(),
    "dataset_size": int(len(df)),
    "fraud_count": int(target.sum()),
    "normal_count": int(len(target) - target.sum())
}

with open(os.path.join(ARTIFACTS_DIR, "metrics.json"), "w") as f:
    json.dump(metrics, f, indent=2)

plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["Normal", "Fraud"], yticklabels=["Normal", "Fraud"])
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.savefig(os.path.join(ARTIFACTS_DIR, "confusion_matrix.png"))
plt.close()

joblib.dump(model, os.path.join(ARTIFACTS_DIR, "isolation_forest_model.pkl"))
joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, "scaler.pkl"))

print("\nArtifacts saved to:", ARTIFACTS_DIR)
print("Done.")
