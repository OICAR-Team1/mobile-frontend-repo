import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './NavBar.styles';
import { CommonActions } from '@react-navigation/native';

type NavBarProps = {
  currentScreen: 'Company' | 'Projects';
  navigation: any;
   onLogout: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ currentScreen, navigation, onLogout }) => {
  return (
    <View style={styles.topNav}>
      <View style={styles.navRight}>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() =>
            navigation.replace(currentScreen === 'Company' ? 'Projects' : 'Company')
          }
        >
          <Text style={styles.switchButtonText}>
            {currentScreen === 'Company' ? 'Idi na Projekte' : 'Idi na Partnere'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;