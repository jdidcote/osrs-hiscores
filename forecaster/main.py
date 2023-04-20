from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from forecasters.prophet import ProphetForecaster
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
    forecaster = ProphetForecaster()
    forecast = forecaster.predict(item_history, 50)
    return forecast


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
