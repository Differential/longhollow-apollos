import React from 'react';
import { View } from 'react-native';

import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  PaddedView,
  H4,
} from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView);

const Name = styled({
  flexGrow: 1,
})(View);

const ActionTable = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <View>
        <RowHeader>
          <Name>
            <H4>{'Connect with Long Hollow'}</H4>
          </Name>
        </RowHeader>
        <TableView>
          <Touchable
            onPress={() =>
              openUrl('https://longhollow.com/about/starting-point')
            }
          >
            <Cell>
              <CellText>Take your next step</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() =>
              openUrl('https://longhollow.com/connect/connect-with-us')
            }
          >
            <Cell>
              <CellText>Contact us</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://longhollow.com/next-steps/baptism')}
          >
            <Cell>
              <CellText>Get Baptized</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() =>
              openUrl('https://longhollow.com/next-steps/become-a-member')
            }
          >
            <Cell>
              <CellText>Become a member</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() =>
              openUrl('https://longhollow.com/next-steps/plan-your-visit')
            }
          >
            <Cell>
              <CellText>Plan your visit</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() =>
              openUrl(
                'https://rock.longhollow.com/page/1062',
                {},
                { useRockToken: true }
              )
            }
          >
            <Cell>
              <CellText>Notification Preferences</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('mailto:support@longhollow.com')}>
            <Cell>
              <CellText>Report an issue</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
        </TableView>
        <RowHeader>
          <Name>
            <H4>{'Follow Us Online'}</H4>
          </Name>
        </RowHeader>
        <TableView>
          <Touchable onPress={() => openUrl('https://facebook.com/longhollow')}>
            <Cell>
              <CellText>Facebook</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://instagram.com/longhollow')}
          >
            <Cell>
              <CellText>Instagram</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('https://twitter.com/longhollow')}>
            <Cell>
              <CellText>Twitter</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('https://youtube.com/longhollow')}>
            <Cell>
              <CellText>YouTube</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
        </TableView>
      </View>
    )}
  </RockAuthedWebBrowser>
);

const StyledActionTable = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 100,
}))(ActionTable);

export default StyledActionTable;
