import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './NavBar.styles';


type NavBarProps = {
  currentScreen: 'Company' | 'Projects';
  navigation: any;
};

const NavBar: React.FC<NavBarProps> = ({ currentScreen, navigation }) => (
  <View style={styles.topNav}>
   
    <View style={styles.navRight}>
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() =>
          navigation.replace(currentScreen === 'Company' ? 'Projects' : 'Company')
        }
      >
        <Text style={styles.switchButtonText}>
          {currentScreen === 'Company' ? 'Go to Projects' : 'Go to Companies'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default NavBar;