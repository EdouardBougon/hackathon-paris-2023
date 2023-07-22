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
    <Flex marginTop={10} justify={"center"} align={"center"} gap={10}>
      <Text>0</Text>
      <Box w="100%">
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
      <Text>Max to Borrow</Text>
    </Flex>
  );
}
