import React from 'react';
import { View, Image } from 'react-native';
import { Query } from '@apollo/client/react/components';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import {
  styled,
  BackgroundView,
  NavigationService,
} from '@apollosproject/ui-kit';
import {
  AskNotificationsConnected,
  LocationFinderConnected,
  FeaturesConnected,
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

function Onboarding({ navigation }) {
  return (
    <>
      <FullscreenBackgroundView />
      <OnboardingSwiper>
        {({ swipeForward }) => (
          <>
            <FeaturesConnected
              description={
                'Let’s take a few seconds to get your profile set up so you can get the most out of our app.'
              }
              onPressPrimary={swipeForward}
              BackgroundComponent={
                <ImageContainer>
                  <StyledImage source={require('./personalize.jpg')} />
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
                  <StyledImage source={require('./location.jpg')} />
                </ImageContainer>
              }
            />
            <Query query={WITH_USER_ID} fetchPolicy="network-only">
              {({ data }) => (
                <AskNotificationsConnected
                  slideTitle={'Want to Stay in the Loop?'}
                  description={
                    'Turn on notifications for this app, and you’ll be the first to know when something important pops up.'
                  }
                  onPressPrimary={() => {
                    onboardingComplete({ userId: data?.currentUser?.id });
                    navigation.dispatch(
                      NavigationService.resetAction({
                        navigatorName: 'Tabs',
                        routeName: 'Home',
                      })
                    );
                  }}
                  onRequestPushPermissions={(update) => {
                    checkNotifications().then((checkRes) => {
                      if (checkRes.status === RESULTS.DENIED) {
                        requestNotifications(['alert', 'badge', 'sound']).then(
                          () => {
                            update();
                          }
                        );
                      } else {
                        openSettings();
                      }
                    });
                  }}
                  primaryNavText={'Finish'}
                  BackgroundComponent={
                    <ImageContainer>
                      <StyledImage source={require('./notifications.jpg')} />
                    </ImageContainer>
                  }
                />
              )}
            </Query>
          </>
        )}
      </OnboardingSwiper>
    </>
  );
}

export default Onboarding;
