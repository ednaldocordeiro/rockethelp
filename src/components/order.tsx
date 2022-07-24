import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';

import { ClockAfternoon, Hourglass, CircleWavyCheck } from 'phosphor-react-native'

export type OrderProps = {
  id: string;
  patrimony: string;
  when: string;
  status: 'open' | 'closed';
}

type Props = IPressableProps & {
  orders: OrderProps;
}

export function Order({ orders, ...rest }: Props) {

  const { colors } = useTheme();
  const statusColor = orders.status === 'open' ? colors.secondary[700] : colors.green[300];


  return (
    <Pressable
      {...rest}
    >
      <HStack
        bg='gray.600'
        mb={4}
        alignItems={'center'}
        justifyContent={'space-between'}
        rounded={"sm"}
        overflow={'hidden'}
      >
        <Box h="full" w={2} bg={statusColor}/>

        <VStack flex={1} my={5} ml={5}>
          <Text color="white" fontSize={'md'}>
            Patrimonio {orders.patrimony}
          </Text>
          <HStack alignItems={'center'}>
            <ClockAfternoon size={15} color={colors.gray[300]}/>
            <Text color="gray.300" fontSize={'sm'}>
              {orders.when}
            </Text>
          </HStack>

        </VStack>

        <Circle bg={'gray.500'} h={12} w={12} mr={5}>
          {
            orders.status === 'closed' ? 
            <CircleWavyCheck size={24} color={statusColor}/> :
            <Hourglass size={24} color={statusColor}/>
          }
        </Circle>

      </HStack>
    </Pressable>
  );
}