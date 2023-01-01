import { useColorMode, Button } from "@chakra-ui/react";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
function ThemeSlider() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel mb="0">
        {colorMode === "light" ? "Light" : "Dark"} theme
      </FormLabel>
      <Switch onChange={toggleColorMode} />
    </FormControl>
  );
}

<FormControl display="flex" alignItems="center">
  <FormLabel htmlFor="email-alerts" mb="0">
    Enable email alerts?
  </FormLabel>
  <Switch id="email-alerts" />
</FormControl>;

export default ThemeSlider;
