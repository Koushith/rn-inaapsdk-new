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
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { ReclaimVerification } from '@reclaimprotocol/inapp-rn-sdk';
import secrets from './secrets.json';

const reclaimVerification = new ReclaimVerification();

export const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [inputText, setInputText] = useState('');
  const [statusText, setStatusText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setConsoleOutput('');
    setStatusText('');

    try {
      const result = await reclaimVerification.startVerification({
        appId: secrets.RECLAIM_APP_ID,
        secret: secrets.RECLAIM_APP_SECRET,
        providerId: inputText,
      });

      // Store the console output
      setConsoleOutput(JSON.stringify(result, null, 2));
      console.log(result);
      setStatusText(`✅ Verification successful`);
    } catch (error) {
      if (error instanceof ReclaimVerification.ReclaimVerificationException) {
        switch (error.type) {
          case ReclaimVerification.ExceptionType.Cancelled:
            setStatusText('❌ Verification cancelled');
            setConsoleOutput('Error: Verification cancelled');
            break;
          case ReclaimVerification.ExceptionType.Dismissed:
            setStatusText('❌ Verification dismissed');
            setConsoleOutput('Error: Verification dismissed');
            break;
          case ReclaimVerification.ExceptionType.SessionExpired:
            setStatusText('❌ Verification session expired');
            setConsoleOutput('Error: Verification session expired');
            break;
          case ReclaimVerification.ExceptionType.Failed:
          default:
            setStatusText('❌ Verification failed');
            setConsoleOutput('Error: Verification failed');
        }
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unknown verification error occurred';
        setStatusText('❌ Verification failed');
        setConsoleOutput(`Error: ${errorMessage}`);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setStatusText('');
    setConsoleOutput('');
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Reclaim Protocol
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              React Native InApp SDK
            </Text>
          </View>

          {/* Input Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBackground,
                shadowColor: theme.shadow,
              },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Provider ID
            </Text>
            <TextInput
              testID="input-text"
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                },
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Enter your provider ID"
              placeholderTextColor={theme.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                testID="submit-button"
                style={[
                  styles.button,
                  styles.primaryButton,
                  {
                    backgroundColor: inputText.trim()
                      ? theme.primary
                      : theme.buttonDisabled,
                    opacity: isLoading ? 0.7 : 1,
                  },
                ]}
                onPress={handleSubmit}
                disabled={!inputText.trim() || isLoading}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                  {isLoading ? 'Verifying...' : 'Start Verification'}
                </Text>
              </TouchableOpacity>

              {(consoleOutput || statusText) && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    {
                      backgroundColor: 'transparent',
                      borderColor: theme.inputBorder,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleClear}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {statusText ? (
              <View
                style={[
                  styles.statusContainer,
                  { backgroundColor: theme.statusBackground },
                ]}
              >
                <Text style={[styles.statusText, { color: theme.text }]}>
                  {statusText}
                </Text>
                <Text
                  style={[styles.timestamp, { color: theme.textSecondary }]}
                >
                  {new Date().toLocaleTimeString()}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Console Output */}
          {consoleOutput ? (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  shadowColor: theme.shadow,
                },
              ]}
            >
              <Text style={[styles.label, { color: theme.text }]}>
                Console Output
              </Text>
              <ScrollView
                style={[
                  styles.consoleContainer,
                  { backgroundColor: theme.consoleBackground },
                ]}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={[styles.consoleText, { color: theme.consoleText }]}
                  selectable={true}
                >
                  {consoleOutput}
                </Text>
              </ScrollView>
            </View>
          ) : null}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Powered by Reclaim Protocol
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const lightTheme = {
  background: '#f8fafc',
  cardBackground: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  primary: '#3b82f6',
  inputBackground: '#f1f5f9',
  inputBorder: '#e2e8f0',
  placeholder: '#94a3b8',
  buttonText: '#ffffff',
  buttonDisabled: '#cbd5e1',
  shadow: '#000000',
  statusBackground: '#f1f5f9',
  consoleBackground: '#f8fafc',
  consoleText: '#374151',
};

const darkTheme = {
  background: '#0f172a',
  cardBackground: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  primary: '#3b82f6',
  inputBackground: '#334155',
  inputBorder: '#475569',
  placeholder: '#64748b',
  buttonText: '#ffffff',
  buttonDisabled: '#475569',
  shadow: '#000000',
  statusBackground: '#334155',
  consoleBackground: '#1e293b',
  consoleText: '#e2e8f0',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
  secondaryButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
  },
  consoleContainer: {
    borderRadius: 8,
    padding: 16,
    maxHeight: 300,
    minHeight: 100,
  },
  consoleText: {
    fontSize: 14,
    fontFamily: 'Courier New',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
  },
});

export default App;
