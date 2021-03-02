import React from 'react';
import { Query } from '@apollo/client/react/components';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import {
  GradientOverlayImage,
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

const StyledGradient = styled({
  maxHeight: '40%',
})(GradientOverlayImage);

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
                <StyledGradient
                  source={'https://picsum.photos/640/640/?random'}
                />
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
                <StyledGradient
                  source={'https://picsum.photos/640/640/?random'}
                />
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
                    <StyledGradient
                      source={'http://picsum.photos/640/640/?random'}
                    />
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
