import React, {useState, useEffect} from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {http} from '../../libs/http';
import CoinsItems from './CoinsItems';
import {colors} from '../../resources/colors';
import CoinsSearch from './CoinsSearch';

const CoinsScreen = props => {
  const [coins, setCoins] = useState({coins});
  const [allCoins, setAllCoins] = useState({coins});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await http.get(
          'https://api.coinlore.net/api/tickers/',
        );
        setCoins(response.data);
        setAllCoins(response.data);
        setLoading(false);
      } catch (err) {
        return new Error(err.message);
      }
    })();
  }, []);

  const {navigation} = props;

  const handlePress = coin => {
    navigation.navigate('CoinDetail', {coin});
  };

  const handleSearch = query => {
    const coinsFiltered = allCoins.filter(coin => {
      return (
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
    });

    setCoins(coinsFiltered);
  };

  return (
    <View style={styles.container}>
      <CoinsSearch onChange={handleSearch} />
      {loading ? (
        <ActivityIndicator color={'#fff'} size={100} style={styles.loader} />
      ) : (
        <FlatList
          data={coins}
          renderItem={({item}) => (
            <CoinsItems item={item} onPress={() => handlePress(item)} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charade,
  },
  titleText: {
    color: '#fff',
    textAlign: 'center',
  },
  btn: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 10,
    margin: 16,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  loader: {
    marginTop: '50%',
  },
});

export default CoinsScreen;
