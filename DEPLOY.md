# FinGuard AI — Deployment Guide

## Overview

Deploy the backend and frontend separately:
- **Backend** (Flask API) → [Render](https://render.com) (free tier)
- **Frontend** (React) → [Netlify](https://netlify.com) (free tier)

---

## Step 1: Deploy Backend to Render

### 1.1 Sign Up
- Go to [render.com](https://render.com) and sign up with GitHub

### 1.2 Create a New Web Service
- Click **New +** → **Web Service**
- Connect your GitHub repo (`specialization`)
- Configure:
  - **Name**: `finguard-api`
  - **Runtime**: `Python 3`
  - **Build Command**: `pip install -r backend/requirements.txt`
  - **Start Command**: `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
  - **Plan**: Free

### 1.3 Set Root Directory (Important)
- Set **Root Directory** to `backend` if Render allows, OR keep repo root and adjust commands

### 1.4 Wait for Deploy
- Render will install dependencies, run `train.py`, and start the Flask app
- Copy the deployed URL: `https://finguard-api.onrender.com`

### 1.5 Test Backend
- Open `https://finguard-api.onrender.com/health` in browser
- Should return: `{"status": "ok", "model_loaded": true}`

---

## Step 2: Configure Frontend for Production

### 2.1 Update Environment File

Open `frontend/.env.production` and paste your Render URL:

```
VITE_API_URL=https://finguard-api.onrender.com
```

*(Replace with your actual Render URL)*

### 2.2 Build the Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `frontend/dist/` folder with static HTML/CSS/JS files.

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Sign Up
- Go to [netlify.com](https://netlify.com) and sign up with GitHub

### 3.2 Deploy via Drag & Drop (Fastest)
- Go to your Netlify dashboard
- Drag the `frontend/dist/` folder onto the deploy area
- Netlify gives you a URL instantly: `https://finguard-demo.netlify.app`

### 3.3 Test
- Open your Netlify URL
- Click **Predict** on sample data
- Should show result card with Normal/Fraud prediction

---

## Alternative: Deploy Frontend via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

Follow prompts to link to your Netlify site.

---

## Common Issues

### CORS Error in Browser Console
**Fix**: In `backend/app.py`, update CORS to allow your Netlify domain:

```python
from flask_cors import CORS
CORS(app, origins=["https://your-netlify-url.netlify.app"])
```

Redeploy backend after this change.

### "API_BASE is empty" / fetch fails
**Fix**: Make sure `frontend/.env.production` has the correct Render URL and you rebuilt with `npm run build`.

### Model not found on Render
**Fix**: The `train.py` must run during build to create `artifacts/` folder. Check Render build logs.

### Netlify Page Not Found on refresh
**Fix**: Add a `_redirects` file in `frontend/public/` with:
```
/* /index.html 200
```
Then rebuild.

---

## Architecture After Deploy

```
User Browser
     |
     v
Netlify (Frontend)  --->  Render (Flask Backend)
  Static React              /predict
  https://...               /predict-batch
                            /health
                            /metrics
```

---

## Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| Render Free | Sleeps after 15 min idle | First request after idle takes ~30 sec to wake up |
| Render Free | 512 MB RAM | Sufficient for this model |
| Netlify Free | 100 GB bandwidth/month | More than enough for demo |
| Netlify Free | 300 build minutes/month | ~5 min per build |

---

## Quick Summary

1. Deploy backend to Render → get URL
2. Paste URL into `frontend/.env.production`
3. Run `npm run build` in frontend
4. Drag `dist/` to Netlify
5. Done
