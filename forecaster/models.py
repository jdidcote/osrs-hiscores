import pandas as pd
from pydantic import BaseModel, validator


def to_camel_case(snake_str: str) -> str:
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class ItemHistoryTimestep(BaseModel):
    timestamp: int
    avg_high_price: float
    avg_low_price: float
    high_price_volume: float
    low_price_volume: float

    class Config:
        alias_generator = to_camel_case
        allow_population_by_field_name = True


class ItemHistory(BaseModel):
    item_id: int
    freq: str
    data: list[ItemHistoryTimestep]

    class Config:
        alias_generator = to_camel_case
        allow_population_by_field_name = True

    @validator('freq')
    def freq_must_be_valid(cls, v):
        if v not in ['5m', '1h', '6h']:
            raise ValueError('freq must be one of daily, weekly, monthly')
        return v

    def to_df(self) -> pd.DataFrame:
        return pd.DataFrame(x.dict() for x in self.data)
