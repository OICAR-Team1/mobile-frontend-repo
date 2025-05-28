import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyPage from './my-app/src/pages/Companypage/Companypage';
import ProjectsPage from './my-app/src/pages/Projectspage/Projectspage';
import LandingPage from './my-app/src/pages/Landingpage/LandingPage';
import DetailsPage from './my-app/src/pages/Detailspage/Detailspage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Company">
        <Stack.Screen name="Company" component={CompanyPage} />
        <Stack.Screen name="Projects" component={ProjectsPage}  />
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Details" component={DetailsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
