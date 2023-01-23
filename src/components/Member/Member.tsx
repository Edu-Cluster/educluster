import React from 'react';
import Avatar from '../Avatar';
import MemberButtonGroup from './MemberButtonGroup';
import useStore from '../../lib/store';
import { clusterAssociations } from '../../lib/enums';

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
  const { clusterAssociation } = useStore();

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
          <div className={`flex items-center mr-5${isMe ? ' mr-[132px]' : ''}`}>
            <p className="text-sm text-green-500">ADMIN</p>
          </div>
        )}
      </div>
      {clusterAssociation === clusterAssociations.IS_ADMIN && !isMe && (
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
