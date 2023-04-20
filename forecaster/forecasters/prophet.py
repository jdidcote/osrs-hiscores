import pandas as pd
from prophet import Prophet

from forecasters.base import BaseForecaster
from models import ItemHistory


def _to_prophet_df(df: pd.DataFrame, col: str) -> pd.DataFrame:
    df = df.copy()
    df.rename({
        "timestamp": "ds",
        col: "y"
    }, axis=1, inplace=True)
    df["ds"] = pd.to_datetime(df["ds"] * 1e9)
    df = df[['ds', 'y']]
    return df


class ProphetForecaster(BaseForecaster):

    def _predict(
            self,
            df: pd.DataFrame,
            item_history: ItemHistory,
            n_timesteps: int,
            future_timesteps: list[float]
    ) -> pd.DataFrame:
        preds = pd.DataFrame({"timestamp": future_timesteps})
        for col in ["avg_high_price", "avg_low_price"]:
            ts = _to_prophet_df(df, col)
            model = Prophet()
            model.fit(ts)
            future = model.make_future_dataframe(periods=n_timesteps, freq=item_history.freq, include_history=False)
            forecast = model.predict(future)
            preds[col] = forecast["yhat"].values
        preds[["avg_low_volume", "avg_high_volume"]] = 1, 1
        return preds
