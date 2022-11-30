import React from 'react';
import { resources, roles } from '../../lib/enums';
import useStore from '../../client/store';
import { Member } from '../../lib/types';
import SearchField from '../SearchField';

type Props = {
  resource: resources.APPOINTMENT | resources.USER | resources.CLUSTER;
  placeholder?: string;
};

const MemberSearchField = ({ resource, placeholder }: Props) => {
  const { potentialMembers, setPotentialMembers } = useStore();

  const searchForUser = (e: any) => {
    if (e.currentTarget.value === '') {
      setPotentialMembers(null);
      return;
    }

    // TODO Lara GET request an den Backend schicken (resource = Tabellenname = Ressourcentyp, der gebracht wird)
    const searchResultMembers: Member[] = [
      {
        username: 'RandomUser',
        role: roles.STUDENT,
      },
      {
        username: 'RandomUser99',
        role: roles.STUDENT,
      },
      {
        username: 'RandomTeacher',
        role: roles.TEACHER,
      },
      {
        username: 'AAAAAAAAAAAAAAAAAAAA',
        role: roles.TEACHER,
      },
    ];

    if (!potentialMembers) {
      // Save search result potential members as a state
      setPotentialMembers(searchResultMembers);
    }
  };

  return (
    <SearchField
      resource={resource}
      placeholder={placeholder}
      onChangeHandler={searchForUser}
    />
  );
};

export default MemberSearchField;
