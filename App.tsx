/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TextInput,
  Button,
  Text,
} from 'react-native';
import { useState } from 'react';
import { ReclaimVerification } from '@reclaimprotocol/inapp-rn-sdk';

const reclaimVerification = new ReclaimVerification();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [inputText, setInputText] = useState('');
  const [statusText, setStatusText] = useState('');

  const handleSubmit = async () => {
    try {
      const verificationResult = await reclaimVerification.startVerification({
        appId: '1234567890',
        secret: '1234567890',
        providerId: inputText,
      });
      console.log(verificationResult);
      setStatusText(`Test successful at ${new Date().toISOString()}`);
    } catch (error) {
      console.error(error);
      setStatusText(`Test FAILED at ${new Date().toISOString()}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>Welcome</Text>
      <TextInput
        testID="input-text"
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter Provider ID here"
        placeholderTextColor="#666"
      />
      <Button testID="submit-button" title="Test" onPress={handleSubmit} />
      {statusText ? (
        <Text style={styles.submittedText}>{statusText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submittedText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
