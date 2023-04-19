import pandas as pd

from forecasters.base import BaseForecaster
from models import ItemHistory


class SimpleForecaster(BaseForecaster):
    def _predict(
            self,
            item_history: ItemHistory,
            n_timesteps: int
    ) -> pd.DataFrame:
        df = item_history.to_df()
        future_timesteps = self._generate_future_timesteps(
            start=df["timestamp"].max(),
            n_timesteps=n_timesteps,
            freq=item_history.freq
        )
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
