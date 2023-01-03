import React from 'react';
import MemberComponent from './Member';
import useStore from '../../client/store';

type Props = {
  isOnInvitationPage?: boolean;
};

const MemberSearchResultArea = ({ isOnInvitationPage }: Props) => {
  const { potentialMembers: members, membersToInvite } = useStore();

  const matchingMembers = membersToInvite.filter((member) => {
    if (members) {
      return members.indexOf(member) !== -1;
    }
  });

  return (
    <>
      {members && members.length && (
        <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 overflow-y-auto">
          {members.map(({ username }, idx) => (
            <MemberComponent
              key={idx}
              username={username}
              isOnInvitationPage={isOnInvitationPage || false}
              showPlusButton={
                !matchingMembers.some((member) => member.username === username)
              }
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MemberSearchResultArea;
