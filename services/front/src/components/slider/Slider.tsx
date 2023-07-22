import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Text,
  Box,
  Center,
} from "@chakra-ui/react";

export function SliderAmount() {
  return (
    <Flex marginTop={10} justify="space-between" align="center" gap={10}>
      <Box w="10%">
        <Text>0</Text>
      </Box>
      <Box w="80%">
        <Slider aria-label="slider-ex-1" defaultValue={30} marginTop="8">
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Center>
          <Text>100</Text>
        </Center>
      </Box>
      <Box w="10%">
        <Text>Max to Borrow</Text>
      </Box>
    </Flex>
  );
}
