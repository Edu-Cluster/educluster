import React, { useState } from 'react';
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  MinusIcon,
  PlusIcon,
  UserRemoveIcon,
} from '@heroicons/react/outline';
import useStore from '../../lib/store';
import { User } from '../../lib/types';
import { useRouter } from 'next/router';
import trpc from '../../lib/trpc';
import { clusterAssociations } from '../../lib/enums';
import { MoonLoader } from 'react-spinners';

type Props = {
  isOnInvitationPage: boolean;
  showPlusButton?: boolean;
  showMinusButton?: boolean;
  isAdmin?: boolean;
};

const MemberButtonGroup = ({
  isOnInvitationPage,
  showPlusButton,
  showMinusButton,
  isAdmin,
}: Props) => {
  const {
    potentialMembers,
    membersToInvite,
    setMembersToInvite,
    setUserOfCluster,
  } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  let { clustername: clusterfullname } = router.query;

  const clusterId =
    clusterfullname && Number((clusterfullname as string).split('*')[1]);

  const membersOfClusterQuery = trpc.useQuery(
    ['item.membersOfCluster', clusterId as number],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        setIsLoading(false);

        if (data) {
          setUserOfCluster(data.members);
        }
      },
      onError: async (err) => {
        setIsLoading(false);
        console.error(err);
      },
    },
  );

  const { mutate: updateClusterMemberMutation } = trpc.useMutation(
    ['item.updateMemberOfCluster'],
    {
      onSuccess: async () => {
        await membersOfClusterQuery.refetch();
      },
      onError: async (err) => {
        console.error(err);
        await membersOfClusterQuery.refetch();
      },
    },
  );

  const { mutate: removeMemberMutation } = trpc.useMutation(
    ['item.removeMemberFromCluster'],
    {
      onSuccess: async () => {
        await membersOfClusterQuery.refetch();
      },
      onError: async (err) => {
        console.error(err);
        await membersOfClusterQuery.refetch();
      },
    },
  );

  const promoteMemberToAdmin = async (e: any) => {
    const username =
      e.currentTarget.parentElement.parentElement.querySelector(
        '#username',
      ).textContent;

    setIsLoading(true);

    await updateClusterMemberMutation({
      username,
      clusterId: clusterId as number,
      type: clusterAssociations.IS_ADMIN,
    });
  };

  const demoteAdminToMember = async (e: any) => {
    const username =
      e.currentTarget.parentElement.parentElement.querySelector(
        '#username',
      ).textContent;

    setIsLoading(true);

    await updateClusterMemberMutation({
      username,
      clusterId: clusterId as number,
      type: clusterAssociations.IS_MEMBER,
    });
  };

  const removeMember = async (e: any) => {
    const username =
      e.currentTarget.parentElement.parentElement.querySelector(
        '#username',
      ).textContent;

    setIsLoading(true);

    await removeMemberMutation({
      username,
      clusterId: clusterId as number,
      type: isAdmin
        ? clusterAssociations.IS_ADMIN
        : clusterAssociations.IS_MEMBER,
    });
  };

  const addPotentialMember = (e: any) => {
    const username =
      e.currentTarget.parentElement.parentElement.querySelector(
        '#username',
      ).textContent;
    const member = (potentialMembers as User[]).filter(
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
    const members = (membersToInvite as User[]).filter(
      (potentialMember) => potentialMember.username !== username,
    );

    setMembersToInvite(members);
  };

  if (isLoading) {
    return <MoonLoader size={20} />;
  }

  return (
    <div className="flex gap-4">
      {!isOnInvitationPage ? (
        <>
          {isAdmin ? (
            <div
              className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100"
              onClick={(e) => demoteAdminToMember(e)}
            >
              <ChevronDoubleDownIcon height={20} width={20} />
            </div>
          ) : (
            <div
              className="secondary-button h-8 w-12 flex justify-center items-center text-emerald-500 transition-colors hover:bg-emerald-100"
              onClick={(e) => promoteMemberToAdmin(e)}
            >
              <ChevronDoubleUpIcon height={20} width={20} />
            </div>
          )}
          <div
            className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100"
            onClick={(e) => removeMember(e)}
          >
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
