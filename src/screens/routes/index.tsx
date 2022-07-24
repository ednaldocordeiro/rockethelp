import { NavigationContainer } from '@react-navigation/native'
import SignIn from '../SigIn';
import { AppRoutes } from './app.routs'

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useState, useEffect } from 'react';
import { Loading } from '../../components/Loading';

export function Routes() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  useEffect(() => {
    const subscriber = auth()
    .onAuthStateChanged(user => {
      setUser(user)
      setLoading(false)
    })
    return subscriber
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <SignIn /> }
    </NavigationContainer>
  );
}