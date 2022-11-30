import React from 'react';
import Avatar from '../Avatar';
import MemberButtonGroup from './MemberButtonGroup';

type Props = {
  username: string;
  role: string;
  isOnInvitationPage?: boolean;
  isInSearchResultArea?: boolean;
};

const Member = ({
  username,
  role,
  isOnInvitationPage,
  isInSearchResultArea,
}: Props) => {
  return (
    <div className="flex justify-between items-center py-1 px-4 hover:bg-gray-100 fast-animate">
      <div className="flex items-center">
        <Avatar type="user" seed={username} />
        <div className="flex flex-col items-start ml-12">
          <p>{username}</p>
          <p className="text-sm">{role}</p>
        </div>
      </div>
      <MemberButtonGroup
        isOnInvitationPage={isOnInvitationPage || false}
        showPlusButton={isInSearchResultArea}
      />
    </div>
  );
};

export default Member;
