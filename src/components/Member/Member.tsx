import React from 'react';
import Avatar from '../Avatar';
import MemberButtonGroup from './MemberButtonGroup';

type Props = {
  username: string;
  isOnInvitationPage?: boolean;
  showPlusButton?: boolean;
  showMinusButton?: boolean;
  isAdmin?: boolean;
  isMe?: boolean;
};

const Member = ({
  username,
  isOnInvitationPage,
  showPlusButton,
  showMinusButton,
  isAdmin,
  isMe,
}: Props) => {
  return (
    <div className="flex justify-between items-center py-1 px-4 hover:bg-gray-100 fast-animate">
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          <Avatar type="user" seed={username} />
          <div className="flex flex-col items-center ml-12">
            <p id="username">{username}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center mr-5">
            <p className="text-sm text-green-500">ADMIN</p>
          </div>
        )}
      </div>
      {!isMe && (
        <MemberButtonGroup
          isOnInvitationPage={isOnInvitationPage || false}
          showPlusButton={showPlusButton}
          showMinusButton={showMinusButton}
        />
      )}
    </div>
  );
};

export default Member;
