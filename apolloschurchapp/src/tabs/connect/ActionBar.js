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
              navigation.navigate('NodeSingle', {
                nodeId: 'UniversalContentItem:66e7a69ceb06c1ae1b8e792528813836',
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
