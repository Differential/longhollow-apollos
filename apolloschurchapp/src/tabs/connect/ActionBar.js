import React from 'react';
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
            onPress={() => openUrl('https://longhollow.online/groups/')}
            icon="groups"
            label="My Groups"
          />
          <ActionBarItem
            onPress={() =>
              navigation.navigate('ContentSingle', {
                itemId: 'UniversalContentItem:7030adbb8729a5937d3187665a370f7e',
              })
            }
            icon="heart-solid"
            label="Give"
          />
          <ActionBarItem
            onPress={() => openUrl('https://longhollow.online/help/')}
            icon="question"
            label="Get help"
          />
        </ActionBar>
      )}
    </RockAuthedWebBrowser>
  );
};

export default Toolbar;
