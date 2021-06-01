import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import { gql } from '@apollo/client';
// import fragmentTypes from './src/client/fragmentTypes.json';

// Create a map all the interfaces each type implements.
// If UniversalContentItem implements Node, Card, and ContentNode,
// our typemap would be { UniversalContentItem: ['Node', 'Card', 'ContentNode'] }
// const TYPEMAP = fragmentTypes.__schema.types.reduce((acc, curr) => {
//   const { name } = curr;
//   const types = Object.fromEntries(
//     curr.possibleTypes.map((type) => [type.name, name])
//   );
//   Object.keys(types).forEach((key) => {
//     acc[key] = acc[key] ? [...acc[key], types[key]] : [types[key]];
//   });
//   return acc;
// }, {});

// Hardcode the typemap for now.
// This changes what connected components are displayed as loading states on content items
const TYPEMAP = {
  ContentSeriesContentItem: ['ContentParentNode'],
  DevotionalContentItem: ['ContentChildNode'],
};

ApollosConfig.loadJs({
  TYPEMAP,
  FRAGMENTS: {
    ...FRAGMENTS,
    CONTENT_SINGLE_FRAGMENT: gql`
      fragment ContentSingleFragment on ContentItem {
        title
        htmlContent
        coverImage {
          sources {
            uri
          }
        }
        ... on UniversalContentItem {
          cost
          time
          schedule
          deadline
          forWho
          isMembershipRequired
          groupEventType
          daysAvailable
          ministry
          serviceArea
          opportunityType
          relatedSkills
          childcareInfo
          location {
            name
            address
          }
          contactName
          contactEmail
          contactPhone
        }
      }
    `,
  },
});
