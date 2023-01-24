import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import {colors} from '../../resources/colors';
import {http} from '../../libs/http';
import CoinMarketItem from './CoinMarketItem';
import Storage from '../../libs/storage';

const CoinDetailScreen = props => {
  const [coinDetail, setCoinDetail] = useState({});
  const [markets, setMarkets] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const {coin} = props.route.params;
    props.navigation.setOptions({title: coin.symbol});

    setCoinDetail(coin);

    getMarkets(coin.id);
    getFavorite(coin);
  }, [props]);

  const getMarkets = async coinId => {
    const url = `https://api.coinlore.net/api/coin/markets/?id=${coinId}`;

    const res_markets = await http.get(url);
    setMarkets(res_markets);
  };
  const {name} = coinDetail;

  const getSymbolIcon = coinNameId => {
    try {
      if (coinNameId) {
        return `https://c1.coinlore.com/img/16x16/${coinNameId}.png`;
      }
    } catch (error) {
      return new Error(error.message);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };

  const addFavorite = async () => {
    const coin = JSON.stringify(coinDetail);
    const key = `favorite-${coinDetail.id}`;

    const stored = await Storage.instance.store(key, coin);

    if (stored) {
      setIsFavorite(true);
    }
  };
  const removeFavorite = async () => {
    Alert.alert('Remove favorite', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: async () => {
          const key = `favorite-${coinDetail.id}`;

          await Storage.instance.remove(key);

          setIsFavorite(false);
        },
        style: 'destructive',
      },
    ]);
  };

  const getFavorite = async coin => {
    try {
      const key = `favorite-${coin.id}`;

      const favStr = await Storage.instance.get(key);

      if (favStr !== null) {
        setIsFavorite(true);
      }
    } catch (err) {
      console.log('get favorites err', err);
    }
  };

  const getSections = coin => {
    const sections = [
      {
        title: 'Market cap',
        data: [coin.market_cap_usd],
      },
      {
        title: 'Volume 24h',
        data: [coin.volume24],
      },
      {
        title: 'Change 24h',
        data: [coin.percent_change_24h],
      },
    ];

    return sections;
  };

  return (
    <View style={styles.container}>
      <View style={styles.subHeader}>
        <View style={styles.row}>
          <Image
            style={styles.iconImg}
            source={{uri: getSymbolIcon(coinDetail.nameid)}}
          />
          <Text style={styles.titleText}>{name}</Text>
        </View>
        <Pressable
          onPress={toggleFavorite}
          style={[
            styles.btnFavorite,
            isFavorite ? styles.btnFavoriteRemove : styles.btnFavoriteAdd,
          ]}>
          <Text style={styles.btnFavoriteText}>
            {isFavorite ? 'Remove favorite' : 'Add favorite'}
          </Text>
        </Pressable>
      </View>
      <SectionList
        style={styles.section}
        sections={getSections(coinDetail)}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <View style={styles.sectionItem}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({section}) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>{section.title}</Text>
          </View>
        )}
      />
      <Text style={styles.marketsTitle}>Markets</Text>
      <FlatList
        style={styles.list}
        horizontal={true}
        data={markets}
        renderItem={({item}) => <CoinMarketItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charade,
  },
  row: {
    flexDirection: 'row',
  },
  subHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  iconImg: {
    width: 25,
    height: 25,
  },
  section: {
    maxHeight: 220,
  },
  list: {
    maxHeight: 100,
    paddingLeft: 16,
  },
  sectionHeader: {
    backgroundColor: 'rgba(0,0,0, 0.2)',
    padding: 8,
  },
  sectionItem: {
    padding: 8,
  },
  itemText: {
    color: colors.white,
    fontSize: 14,
  },
  sectionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  marketsTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 16,
  },
  btnFavorite: {
    padding: 8,
    borderRadius: 8,
  },
  btnFavoriteText: {
    color: colors.white,
  },
  btnFavoriteAdd: {
    backgroundColor: colors.picton,
  },
  btnFavoriteRemove: {
    backgroundColor: colors.carmine,
  },
});

export default CoinDetailScreen;
