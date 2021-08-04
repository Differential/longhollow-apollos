import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const Toolbar = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <ActionBar>
        <ActionBarItem
          onPress={() => openUrl('https://www.longhollow.com/about/schedule')}
          icon="time"
          label="Service Times"
        />
        <ActionBarItem
          onPress={() =>
            openUrl('https://www.longhollow.com/search?category=Events&p=1')
          }
          icon="calendar"
          label="Events"
        />
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

export default Toolbar;
