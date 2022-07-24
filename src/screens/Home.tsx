import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';
import Logo from '../assets/logo_secondary.svg';
import { ChatTeardropText, SignOut } from 'phosphor-react-native' 
import { Filter } from '../components/Filter';
import { useState } from 'react'
import { Order, OrderProps } from '../components/order';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import {dateFormat} from '../utils/firestoreDateFormats'
import { Loading } from '../components/Loading';

export default function Home() {

  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [orders, setOrders] = useState<OrderProps[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const navigation = useNavigation();
  const { colors } = useTheme();

  function handleNewOrder() {
    navigation.navigate('new');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handelLogOut() {
    auth()
    .signOut()
    .catch(e => {
      console.log(e);
      Alert.alert('Erro', 'Não foi possível sair.')
    });
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
    .collection('orders')
    .where('status', '==', statusSelected)
    .onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => {
        const { patrimony, description, status, created_at } = doc.data();

        return {
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at)
        }
      })

      setOrders(data);
      setIsLoading(false);
    }) // cria um filtro para buscar as orders

    return subscriber;

  }, [statusSelected])

  return (
    <VStack flex={1} pb={6} bg='gray.700'>
      <HStack
        w={'full'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'gray.600'}
        pt={16}
        pb={5}
        px={6}
      >
        <Logo/>

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]}/>}
          onPress={handelLogOut}
        />

      </HStack>

      <VStack flex={1} px={6}>
        <HStack w='full' mt={8} mb={4} justifyContent={'space-between'} alignItems={'center'}>
          <Heading color={'gray.100'}>
            Meus chamados
          </Heading>

          <Text color={'gray.200'}>
            {orders.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter 
            type={'open'} 
            title={'em andamento'}
            onPress={() => setStatusSelected('open')}  
            isActive={statusSelected === 'open'}
          />
          <Filter 
            type={'closed'} 
            title={'finalizados'}
            onPress={() => setStatusSelected('closed')}  
            isActive={statusSelected === 'closed'}
          />
        </HStack>
        {
          isLoading ? 
          <Loading 
            color={ statusSelected === 'open' ? colors.secondary[700] : colors.green[500] }
          /> :
          <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Order 
              orders={item}
              onPress={() => handleOpenDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText  color={colors.gray[300]} size={40}/>
              <Text color={"gray.300"} fontSize='xl' mt={6} textAlign='center'>
                Você ainda não possuiu {'\n'} solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
              </Text>
            </Center>
          )}
        />
        }
      <Button 
        title='Nova solicitação'
        onPress={handleNewOrder}
      />
      </VStack>
    </VStack>
  );
}