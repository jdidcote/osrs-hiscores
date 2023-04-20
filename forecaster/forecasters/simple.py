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


class ExpoMovingAverageForecaster(BaseForecaster):

    @staticmethod
    def _exponential_moving_average(values: list[float], n_timesteps: int) -> list[float]:
        alpha = 0.2
        smoothed_values = [values[0]]

        for t in range(1, len(values)):
            smoothed_value = alpha * values[t] + (1 - alpha) * smoothed_values[t - 1]
            smoothed_values.append(smoothed_value)

        future_values = [smoothed_values[-1] for _ in range(n_timesteps)]
        return future_values

    def _predict(
            self,
            df: pd.DataFrame,
            item_history: ItemHistory,
            n_timesteps: int,
            future_timesteps: list[float]
    ) -> pd.DataFrame:
        pred_cols = ["avg_high_price", "avg_low_price", "high_price_volume", "low_price_volume"]

        preds = pd.DataFrame({"timestamp": future_timesteps})

        for pred_col in pred_cols:
            preds[pred_col] = self._exponential_moving_average(df[pred_col].values, n_timesteps)
        return preds
