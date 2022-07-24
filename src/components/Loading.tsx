import { Center, Spinner } from "native-base";

type Props = {
  color?: any;
}

export function Loading({color}: Props) {
  return (
    <Center flex={1} bg='gray.700'>
      <Spinner color={color ? color : 'gray.200'} size="lg"/>
    </Center>
  );
}