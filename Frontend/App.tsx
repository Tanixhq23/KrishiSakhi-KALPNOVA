import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './src/stores';

import OnboardingScreen from './src/screens/OnboardingScreen';
import FarmerProfileScreen from './src/screens/FarmerProfileScreen';
import ActivityLogScreen from './src/screens/ActivityLogScreen';
import ChatScreen from './src/screens/ChatScreen';
import StoreScreen from './src/screens/StoreScreen';
import NewsFeed from './src/screens/NewsFeed';

export type RootStackParamList = {
  Onboarding: undefined;
  FarmerProfile: undefined;
  ActivityLog: undefined;
  Chat: undefined;
  Store: undefined;
  News: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="FarmerProfile" component={FarmerProfileScreen} />
          <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Store" component={StoreScreen} />
          <Stack.Screen name="News" component={NewsFeed} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
