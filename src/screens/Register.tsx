import { useState } from 'react';
import { VStack } from 'native-base';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Register() {

  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handeNewOrderRegister(){
    if (!patrimony || !description) {
      return Alert.alert('Regstrar', 'Preencha todos os campos.');
    }

    setIsLoading(true);

    firestore().collection('orders')
    .add({
      patrimony,
      description,
      status: 'open',
      created_at: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação registrada com sucesso.');
      navigation.goBack();
    })
    .catch((e) => {
      console.log(e);
      Alert.alert('Erro', 'Não foi possível registrar a solicitação.');
    })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title='Resgistrar'/>

      <Input 
        placeholder='Número do patrimônio'
        mt={4} 
        onChangeText={setPatrimony}
      />

      <Input
        placeholder='Descrição do problema'
        flex={1}
        mt={5}
        multiline
        textAlignVertical='top'
        onChangeText={setDescription}
      />      

      <Button 
        title='Registrar'
        mt={5}
        onPress={handeNewOrderRegister}
        isLoading={isLoading}
      />
    </VStack>
  );
}