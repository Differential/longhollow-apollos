import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

// async (_, __, { dataSources }) => {
//   // check for this first because the next data call takes a long time
//   const authToken = await dataSources.Auth.getAuthToken();
//   return `https://rock.longhollow.com/page/1308?rckipid=${authToken}`;
// }

const Toolbar = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <ActionBar>
        <ActionBarItem
          onPress={() => openUrl('https://www.longhollow.com/about/schedule')}
          icon="time"
          label="Schedule"
        />
        <ActionBarItem
          onPress={() =>
            openUrl('https://rock.longhollow.com/page/1308', {
              useRockToken: true,
            })
          }
          icon="check"
          label="Check-in"
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
