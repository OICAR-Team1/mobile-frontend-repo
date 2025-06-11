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
      setIsAuthenticated(!!token);
      setUser(userInfo ? JSON.parse(userInfo) : null);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = async (userInfo: any) => {
     try {
    console.log('userInfo:', userInfo);
    console.log('handleLoginSuccess called with userInfo:', userInfo);
    await AsyncStorage.setItem('jwtToken', userInfo.data.idToken);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo.data.user));
    setUser(userInfo.user);
    setIsAuthenticated(true);
    console.log('isAuthenticated should now be true');
  } catch (error) {
    console.error('Error in handleLoginSuccess:', error);
  }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
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