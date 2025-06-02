import React from 'react';
import { View, Text, StyleSheet, Pressable,Alert } from 'react-native';
import styles from './LandingPage.styles';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type LandingPageProps = {
  onLoginSuccess: (userInfo: any) => void;
};

const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      onLoginSuccess(userInfo);
    } catch (error: any) {
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Our Application</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>
        <Pressable style={styles.googleBtn} onPress={handleGoogleLogin}>
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default LandingPage;
