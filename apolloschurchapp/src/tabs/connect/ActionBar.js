import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const Toolbar = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <ActionBar>
        <ActionBarItem
          onPress={() => openUrl('https://longhollow.online/groups/')}
          icon="groups"
          label="My Groups"
        />
        <ActionBarItem
          onPress={() => openUrl('https://longhollow.online/give/')}
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

export default Toolbar;
