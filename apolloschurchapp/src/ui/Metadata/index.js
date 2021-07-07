import React from 'react';
import PropTypes from 'prop-types';
import { Linking, View } from 'react-native';
import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  H4,
  styled,
  PaddedView,
  Touchable,
} from '@apollosproject/ui-kit';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
  backgroundColor: theme.colors.secondary,
}))(PaddedView);

const Metadata = ({ node }) =>
  node?.cost ||
  node?.time ||
  node?.schedule ||
  node?.deadline ||
  node?.forWho ||
  node?.isMembershipRequired ||
  node?.groupEventType?.length ||
  node?.daysAvailable?.length ||
  node?.ministry ||
  node?.serviceArea?.length ||
  node?.opportunityType?.length ||
  node?.relatedSkills?.length ||
  node?.childcareInfo ||
  node?.location?.name ||
  node?.contactName ? (
    <View>
      <RowHeader>
        <H4>{'Details'}</H4>
      </RowHeader>
      <TableView>
        {node?.cost ? (
          <>
            <Divider />
            <Cell>
              <CellText>Cost: ${node?.cost}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.time ? (
          <>
            <Divider />
            <Cell>
              <CellText>Time: {node?.time}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.schedule ? (
          <>
            <Divider />
            <Cell>
              <CellText>Schedule: {node?.schedule}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.deadline ? (
          <>
            <Divider />
            <Cell>
              <CellText>Signup Deadline: {node?.deadline}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.forWho ? (
          <>
            <Divider />
            <Cell>
              <CellText>For Who: {node?.forWho}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.isMembershipRequired ? (
          <>
            <Divider />
            <Cell>
              <CellText>Membership Required</CellText>
            </Cell>
          </>
        ) : null}
        {node?.groupEventType.length ? (
          <>
            <Divider />
            <Cell>
              <CellText>{node?.groupEventType.join(', ')}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.daysAvailable?.length ? (
          <>
            <Divider />
            <Cell>
              <CellText>
                Days Available: {node?.daysAvailable.join(', ')}
              </CellText>
            </Cell>
          </>
        ) : null}
        {node?.ministry ? (
          <>
            <Divider />
            <Cell>
              <CellText>Ministry: {node?.ministry}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.serviceArea?.length ? (
          <>
            <Divider />
            <Cell>
              <CellText>Service Area: {node?.serviceArea.join(', ')}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.opportunityType?.length ? (
          <>
            <Divider />
            <Cell>
              <CellText>
                Opportunity Type: {node?.opportunityType.join(', ')}
              </CellText>
            </Cell>
          </>
        ) : null}
        {node?.relatedSkills?.length ? (
          <>
            <Divider />
            <Cell>
              <CellText>
                Related Skills: {node?.relatedSkills.join(', ')}
              </CellText>
            </Cell>
          </>
        ) : null}
        {node?.childcareInfo ? (
          <>
            <Divider />
            <Cell>
              <CellText>Childcare Info: {node?.childcareInfo}</CellText>
            </Cell>
          </>
        ) : null}
        {node?.location?.name ? (
          <>
            <Divider />
            <Touchable
              onPress={() =>
                node?.location?.address
                  ? Linking.openURL(
                      encodeURI(
                        `https://maps.google.com/?q=${node?.location?.address
                          .replace('\r', '')
                          .split('\n')
                          .join(' ')}`
                      )
                    )
                  : null
              }
            >
              <Cell>
                <CellText>Location: {node?.location?.name}</CellText>
                {node?.location?.address ? (
                  <CellIcon name="arrow-next" />
                ) : null}
              </Cell>
            </Touchable>
          </>
        ) : null}
        {node?.contactName ? (
          <>
            <Divider />
            <Cell>
              <CellText>
                <H4>Contact: {node?.contactName}</H4>
              </CellText>
            </Cell>
            {node?.contactEmail ? (
              <Touchable
                onPress={() => Linking.openURL(`mailto:${node?.contactEmail}`)}
              >
                <Cell>
                  <CellText>{node?.contactEmail}</CellText>
                  <CellIcon name="arrow-next" />
                </Cell>
              </Touchable>
            ) : null}
            {node?.contactPhone ? (
              <Touchable
                onPress={() => Linking.openURL(`sms:${node?.contactPhone}`)}
              >
                <Cell>
                  <CellText>{node?.contactPhone}</CellText>
                  <CellIcon name="arrow-next" />
                </Cell>
              </Touchable>
            ) : null}
          </>
        ) : null}
      </TableView>
    </View>
  ) : null;

Metadata.propTypes = {
  node: PropTypes.shape({}),
};

export default Metadata;
