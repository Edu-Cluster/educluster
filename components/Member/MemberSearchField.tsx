import React from 'react';
import useStore from '../../client/store';
import { Member } from '../../lib/types';
import SearchField from '../SearchField';

type Props = {
  placeholder?: string;
};

const MemberSearchField = ({ placeholder }: Props) => {
  const { potentialMembers, setPotentialMembers } = useStore();

  const searchForUser = (e: any) => {
    if (e.currentTarget.value === '') {
      setPotentialMembers(null);
      return;
    }

    // TODO Lara GET request an den Backend schicken, um user zu finden
    const searchResultMembers: Member[] = [];

    if (!potentialMembers) {
      // Save search result potential members as a state
      setPotentialMembers(searchResultMembers);
    }
  };

  return (
    <SearchField placeholder={placeholder} onChangeHandler={searchForUser} />
  );
};

export default MemberSearchField;
