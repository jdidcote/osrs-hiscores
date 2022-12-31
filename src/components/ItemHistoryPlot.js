import { FormControl, FormLabel, Select } from "@chakra-ui/react";
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
  const [dataFreq, setDataFreq] = useState("6h");

  useEffect(() => {
    if (props.selectedItem) {
      getItemPriceHistory(props.selectedItem["id"], dataFreq).then((data) => {
        setItemHistory(data);
      });
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
        <Line options={plotOptions} data={formatItemsForChart(itemHistory)} />
      </>
    );
  }
}

const formatItemsForChart = (items) => {
  if (!items) {
    return;
  }

  const highPrices = [];
  const lowPrices = [];

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

  return {
    datasets: [
      {
        label: "High price",
        data: highPrices,
        borderWidth: 1.5,
        pointRadius: 1,
      },
      {
        label: "Low price",
        data: lowPrices,
        borderWidth: 1.5,
        pointRadius: 1,
      },
    ],
  };
};
