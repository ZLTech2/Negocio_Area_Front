import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Timeline() {
  const [screen, setScreen] = useState('home');
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [search, setSearch] = useState('');
  const homeScrollRef = useRef(null);
  const route = useRoute();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.abrirBusca) {
      setScreen('search');
      setSearch('');
    }
    if (route.params?.irParaHome) {
      setScreen('home');
      setSelectedStore(null);
      setSelectedPost(null);
      setSearch('');
    }
  }, [route.params]);

  // ----- LOJAS / POSTS -----
  const stores = [
    {
      id: '1',
      name: 'MK IMPORTS',
      image: require('../assets/images/mkimports.png'),
      posts: [
        {
          id: 'mk1',
          title: 'KIT NIKE',
          desc: 'Jaqueta + calça Nike — combo confortável e estiloso.',
          price: 'R$ 89,99',
          image: require('../assets/images/kitnike.jpg'),
        },
        {
          id: 'mk3',
          title: 'KIT LACOSTE',
          desc: 'Boné + camiseta + calça Lacoste — combo premium.',
          price: 'R$ 99,99',
          image: require('../assets/images/kitlacoste.jpg'),
        },
        {
          id: 'mk5',
          title: 'TÊNIS NIKE TN',
          desc: 'Nike TN branco — visual moderno e confortável.',
          price: 'R$ 345,99',
          image: require('../assets/images/tenisnike.jpg'),
        },
      ],
    },
    {
      id: '2',
      name: 'GAMING MONSTER',
      image: require('../assets/images/gm.png'),
      posts: [
        {
          id: 'gm2',
          title: 'PS5 SPIDER-MAN',
          desc: 'PlayStation 5 edição Spider-Man, seminovo e impecável.',
          price: 'R$ 3.100,00',
          image: require('../assets/images/ps5.png'),
        },
        {
          id: 'gm4',
          title: 'XBOX 360 DESBLOQUEADO',
          desc: 'Xbox 360 desbloqueado com jogos instalados.',
          price: 'R$ 600,00',
          image: require('../assets/images/x360.png'),
        },
      ],
    },
  ];

  const allPosts = stores.flatMap((s) =>
    s.posts.map((p) => ({
      ...p,
      storeName: s.name,
      storeImage: s.image,
    }))
  );

  // ----- HOME -----
  function HomeScreen() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={homeScrollRef}
          contentContainerStyle={{
            paddingBottom: 120,
            flexGrow: 1,
          }}
          style={styles.screenContainer}>
          <TopBar />
          <View style={{ height: 12 }} />
          {allPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.post}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedPost(post);
                setScreen('post');
              }}>
              <View style={styles.postHeader}>
                <Image source={post.storeImage} style={styles.postProfilePic} />
                <Text style={styles.postStoreName}>{post.storeName}</Text>
              </View>
              <Image source={post.image} style={styles.postImage} />
              <Text style={styles.postName}>{post.title}</Text>
              <Text style={styles.postDesc}>{post.desc}</Text>
              <Text style={styles.postPrice}>{post.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ----- POST INDIVIDUAL -----
  function PostScreen() {
    if (!selectedPost) return null;
    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          flexGrow: 1,
        }}
        style={styles.screenContainer}>
        <TopBar />
        <View style={{ height: 12 }} />
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image
              source={selectedPost.storeImage}
              style={styles.postProfilePic}
            />
            <Text style={styles.postStoreName}>{selectedPost.storeName}</Text>
          </View>
          <Image source={selectedPost.image} style={styles.postImage} />
          <Text style={styles.postName}>{selectedPost.title}</Text>
          <Text style={styles.postDesc}>{selectedPost.desc}</Text>
          <Text style={styles.postPrice}>{selectedPost.price}</Text>
        </View>
      </ScrollView>
    );
  }

  // ----- LOJA -----
  function StoreScreen() {
    if (!selectedStore) return null;
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 120,
        }}
        style={styles.screenContainer}>
        <TopBar />
        <View style={{ height: 12 }} />
        <Text style={styles.title}>{selectedStore.name}</Text>
        {selectedStore.posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.post}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedPost({
                ...post,
                storeName: selectedStore.name,
                storeImage: selectedStore.image,
              });
              setScreen('post');
            }}>
            <Image source={post.image} style={styles.postImage} />
            <Text style={styles.postName}>{post.title}</Text>
            <Text style={styles.postDesc}>{post.desc}</Text>
            <Text style={styles.postPrice}>{post.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            {screen === 'home' && <HomeScreen />}
            {screen === 'search' && (
              <SearchScreen
                stores={stores}
                setSelectedStore={setSelectedStore}
                setScreen={setScreen}
                search={search}
                setSearch={setSearch}
              />
            )}
            {screen === 'store' && <StoreScreen />}
            {screen === 'post' && <PostScreen />}
          </View>
          <Footer visitante={false} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ----- SEARCH SCREEN -----
function SearchScreen({
  stores,
  setSelectedStore,
  setScreen,
  search,
  setSearch,
}) {
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#e5e5e5' }}
      contentContainerStyle={{
        paddingBottom: 120,
        flexGrow: 1,
      }}>
      <TopBar />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar loja..."
        value={search}
        onChangeText={setSearch}
      />
      {filteredStores.map((store) => (
        <TouchableOpacity
          key={store.id}
          style={styles.storeBox}
          activeOpacity={0.85}
          onPress={() => {
            setSelectedStore(store);
            setScreen('store');
          }}>
          <Image source={store.image} style={styles.storeImage} />
          <Text style={styles.storeName}>{store.name}</Text>
        </TouchableOpacity>
      ))}
      {filteredStores.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>
          Nenhuma loja encontrada.
        </Text>
      )}
    </ScrollView>
  );
}

// ----- ESTILOS -----
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#e5e5e5' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  post: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  postProfilePic: { width: 38, height: 38, borderRadius: 19, marginRight: 10 },
  postStoreName: { fontSize: 16, fontWeight: '600' },
  postImage: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },
  postName: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  postDesc: { fontSize: 14, color: '#444', marginTop: 6 },
  postPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7a00ff',
    marginTop: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  storeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  storeImage: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  storeName: { fontSize: 18, fontWeight: '700' },
});
