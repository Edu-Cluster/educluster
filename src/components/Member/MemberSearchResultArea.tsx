import React from 'react';
import MemberComponent from './Member';
import useStore from '../../lib/store';
import { MoonLoader } from 'react-spinners';

type Props = {
  isOnInvitationPage?: boolean;
};

const MemberSearchResultArea = ({ isOnInvitationPage }: Props) => {
  const {
    potentialMembers: members,
    membersToInvite,
    searchPotentialMembersLoading,
  } = useStore();

  let matchFound = false;
  membersToInvite.forEach((member) => {
    if (members) {
      members.forEach((someMember) => {
        if (someMember.username === member.username) {
          matchFound = true;
        }
      });
    }
  });

  if (searchPotentialMembersLoading) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-50">
        <MoonLoader size={50} />
      </div>
    );
  } else if (!members || !members.length) {
    return <div></div>;
  }

  return (
    <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 overflow-y-auto">
      {members.map(({ username }, idx) => (
        <MemberComponent
          key={idx}
          username={username}
          isOnInvitationPage={isOnInvitationPage || false}
          showPlusButton={!matchFound}
        />
      ))}
    </div>
  );
};

export default MemberSearchResultArea;
