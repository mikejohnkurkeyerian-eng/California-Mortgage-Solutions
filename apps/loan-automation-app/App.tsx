import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import LoanApplicationScreen from './src/screens/LoanApplicationScreen';
import LoanDetailScreen from './src/screens/LoanDetailScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';
import DocumentExamplesScreen from './src/screens/DocumentExamplesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Borrower Tab Navigator
function BorrowerTabs() {
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
        name="Application"
        component={LoanApplicationScreen}
        options={{
          tabBarLabel: 'Application',
          tabBarIcon: ({color, size, focused}) => (
            <Text style={{fontSize: 28, color}}>
              {focused ? '📝' : '📄'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          tabBarLabel: 'Documents',
          tabBarIcon: ({color, size, focused}) => (
            <Text style={{fontSize: 28, color}}>
              {focused ? '📄' : '📋'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
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
            name="Home"
            component={HomeScreen}
            options={{title: 'Loan Automation Platform', headerShown: false}}
          />
          <Stack.Screen
            name="Borrower"
            component={BorrowerTabs}
            options={{title: 'Borrower Portal'}}
          />
          <Stack.Screen
            name="LoanDetail"
            component={LoanDetailScreen}
            options={{title: 'Loan Details'}}
          />
          <Stack.Screen
            name="Confirmation"
            component={ConfirmationScreen}
            options={{title: 'Review Application'}}
          />
          <Stack.Screen
            name="DocumentExamples"
            component={DocumentExamplesScreen}
            options={{title: 'Document Examples'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
