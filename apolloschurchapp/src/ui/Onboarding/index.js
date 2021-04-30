import React from 'react';
import { View, Image } from 'react-native';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import { requestPermissions } from '@apollosproject/ui-notifications';
import {
  styled,
  BackgroundView,
  NavigationService,
} from '@apollosproject/ui-kit';
import {
  AskNotificationsConnected,
  FeaturesConnected,
  LocationFinderConnected,
  OnboardingSwiper,
  onboardingComplete,
  WITH_USER_ID,
} from '@apollosproject/ui-onboarding';

const FullscreenBackgroundView = styled({
  position: 'absolute',
  width: '100%',
  height: '100%',
})(BackgroundView);

const ImageContainer = styled({
  height: '40%',
})(View);

const StyledImage = styled({
  height: '100%',
  width: '100%',
})(Image);

// Represents the current version of onboarding.
// Some slides will be "older", they shouldn't be shown to existing users.
// Some slides will be the same version as teh current onboarding version.
// Those slides will be shown to any user with an older version than the version of those slides.
export const ONBOARDING_VERSION = 2;

function Onboarding({ navigation, route }) {
  const userVersion = route?.params?.userVersion || 0;
  return (
    <Query query={WITH_USER_ID} fetchPolicy="network-only">
      {({ data }) => (
        <>
          <FullscreenBackgroundView />
          <OnboardingSwiper
            navigation={navigation}
            userVersion={userVersion}
            onComplete={() => {
              onboardingComplete({
                userId: data?.currentUser?.id,
                version: ONBOARDING_VERSION,
              });
              navigation.dispatch(
                NavigationService.resetAction({
                  navigatorName: 'Tabs',
                  routeName: 'Home',
                })
              );
            }}
          >
            {({ swipeForward }) => (
              <>
                <FeaturesConnected
                  description={
                    'Let’s take a few seconds to get your profile set up so you can get the most out of our app.'
                  }
                  onPressPrimary={swipeForward}
                  BackgroundComponent={
                    <ImageContainer>
                      <StyledImage source={require('./img/personalize.jpg')} />
                    </ImageContainer>
                  }
                />
                <LocationFinderConnected
                  slideTitle={'Let’s Find Your Campus'}
                  description={
                    'If you attend one of our local campuses, select it below. If you’re a part of our Online Campus, there’s an option for that as well.'
                  }
                  onPressPrimary={swipeForward}
                  onNavigate={() => {
                    navigation.navigate('Location');
                  }}
                  BackgroundComponent={
                    <ImageContainer>
                      <StyledImage source={require('./img/locations.jpg')} />
                    </ImageContainer>
                  }
                />
                <AskNotificationsConnected
                  slideTitle={'Want to Stay in the Loop?'}
                  description={
                    'Turn on notifications for this app, and you’ll be the first to know when something important pops up.'
                  }
                  onPressPrimary={swipeForward}
                  primaryNavText={'Finish'}
                  version={2}
                  onRequestPushPermissions={requestPermissions}
                  BackgroundComponent={
                    <ImageContainer>
                      <StyledImage
                        source={require('./img/notifications.jpg')}
                      />
                    </ImageContainer>
                  }
                />
              </>
            )}
          </OnboardingSwiper>
        </>
      )}
    </Query>
  );
}

Onboarding.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userVersion: PropTypes.number,
    }),
  }),
};

export default Onboarding;
