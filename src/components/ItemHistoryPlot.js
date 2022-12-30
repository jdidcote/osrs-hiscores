import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import getItemPriceHistory from "../item-prices/getItemPrices";
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

  useEffect(() => {
    if (props.selectedItem) {
      getItemPriceHistory(props.selectedItem["id"]).then((data) => {
        setItemHistory(data);
      });
    }
  }, [props.selectedItem]);

  if (itemHistory) {
    return (
      <Line options={plotOptions} data={formatItemsForChart(itemHistory)} />
    );
  }
}

const formatItemsForChart = (items) => {
  if (!items) {
    return;
  }

  // const labels = [];
  // const highPrices = [];

  const highPrices = [];
  const lowPrices = [];

  for (const item of items["data"]) {
    // labels.push(new Date(item["timestamp"]));
    // highPrices.push(item["avgHighPrice"]);

    highPrices.push({
      x: new Date(item["timestamp"] * 1e3),
      y: item["avgHighPrice"],
    });

    lowPrices.push({
      x: new Date(item["timestamp"] * 1e3),
      y: item["avgLowPrice"],
    });
  }

  return {
    datasets: [
      {
        label: "High price",
        data: highPrices,
        borderWidth: 1.5,
      },
      {
        label: "Low price",
        data: lowPrices,
        borderWidth: 1.5,
      },
    ],
  };
};
