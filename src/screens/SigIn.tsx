import {VStack, Heading, Icon, useTheme} from 'native-base'
import Logo from '../assets/logo_primary.svg'
import Input from '../components/Input'
import { Envelope, Key } from 'phosphor-react-native'
import Button from '../components/Button'
import { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { Alert } from 'react-native'
import { Loading } from '../components/Loading'


export default function SignIn() {

  const { colors } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    if(!email || !password) {
      return Alert.alert('Error', 'Please fill all fields')
    }

    setLoading(true)

    auth()
    .signInWithEmailAndPassword(email, password)
    .catch((e) => {
      setLoading(false)
      if (e.code === 'auth/invalid-email') {
        return Alert.alert('Entrar', 'Email inválido.')
      }

      if (e.code === 'auth/wrong-password') {
        return Alert.alert('Entrar', 'Email ou senha inválidos.')
      }

      if (e.code === 'auth/user-not-found') {
        return Alert.alert('Entrar', 'Usuário não encontrado.')
      }

      return Alert.alert('Entrar', 'Não foi possível acessar a conta.')

    })

  }

  return (
    <VStack flex={1} alignItems={'center'} bg={'gray.600'} px={8} pt={32} >
      {alert}
      <Logo/>
      <Heading color={'white'} fontSize='xl' mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input 
        placeholder='E-mail'
        mb={4}
        InputLeftElement={<Icon as={<Envelope color={email ? colors.green[700] : colors.gray[300]}/>} ml={4} />}
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        autoComplete='email'
        autoCorrect={false}
        autoFocus={true} 
      />
      <Input 
        placeholder='Senha'
        mb={8}
        InputLeftElement={<Icon as={<Key color={password ? colors.green[700] : colors.gray[300]}/>} ml={4} />}  
        secureTextEntry
        onChangeText={setPassword}
        onSubmitEditing={handleLogin}
      />

      <Button 
        title='Entrar'
        width='full'
        onPress={handleLogin}
        isLoading={loading}
      />
    </VStack>
  )
}