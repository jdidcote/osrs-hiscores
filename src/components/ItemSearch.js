import { Container, FormControl } from "@chakra-ui/react";
import React, { useState } from "react";
import Select, { createFilter } from "react-select";
import { FixedSizeList as List } from "react-window";

const CustomMenuList = (props) => {
  const itemHeight = 35;
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * itemHeight;

  return (
    <div>
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={itemHeight}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    </div>
  );
};

export default function ItemSearch(props) {
  const getLabels = () => {
    let formattedLabels = [];
    for (const [id, name] of Object.entries(props.itemMapping)) {
      formattedLabels.push({
        value: id,
        label: name,
      });
    }
    return formattedLabels;
  };
  const labels = getLabels();

  return (
    <Container mb={16}>
      <Select
        isMulti={false}
        options={labels}
        placeholder="Search for an item..."
        closeMenuOnSelect={true}
        onChange={(e) => {
          props.setSelectedItem({ id: e["value"], name: e["label"] });
        }}
        components={{
          MenuList: CustomMenuList,
        }}
      />
    </Container>
  );
}
