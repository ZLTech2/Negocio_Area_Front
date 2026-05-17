import { StyleSheet, Text, ImageBackground, Image, View, Pressable } from 'react-native';
import ImageBackgroundDesf from "../../components/ImageBackgroundDesf";

const ButtomPurple = ({title, onPress}) => {
  return(
    <Pressable style={styles.buttomRegister} onPress={onPress}>
     <Text style={styles.textButton}>{title} </Text>
    </Pressable>
  )
}

export default function TipoCadastro ({navigation}){
  return(
    <ImageBackgroundDesf>
    
     <View style={styles.container}>
      <Image source={require("../../assets/images/logord.png")} style={styles.logo}></Image>

      <View style={styles.card}>
        <Text style={styles.principalTitle}> Selecione o tipo de Cadastro </Text>

        <ButtomPurple title='Cliente' onPress={() => navigation.navigate("CadastroCliente")}/>
        <Text style={styles.text}> Se cadastre como pessoa física</Text>

        <ButtomPurple title='Empresa' onPress={() => navigation.navigate("CadastroEmpresa")}/>
        <Text style={styles.text}> Se cadastre como empresa</Text>

        <Text style={styles.descriptioon}>  O tipo de cadastro define como você deve realizar o login/cadastro. 
            Empresas possuem perfis para divulgação, clientes para consumo. </Text>

      </View>
     </View>

    </ImageBackgroundDesf>
  )
  
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card:{
    
    backgroundColor: 'white',
    width: '100%',
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
    // Sombra para dar profundidade
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  principalTitle:{
    margin: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  logo:{
    width: 120,
    height: 120,
    marginBottom: 35,
    resizeMode: 'contain'
  },
  buttomRegister:{
    marginTop: 20,
    padding: 10,
    backgroundColor: '#983CFF',
    width: '100%',
    borderRadius: 5
  },
  textButton:{
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  text:{
    color: '#444', 
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  descriptioon:{
    fontSize: 11,
    margin: 10,
    color: '#535353',
    textAlign: 'center'
  }
})