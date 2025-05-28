import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import styles from './LandingPage.styles';

const LandingPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Our Application</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>
        <Pressable style={styles.googleBtn} onPress={() => { /* Add logic later */ }}>
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
};



export default LandingPage;
