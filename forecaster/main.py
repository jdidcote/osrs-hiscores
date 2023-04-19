from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from forecaster import SimpleForecaster
from models import ItemHistory, ItemHistoryTimestep

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
    print(item_history)
    forecaster = SimpleForecaster()
    forecast = forecaster.predict(item_history, 100)
    return forecast


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
