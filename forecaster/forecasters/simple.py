import pandas as pd

from forecasters.base import BaseForecaster
from models import ItemHistory


class SimpleForecaster(BaseForecaster):
    def _predict(
            self,
            df: pd.DataFrame,
            item_history: ItemHistory,
            n_timesteps: int,
            future_timesteps: list[float]
    ) -> pd.DataFrame:
        df = item_history.to_df()
        # Use up to the last 10 timesteps
        preds = pd.concat([
            pd.DataFrame(
                df
                .sort_values("timestamp")
                .iloc[-10:]
                .drop("timestamp", axis=1)
                .mean()
            ).T
            for _ in range(n_timesteps)
        ]).reset_index(drop=True)
        preds["timestamp"] = future_timesteps
        return preds


class MovingAverageForecaster(BaseForecaster):
    def _predict(
            self,
            df: pd.DataFrame,
            item_history: ItemHistory,
            n_timesteps: int,
            future_timesteps: list[float]
    ) -> pd.DataFrame:
        # TODO: Make this configurable
        rolling_window = 7
        pred_cols = ["avg_high_price", "avg_low_price", "high_price_volume", "low_price_volume"]
        preds = df[pred_cols].rolling(window=rolling_window).mean()

        for i in range(n_timesteps):
            last_n_observations = preds[-rolling_window:]
            next_prediction = pd.DataFrame(
                last_n_observations.mean(),
            ).T
            next_prediction.index = [last_n_observations.index[-1] + 1]
            preds = pd.concat([preds, next_prediction])

        preds = preds.iloc[-n_timesteps:]
        preds["timestamp"] = future_timesteps
        return preds
