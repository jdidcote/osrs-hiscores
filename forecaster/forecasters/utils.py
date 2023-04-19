import pandas as pd


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    df.fillna(method="ffill", inplace=True)
    return df
