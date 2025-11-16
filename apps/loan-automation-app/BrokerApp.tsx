import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Text} from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import LoanDetailScreen from './src/screens/LoanDetailScreen';
import BrokerHomeScreen from './src/screens/BrokerHomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Broker Tab Navigator
function BrokerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 2,
          borderTopColor: '#e5e7eb',
          height: 85,
          paddingBottom: 12,
          paddingTop: 12,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '700',
          marginTop: 6,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size, focused}) => (
            <Text style={{fontSize: 28, color}}>
              {focused ? '📊' : '📈'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Broker App - Separate from Borrower App
function BrokerApp(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="BrokerHome"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}>
          <Stack.Screen
            name="BrokerHome"
            component={BrokerHomeScreen}
            options={{title: 'Broker Console', headerShown: false}}
          />
          <Stack.Screen
            name="BrokerDashboard"
            component={BrokerTabs}
            options={{title: 'Broker Dashboard'}}
          />
          <Stack.Screen
            name="LoanDetail"
            component={LoanDetailScreen}
            options={{title: 'Loan Details'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default BrokerApp;

