import { CardBody, Text, Card, Flex, Container } from "@chakra-ui/react";
import { SliderAmount } from "../slider/Slider";

export function CardPosition() {
  return (
    <Container>
      <Flex marginTop={30} gap={10} justify={"center"}>
        <Card>
          <CardBody>
            <Text>position</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text>position</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text>position</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text>position</Text>
          </CardBody>
        </Card>
      </Flex>
      <SliderAmount />
    </Container>
  );
}
