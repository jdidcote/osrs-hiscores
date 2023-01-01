import { Center, ChakraProvider, Container, Heading } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import ItemHistoryPlot from "./components/ItemHistoryPlot";
import ItemSearch from "./components/ItemSearch";
import getItemMapping from "./item-prices/itemMapping";

import ThemeSlider from "./components/themeSlider";
import theme from "./theme";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  const [itemMapping, setItemMapping] = useState("");
  useEffect(() => {
    getItemMapping().then((data) => setItemMapping(data));
  }, []);

  return (
    <div>
      <ChakraProvider theme={theme}>
        <ThemeSlider></ThemeSlider>
        <Container maxW="1000px" minW="500px" paddingTop="5" paddingBottom="5">
          <Center>
            <Heading marginBottom={2} alignContent="center">
              OSRS Grand Exchange Prices
            </Heading>
          </Center>
          <ItemSearch
            className="runescape-font"
            itemMapping={itemMapping}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          ></ItemSearch>
          <ItemHistoryPlot selectedItem={selectedItem}></ItemHistoryPlot>
        </Container>
      </ChakraProvider>
    </div>
  );
}

export default App;
