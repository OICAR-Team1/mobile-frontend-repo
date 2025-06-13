import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyPage from './my-app/src/pages/Companypage/Companypage';
import ProjectsPage from './my-app/src/pages/Projectspage/Projectspage';
import LandingPage from './my-app/src/pages/Landingpage/LandingPage';
import DetailsPage from './my-app/src/pages/Detailspage/Detailspage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId: '92671188893-299le3fdajnsdcema6ohp855mnqspu1t.apps.googleusercontent.com', 
  offlineAccess: true,
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

 useEffect(() => {
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const userInfo = await AsyncStorage.getItem('userInfo');
    console.log('Read from AsyncStorage:', { token, userInfo });
    setIsAuthenticated(!!token);
    setUser(userInfo ? JSON.parse(userInfo) : null);
  };
  checkAuth();
}, []);


 const handleLoginSuccess = async (userInfo: any) => {
  try {
    // If userInfo is NOT nested under .data:
    await AsyncStorage.setItem('jwtToken', userInfo.token);
    await AsyncStorage.setItem('userId', String(userInfo.id));
    if (userInfo.user) {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo.user));
      setUser(userInfo.user);
    } else {
      setUser(null);
    }
    setIsAuthenticated(true);
    console.log('isAuthenticated should now be true');
  } catch (error) {
    console.error('Error in handleLoginSuccess:', error);
  }
};



 const handleLogout = async () => {
  await AsyncStorage.removeItem('jwtToken');
  await AsyncStorage.removeItem('userId');
  await AsyncStorage.removeItem('userInfo');
  setUser(null);
  setIsAuthenticated(false);

// This signs out from Google and will prompt for account selection next time
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.warn('Google sign-out error:', error);
  }
 
};

  return (
     <NavigationContainer>
      {!isAuthenticated ? (
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" options={{ headerShown: false }}>
            {(props) => <LandingPage {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Company">
          <Stack.Screen name="Company">
            {(props) => <CompanyPage {...props} user={user} onLogout={handleLogout} />}
          </Stack.Screen>
          <Stack.Screen name="Projects">
            {(props) => <ProjectsPage {...props} user={user} onLogout={handleLogout} />}
          </Stack.Screen>
          <Stack.Screen name="Details" component={DetailsPage} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}