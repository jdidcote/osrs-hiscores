const forecastItemPrices = async (itemHistory, freq) => {
  itemHistory.freq = freq;
  console.log(itemHistory);

  const response = await fetch("http://0.0.0.0:8000/forecast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemHistory),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};

export default forecastItemPrices;
