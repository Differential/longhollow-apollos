import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const Toolbar = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <ActionBar>
        <ActionBarItem
          onPress={() =>
            openUrl('https://longhollow-web.vercel.app/app-link/about/schedule')
          }
          icon="time"
          label="Service Times"
        />
        <ActionBarItem
          onPress={() =>
            openUrl('https://longhollow-web.vercel.app/search?category=Events')
          }
          icon="calendar"
          label="Events"
        />
        <ActionBarItem
          onPress={() =>
            openUrl('https://longhollow-web.vercel.app/app-link/online-giving')
          }
          icon="heart-solid"
          label="Give"
        />
      </ActionBar>
    )}
  </RockAuthedWebBrowser>
);

export default Toolbar;
