import * as React from "react";

import { ChakraProvider, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ItemHistoryPlot from "./components/ItemHistoryPlot";
import ItemSearch from "./components/ItemSearch";
import getItemMapping from "./item-prices/itemMapping";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  const [itemMapping, setItemMapping] = useState("");
  useEffect(() => {
    getItemMapping().then((data) => setItemMapping(data));
  }, []);

  return (
    <ChakraProvider>
      <Container maxW="lg" marginTop="14">
        <ItemSearch
          itemMapping={itemMapping}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        ></ItemSearch>
        <ItemHistoryPlot selectedItem={selectedItem}></ItemHistoryPlot>
      </Container>
    </ChakraProvider>
  );
}

export default App;
