import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import getItemPriceHistory from "../item-prices/getItemPrices";
import ForecastButton from "./ForecastButton";
import forecastItemPrices from "../item-prices/forecastItemPrices";

Chart.register(...registerables);

const plotOptions = {
  response: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
      },
    },
  },
};

export default function ItemHistoryPlot(props) {
  const [itemHistory, setItemHistory] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [dataFreq, setDataFreq] = useState("6h");

  const forecastPrices = async () => {
    const forecast = await forecastItemPrices(itemHistory, dataFreq);
    setForecast(forecast);
  };

  useEffect(() => {
    if (props.selectedItem) {
      getItemPriceHistory(props.selectedItem["id"], dataFreq).then((data) => {
        setItemHistory(data);
      });
      setForecast(null);
    }
  }, [props.selectedItem, dataFreq]);

  if (itemHistory) {
    return (
      <>
        <FormControl>
          <FormLabel>Frequency</FormLabel>
          <Select
            maxW="200"
            defaultValue={dataFreq}
            onChange={(e) => setDataFreq(e.target.value)}
          >
            <option value="5m">5 minutes</option>
            <option value="1h">1 hour</option>
            <option value="6h">6 hours</option>
          </Select>
        </FormControl>
        <Line
          options={plotOptions}
          data={formatItemsForChart(itemHistory, forecast)}
        />
        <ForecastButton handleClick={forecastPrices}></ForecastButton>
      </>
    );
  }
}

const formatItemsForChart = (items, forecastItems) => {
  if (!items) {
    return;
  }

  const red = "#FF6384";
  const blue = "#36A2EB";

  const highPrices = [];
  const lowPrices = [];
  const forecastHighPrices = [];
  const forecastLowPrices = [];

  for (const item of items["data"]) {
    highPrices.push({
      x: new Date(item["timestamp"] * 1e3),
      y: item["avgHighPrice"],
    });

    lowPrices.push({
      x: new Date(item["timestamp"] * 1e3),
      y: item["avgLowPrice"],
    });
  }

  const plotItems = {
    datasets: [
      {
        label: "High price",
        data: highPrices,
        borderWidth: 1.5,
        pointRadius: 1,
        borderColor: red,
      },
      {
        label: "Low price",
        data: lowPrices,
        borderWidth: 1.5,
        pointRadius: 1,
        borderColor: blue,
      },
    ],
  };

  if (forecastItems) {
    for (const item of forecastItems["data"]) {
      forecastHighPrices.push({
        x: new Date(item["timestamp"] * 1e3),
        y: item["avgHighPrice"],
      });

      forecastLowPrices.push({
        x: new Date(item["timestamp"] * 1e3),
        y: item["avgLowPrice"],
      });
    }

    plotItems.datasets.push({
      label: "Forecast high price",
      data: forecastHighPrices,
      borderWidth: 1.5,
      pointRadius: 1,
      borderColor: red,
      borderDash: [5, 5],
      fill: false,
    });

    plotItems.datasets.push({
      label: "Forecast low price",
      data: forecastLowPrices,
      borderWidth: 1.5,
      pointRadius: 1,
      borderColor: blue,
      borderDash: [5, 5],
      fill: false,
    });
  }
  return plotItems;
};
