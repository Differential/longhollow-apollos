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
          <Touchable onPress={() => openUrl('https://longhollow.com/contact')}>
            <Cell>
              <CellText>Contact Us</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('https://longhollow.com/prayer')}>
            <Cell>
              <CellText>Prayer Requests</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('https://longhollow.com/baptism')}>
            <Cell>
              <CellText>Get Baptized</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('https://longhollow.com/support')}>
            <Cell>
              <CellText>Support Groups</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('https://longhollow.com/schedule')}>
            <Cell>
              <CellText>Times and Locations</CellText>
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
