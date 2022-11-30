import React from 'react';
import { Member } from '../lib/types';
import MemberComponent from './Member/Member';

type Props = {
  members: Member[];
  isOnInvitationPage?: boolean;
};

const SearchResultArea = ({ members, isOnInvitationPage }: Props) => {
  return (
    <>
      {members.length && (
        <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 overflow-y-auto">
          {members.map(({ username, role }, idx) => (
            <MemberComponent
              key={idx}
              username={username}
              role={role}
              isOnInvitationPage={isOnInvitationPage || false}
              isInSearchResultArea={true}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchResultArea;
