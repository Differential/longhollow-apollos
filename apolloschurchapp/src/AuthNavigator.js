import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { withTheme, ButtonLink } from '@apollosproject/ui-kit';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import {
  AuthSMSPhoneEntryConnected,
  AuthSMSVerificationConnected,
  AuthEmailEntryConnected,
  AuthPasswordEntryConnected,
  AuthProfileEntryConnected,
  AuthProfileDetailsEntryConnected,
} from '@apollosproject/ui-auth';

import { safeHandleUrl } from '@apollosproject/ui-connected';

const AuthStack = createNativeStackNavigator();
const IdentityStack = createNativeStackNavigator();

const handleOpenWebsite = () => safeHandleUrl('https://longhollow.com');

const withAuthProps = (Component) => (props) => (
  <Component
    {...props}
    promptText={
      <Text>
        Sign in to build a daily spiritual habit with others. Just checking us
        out? Visit our{' '}
        <ButtonLink onPress={handleOpenWebsite}>website</ButtonLink> to learn
        more.
      </Text>
    }
  />
);

const AuthSMS = withAuthProps(AuthSMSPhoneEntryConnected);
const AuthEmail = withAuthProps(AuthEmailEntryConnected);

const AuthNavigator = ({
  alternateLoginText,
  authTitleText,
  confirmationPromptText,
  confirmationTitleText,
  forgotPasswordURL,
  passwordPromptText,
  screenOptions,
}) => (
  <AuthStack.Navigator screenOptions={screenOptions}>
    <AuthStack.Screen name="Identity">
      {() => (
        <IdentityStack.Navigator
          screenOptions={{ stackAnimation: 'none', headerShown: false }}
        >
          <IdentityStack.Screen
            name="AuthSMSPhoneEntryConnected"
            component={AuthSMS}
            initialParams={{ alternateLoginText, authTitleText }}
          />
          <IdentityStack.Screen
            name="AuthEmailEntryConnected"
            component={AuthEmail}
            initialParams={{ alternateLoginText, authTitleText }}
          />
        </IdentityStack.Navigator>
      )}
    </AuthStack.Screen>
    <AuthStack.Screen
      name="AuthSMSVerificationConnected"
      component={AuthSMSVerificationConnected}
      options={{ headerShown: true }}
      initialParams={{ confirmationTitleText, confirmationPromptText }}
    />
    <AuthStack.Screen
      name="AuthPasswordEntryConnected"
      component={AuthPasswordEntryConnected}
      options={{ headerShown: true }}
      initialParams={{ forgotPasswordURL, passwordPromptText }}
    />
    <AuthStack.Screen
      name="AuthProfileEntryConnected"
      component={AuthProfileEntryConnected}
    />
    <AuthStack.Screen
      name="AuthProfileDetailsEntryConnected"
      component={AuthProfileDetailsEntryConnected}
    />
  </AuthStack.Navigator>
);

AuthNavigator.propTypes = {
  alternateLoginText: PropTypes.string,
  authTitleText: PropTypes.string,
  confirmationTitleText: PropTypes.string,
  confirmationPromptText: PropTypes.string,
  passwordPromptText: PropTypes.string,
  forgotPasswordURL: PropTypes.string,
  screenOptions: PropTypes.shape({
    headerTintColor: PropTypes.string,
    headerTitleStyle: PropTypes.shape({
      color: PropTypes.string,
    }),
    headerStyle: PropTypes.shape({
      backgroundColor: PropTypes.string,
    }),
    headerHideShadow: PropTypes.bool,
    headerTitle: PropTypes.string,
    headerBackTitle: PropTypes.string,
    headerShown: PropTypes.bool,
  }),
};

const ThemedAuthNavigator = withTheme(({ theme }) => ({
  screenOptions: {
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
    },
    headerHideShadow: true,
    headerTitle: '',
    headerBackTitle: 'Back',
    headerShown: false,
  },
}))(AuthNavigator);

export default ThemedAuthNavigator;
