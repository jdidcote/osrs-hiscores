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
