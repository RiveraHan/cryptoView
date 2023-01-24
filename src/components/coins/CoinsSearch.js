import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import {colors} from '../../resources/colors';
colors;

const CoinsSearch = ({onChange}) => {
  const [query, setQuery] = useState('');

  const handleText = query_ => {
    setQuery(query_);
    onChange(query_);
  };

  return (
    <View>
      <TextInput
        style={[
          styles.textInput,
          Platform.OS === 'ios' ? styles.textInputIOS : styles.textInputAndroid,
        ]}
        onChangeText={handleText}
        value={query}
        placeholder="Search coins"
        placeholderTextColor={'#fff'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingLeft: 16,
    color: '#fff',
    fontSize: 16,
  },
  textInputAndroid: {
    borderBottomWidth: 2,
    borderBottomColor: colors.zircon,
  },
  textInputIOS: {
    margin: 8,
    borderRadius: 8,
  },
});

export default CoinsSearch;
