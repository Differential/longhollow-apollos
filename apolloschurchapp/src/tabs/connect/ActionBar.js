import React from 'react';
import { Query } from '@apollo/client/react/components';
import gql from 'graphql-tag';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { useNavigation } from '@react-navigation/native';

const Toolbar = () => {
  const navigation = useNavigation();
  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <ActionBar>
          <ActionBarItem
            onPress={() => openUrl('https://www.longhollow.com/about/schedule')}
            icon="time"
            label="Schedule"
          />
          <Query
            query={gql`
              {
                currentUser {
                  id
                  profile {
                    id
                    groups {
                      id
                      name
                    }
                  }
                }
              }
            `}
            fetch-policy={'cache-and-network'}
          >
            {({ data, loading, error }) => {
              if (loading) return null;
              if (error) return null;
              return data.currentUser.profile.groups.length ? (
                <ActionBarItem
                  onPress={() => navigation.navigate('Passes')}
                  icon="check"
                  label="Check-in"
                />
              ) : null;
            }}
          </Query>
          <ActionBarItem
            onPress={() =>
              openUrl('https://www.longhollow.com/online-giving', {
                externalBrowser: true,
              })
            }
            icon="heart-solid"
            label="Give"
          />
        </ActionBar>
      )}
    </RockAuthedWebBrowser>
  );
};

export default Toolbar;
