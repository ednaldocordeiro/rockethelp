import { NativeBaseProvider } from 'native-base'
import { StatusBar } from 'expo-status-bar';
import {THEME} from './src/styles/theme'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Loading } from './src/components/Loading';
import { Routes
 } from './src/screens/routes';
export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME} >
      <StatusBar style="light" />
      {fontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  );1
}
