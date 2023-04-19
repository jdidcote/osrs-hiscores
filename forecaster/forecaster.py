from abc import ABC, abstractmethod

import pandas as pd

from models import ItemHistoryTimestep, ItemHistory


def _to_item_history(df: pd.DataFrame, item_id: int, freq: str) -> ItemHistory:
    return ItemHistory(
        item_id=item_id,
        freq=freq,
        data=[
            ItemHistoryTimestep(**row)
            for _, row in df.iterrows()
        ]
    )


class BaseForecaster(ABC):

    @staticmethod
    def _generate_future_timesteps(start: float, n_timesteps: int, freq: str) -> list[float]:
        freq_timedelta_map = {
            '5m': pd.Timedelta(minutes=5),
            '1h': pd.Timedelta(hours=1),
            '6h': pd.Timedelta(hours=6)
        }
        return [
            start + (i + 1) * freq_timedelta_map[freq].total_seconds()
            for i in range(n_timesteps)
        ]

    @abstractmethod
    def _predict(self, item_history: ItemHistory, n_timesteps: int) -> pd.DataFrame:
        pass

    def predict(
            self,
            item_history: ItemHistory,
            n_timesteps: int
    ) -> ItemHistory:
        preds = self._predict(item_history, n_timesteps)
        return _to_item_history(preds, item_history.item_id, item_history.freq)


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
