import React from 'react';
import Avatar from '../Avatar';
import MemberButtonGroup from './MemberButtonGroup';

type Props = {
  username: string;
  isOnInvitationPage?: boolean;
  showPlusButton?: boolean;
  showMinusButton?: boolean;
};

const Member = ({
  username,
  isOnInvitationPage,
  showPlusButton,
  showMinusButton,
}: Props) => {
  return (
    <div className="flex justify-between items-center py-1 px-4 hover:bg-gray-100 fast-animate">
      <div className="flex items-center">
        <Avatar type="user" seed={username} />
        <div className="flex flex-col items-start ml-12">
          <p id="username">{username}</p>
        </div>
      </div>
      <MemberButtonGroup
        isOnInvitationPage={isOnInvitationPage || false}
        showPlusButton={showPlusButton}
        showMinusButton={showMinusButton}
      />
    </div>
  );
};

export default Member;
