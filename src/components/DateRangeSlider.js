import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import React from "react";

export default function DateRangeSlider(props) {
  return (
    <div>
      <Slider
        aria-label="slider-ex-2"
        colorScheme="blue"
        defaultValue={0}
        onChange={(e) => props.handleSliderChange(e)}
        max={props.nTimesteps}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </div>
  );
}
