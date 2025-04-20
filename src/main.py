# main.py
from fastapi import FastAPI, HTTPException
import httpx, os
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.mount(
    "/.well-known",
    StaticFiles(directory="static/.well-known", html=True),
    name="well_known",
)
APP_ID  = os.getenv("NUTRITIONIX_APP_ID", "")
APP_KEY = os.getenv("NUTRITIONIX_APP_KEY", "")

NUTRIENTS_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients"

@app.post("/nutrition/search/{query}")
async def nutrition_search(query: str):
    headers = {
        "Content-Type":  "application/json",   
        "x-app-id":      APP_ID,
        "x-app-key":     APP_KEY,
    }
    payload = {"query": query}

    async with httpx.AsyncClient() as client:
        resp = await client.post(NUTRIENTS_URL, headers=headers, json=payload)

    if resp.status_code != 200:
        # forward Nutritionix’s error
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    
    data=resp.json()
    foods = data.get("foods", [])  
    summary = []
    for f in foods:
        summary.append({
            "food_name":             f["food_name"],
            "nf_calories":           f["nf_calories"],
            "serving_qty":           f["serving_qty"],
            "serving_unit":          f["serving_unit"],
            "serving_weight_grams":  f["serving_weight_grams"],
            "nf_protein":            f["nf_protein"],
            "nf_total_fat":          f["nf_total_fat"],
            "nf_sugars":             f["nf_sugars"],
            "nf_saturated_fat":      f["nf_saturated_fat"],
            "nf_cholesterol":        f["nf_cholesterol"],
            "nf_dietary_fiber":      f["nf_dietary_fiber"],
            "nf_sodium":             f["nf_sodium"],
        })
        
    return summary