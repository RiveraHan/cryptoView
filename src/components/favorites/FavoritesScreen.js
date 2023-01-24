import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import FavoritesEmptyState from './FavoritesEmptyState';
import {colors} from '../../resources/colors';
import Storage from '../../libs/storage';
import CoinsItems from '../coins/CoinsItems';

const FavoritesScreen = props => {
  const {navigation} = props;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const getFavorites = async () => {
    try {
      const allKeys = await Storage.instance.getAllKeys();
      const keys = allKeys.filter(key => key.includes('favorite-'));
      const response = await Storage.instance.getAll(keys);
      const favoritesParse = response.map(fav => JSON.parse(fav[1]));
      setFavorites(favoritesParse);
      console.log('Favorites', favoritesParse);
    } catch (err) {
      console.log('get favorites err', err);
    }
  };
  const handlePress = coin => {
    navigation.navigate('CoinDetail', {coin});
  };
  return (
    <View style={styles.container}>
      {favorites.length === 0 ? <FavoritesEmptyState /> : null}

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={({item}) => (
            <CoinsItems item={item} onPress={() => handlePress(item)} />
          )}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.charade,
    flex: 1,
  },
});

export default FavoritesScreen;
