import { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, Text, VStack, useTheme, ScrollView, Box } from 'native-base';
import Header from '../components/Header';
import { OrderProps } from '../components/order';
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormats';
import {Loading} from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native'
import colors from 'native-base/lib/typescript/theme/base/colors';
import {CardDetails} from '../components/CardDetails'; 
import Input from '../components/Input';
import Button from '../components/Button';
import { Alert } from 'react-native';

type RoutesParamns = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {

  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');

  const route = useRoute()
  const { orderId } = route.params as RoutesParamns;

  const {colors} = useTheme();

  const navigation = useNavigation();

  function handleOrderClose(){
    if(!solution){
      return Alert.alert('Atenção', 'Por favor, insira uma solução para o problema.');
    }
    setIsLoading(true);
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação solucionada com sucesso.');
      setIsLoading(false);
      navigation.navigate('home');
    })
    .catch(e => {
      console.log(e);
      Alert.alert('Solicitação', 'Não foi possível solucionar a solicitação.');
    })
  }

  function handleOrderOpen(){
    setIsLoading(true);
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'open',
      closed_at: firestore.FieldValue.delete(),
      solution: firestore.FieldValue.delete()
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação aberta com sucesso.');
      setIsLoading(false);
      navigation.navigate('home');
    })
    .catch(e => {
      console.log(e);
      Alert.alert('Solicitação', 'Não foi possível abrir a solicitação.');
    })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        });

        setIsLoading(false);
      });
  }, []);


  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg='gray.700'>
      <Box px={6} py={3} bg='gray.600'>
        <Header title='Solicitação'/>
      </Box>
      <HStack 
        bg='gray.500'
        justifyContent='center'
        p={4}
      >
        {
          order.status === 'closed' 
          ? <CircleWavyCheck size={22} color={colors.green[500]}/>
          : <Hourglass size={22} color={colors.secondary[700]}/>
        }
        <Text
          fontSize='sm'
          color={order.status === 'closed' ? colors.green[500] : colors.secondary[700]}
          ml={2}
          textTransform='uppercase'
        >
          {order.status === 'closed' ? 'Finalizada' : 'Em andamento'} 
        </Text>
      </HStack>
      <ScrollView
        mx={5}
        showsVerticalScrollIndicator={false}
      >
        <CardDetails
          title='Equipamento'
          description={`Patrimônio: ${order.patrimony}`}
          icon={DesktopTower}
          footer={`Solicitado em: ${order.when}`}
        />
        <CardDetails
          title='Descrição do problema'
          description={order.description}
          icon={Clipboard}
        />
        <CardDetails
          title='Solução do problema'
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em: ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input 
              placeholder='Descrição da solução'
              onChangeText={setSolution}
              h={24}
              textAlignVertical='top'
              multiline
            />
          }
        </CardDetails>
      </ScrollView>
      {
        order.status === 'open' ? 
        <Button 
          title='Encerrar solicitação'
          m={5}
          onPress={handleOrderClose}
        />
        :
        <Button 
          title='Reabir solicitação'
          m={5}
          onPress={handleOrderOpen}
          bg='secondary.700'
        />
      }
    </VStack>
  );
}