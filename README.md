# walmart-nutrition-extension-Coze-AI# Walmart Nutrition Lookup Extension

A Chrome extension + Python backend that grabs the items in your Walmart cart, sends each one through a Coze AI workflow (GPT‑4 + Nutritionix), and logs nutritional summaries in your console.

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
