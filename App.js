import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TipoCadastro from './screens/common/TipoCadastro';
import CadastroEmpresa from './screens/empresa/CadastroEmpresa';
import CadastroCliente from './screens/cliente/CadastroCliente';
import TelaAbertura from './screens/common/TelaAbertura';
import TelaLogin from './screens/common/TelaLogin';
import TelaPerfilEmpresa from './screens/empresa/TelaPerfilEmpresa';
import TelaLocalizacao from './screens/common/TelaLocalizacao';
import TelaVisitante from './screens/common/TelaVisitante';
import TelaBuscar from './screens/common/TelaBuscar';
import FeedEmpresa from './screens/empresa/FeedEmpresa';
import FeedCliente from './screens/cliente/FeedCliente';
import Toast from 'react-native-toast-message';
import { UserProvider } from './components/UserContext';
import DetalhesPost from './components/DetalhesPost';
import TelaLocalizacaoCli from './components/Footer/TelaLocalizacaoCli';
import TelaBuscarCliente from './components/Footer/TelaBuscarCliente';
import TelaPerfilCliente from './screens/cliente/TelaPerfilCliente';
import TelaProdutosEmpresa from './screens/cliente/TelaProdutosEmpresa';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TelaAbertura">
          <Stack.Screen
            name="TelaAbertura"
            component={TelaAbertura}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TelaLogin"
            component={TelaLogin}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TipoCadastro"
            component={TipoCadastro}
            options={{
              title: '',
              headerStyle: styles.header,
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
            }}
            style={styles.header}
          />

          <Stack.Screen
            name="CadastroEmpresa"
            component={CadastroEmpresa}
            options={{
              title: '',
              headerStyle: styles.header,
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
            }}
            style={styles.header}
          />

          <Stack.Screen
            name="TelaProdutosEmpresa"
            component={TelaProdutosEmpresa}
            options={{
              title: '',
              headerStyle: styles.header,
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
              headerShown: false
            }}
            style={styles.header}
          />

          <Stack.Screen
            name="CadastroCliente"
            component={CadastroCliente}
            options={{
              title: '',
              headerStyle: styles.header,
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
            }}
            style={styles.header}
          />

          <Stack.Screen
            name="TelaPerfilEmpresa"
            component={TelaPerfilEmpresa}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TelaLocalizacao"
            component={TelaLocalizacao}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TelaLocalizacaoCli"
            component={TelaLocalizacaoCli}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FeedEmpresa"
            component={FeedEmpresa}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FeedCliente"
            component={FeedCliente}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetalhesPost"
            component={DetalhesPost}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TelaBuscar"
            component={TelaBuscar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TelaBuscarCliente"
            component={TelaBuscarCliente}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TelaPerfilCliente"
            component={TelaPerfilCliente}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TelaVisitante"
            component={TelaVisitante}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#983cff',
    elevation: 0,
    shadowOpacity: 0,
  },
});
