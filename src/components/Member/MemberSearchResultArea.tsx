import React from 'react';
import MemberComponent from './Member';
import useStore from '../../lib/store';
import Loader from '../Loader';

type Props = {
  isOnInvitationPage?: boolean;
};

const MemberSearchResultArea = ({ isOnInvitationPage }: Props) => {
  const { potentialMembers, membersToInvite, searchPotentialMembersLoading } =
    useStore();

  const shouldHideAddButton = (username: string) => {
    let matchFound = false;

    if (membersToInvite) {
      membersToInvite.forEach((someMember) => {
        if (someMember.username === username) {
          matchFound = true;
        }
      });
    } else {
      return true;
    }

    return matchFound;
  };

  if (searchPotentialMembersLoading) {
    return (
      <Loader type="div" size={50} extraClasses="h-40 bg-gray-50 h-auto" />
    );
  } else if (!potentialMembers || !potentialMembers.length) {
    return <div></div>;
  }

  return (
    <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 dark:bg-gray-800 overflow-y-auto">
      {potentialMembers.map(({ username }, idx) => (
        <MemberComponent
          key={idx}
          username={username}
          isOnInvitationPage={isOnInvitationPage || false}
          showPlusButton={!shouldHideAddButton(username)}
        />
      ))}
    </div>
  );
};

export default MemberSearchResultArea;
