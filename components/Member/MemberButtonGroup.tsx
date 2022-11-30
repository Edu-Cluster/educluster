import React from 'react';
import {
  ChevronDoubleUpIcon,
  UserRemoveIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import useStore from '../../client/store';
import { Member } from '../../lib/types';

type Props = {
  isOnInvitationPage: boolean;
  showPlusButton?: boolean;
  showMinusButton?: boolean;
};

const MemberButtonGroup = ({
  isOnInvitationPage,
  showPlusButton,
  showMinusButton,
}: Props) => {
  const { potentialMembers, membersToInvite, setMembersToInvite } = useStore();

  const addPotentialMember = (e: any) => {
    const username =
      e.currentTarget.parentElement.parentElement.querySelector(
        '#username',
      ).textContent;
    const member = (potentialMembers as Member[]).filter(
      (potentialMember) => potentialMember.username === username,
    )[0];
    const members = membersToInvite;
    members.push(member);

    setMembersToInvite(members);
  };

  const removePotentialMember = (e: any) => {
    const username =
      e.currentTarget.parentElement.parentElement.querySelector(
        '#username',
      ).textContent;
    const members = (membersToInvite as Member[]).filter(
      (potentialMember) => potentialMember.username !== username,
    );

    setMembersToInvite(members);
  };

  return (
    <div className="flex gap-4">
      {!isOnInvitationPage ? (
        <>
          <div className="secondary-button h-8 w-12 flex justify-center items-center text-emerald-500 transition-colors hover:bg-emerald-100">
            <ChevronDoubleUpIcon height={20} width={20} />
          </div>
          <div className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100">
            <UserRemoveIcon height={20} width={20} />
          </div>
        </>
      ) : (
        <>
          {showPlusButton ? (
            <div
              className="secondary-button h-8 w-12 flex justify-center items-center text-emerald-500 transition-colors hover:bg-emerald-100"
              onClick={(e) => addPotentialMember(e)}
            >
              <PlusIcon height={20} width={20} />
            </div>
          ) : (
            showMinusButton && (
              <div
                className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100"
                onClick={(e) => removePotentialMember(e)}
              >
                <MinusIcon height={20} width={20} />
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default MemberButtonGroup;
