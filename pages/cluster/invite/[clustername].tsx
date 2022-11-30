import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import MemberList from '../../../components/Member/MemberList';
import SearchField from '../../../components/SearchField';
import { trpc } from '../../../client/trpc';
import useStore from '../../../client/store';
import { Member, User } from '../../../lib/types';
import { roles, resources } from '../../../lib/enums';
import ClusterBanner from '../../../components/Cluster/ClusterBanner';
import SearchResultArea from '../../../components/SearchResultArea';

const members: Member[][] = [
  [
    {
      username: 'KiesseseWetter',
      role: roles.ADMINISTRATOR,
    },
  ],
];

const searchResultMembers: Member[] = [
  {
    username: 'RandomUser',
    role: roles.STUDENT,
  },
  {
    username: 'RandomUser99',
    role: roles.STUDENT,
  },
  {
    username: 'RandomTeacher',
    role: roles.TEACHER,
  },
];

const InviteClusterPage: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  let { clustername } = router.query;

  if (Array.isArray(clustername)) {
    clustername = clustername[0];
  }

  const query = trpc.useQuery(['user.me'], {
    enabled: false,
    onSuccess: ({ data }) => {
      store.setAuthUser(data.user as User);

      // Fetch cluster details and members
      // TODO Lara
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '../../login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    query.refetch();
  }, []);

  return (
    <main className="page-sizing flex justify-center screen-xxl:mt-12 gap-5 px-2 pb-24 sm:px-24 lg:px-12 screen-xxxl:px-36 flex-wrap-reverse screen-xxl:flex-nowrap">
      <div className="w-full flex justify-center screen-xxl:justify-start gap-5 flex-wrap lg:w-auto screen-xxl:w-full screen-xxxl:flex-nowrap">
        <MemberList members={members} isOnInvitationPage={true} />
        <div className="w-[900px] mt-16 flex flex-col gap-4">
          <SearchField
            resource={resources.USER}
            placeholder="Nach Benutzer mit Benutzername oder E-Mail suchen"
          />
          <SearchResultArea
            members={searchResultMembers}
            isOnInvitationPage={true}
          />
        </div>
      </div>

      <ClusterBanner
        name={clustername as string}
        type="öffentlich/privat"
        description="asdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasfdasdfasdf"
        isOnInvitationPage={true}
      />
    </main>
  );
};

export default InviteClusterPage;
