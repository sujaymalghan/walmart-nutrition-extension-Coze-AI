# walmart-nutrition-extension-Coze-AI# Walmart Nutrition Lookup Extension


A small Chrome extension + Python backend + Coze AI workflow that pulls the items in your Walmart cart, looks up their nutrition facts via Nutritionix, formats them with GPT‑4, and logs the results as prompt.


## 🚀 Features

- **Cart detection** on Walmart.com  
- **Background server** (FastAPI) that calls Nutritionix  
- **Coze AI workflow** for formatting & health scoring  
- **Console logs** of each item’s nutrition (calories, macros, health score)

## 📦 Contents

- `backend/`  
  - `main.py` – FastAPI app that proxies Nutritionix  
  - `requirements.txt` – Python dependencies  
- `extension/`  
  - `manifest.json`  
  - `content.js` – scrapes the DOM, sends `FETCH_NUTRITION` messages  
  - `background.js` – calls Coze API & returns formatted string

## 🔧 Installation

1. **Clone** this repo  
   ```bash
   git clone https://github.com/your‑username/walmart-nutrition-extension.git
   cd walmart-nutrition-extension
