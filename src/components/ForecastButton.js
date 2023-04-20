import { Button} from "@chakra-ui/react";
import React from "react";

export default function ForecastButton(props) {
  return (
    <Button colorScheme="teal" size="md" onClick={props.handleClick}>
      Forecast
    </Button>
  );
}
