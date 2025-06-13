import React from 'react';
import { View, Text, StyleSheet, Pressable,Alert } from 'react-native';
import styles from './LandingPage.styles';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authService } from '../../services/api.service';

type LandingPageProps = {
  onLoginSuccess: (userInfo: any) => void;
};

const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const googleUserInfo = await GoogleSignin.signIn();
      console.log('googleUserInfo:', googleUserInfo);

      // Get idToken from the correct place
      const idToken =
        googleUserInfo.idToken ||
        (googleUserInfo.data && googleUserInfo.data.idToken);

      if (!idToken) {
        Alert.alert('Login failed', 'No idToken received from Google.');
        return;
      }

     
      const backendUserInfo = await authService.login({
        token: idToken,
      });
      console.log('Backend login response:', backendUserInfo);
      onLoginSuccess(backendUserInfo);

    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Dobrodošli u eStudent sustav</Text>
          <Text style={styles.subtitle}>Sign in kako bi nastavili</Text>
        </View>
        <Pressable style={styles.googleBtn} onPress={handleGoogleLogin}>
          <Text style={styles.googleBtnText}>prijava putem Googla</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LandingPage;