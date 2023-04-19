from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from forecasters.simple import ExpoMovingAverageForecaster
from models import ItemHistory

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/forecast")
def forecast_prices(item_history: ItemHistory) -> ItemHistory:
    forecaster = ExpoMovingAverageForecaster()
    forecast = forecaster.predict(item_history, 30)
    return forecast


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
