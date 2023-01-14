import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { resources } from '../../lib/enums';
import useStore from '../../lib/store';
import ItemSearchField from '../../components/Item/ItemSearchField';
import ItemList from '../../components/Item/ItemList';
import ClusterFilterBox from '../../components/Cluster/ClusterFilterBox';
import trpc from '../../lib/trpc';
import { User } from '../../lib/types';
import { MoonLoader } from 'react-spinners';

const ClusterSearchPage: NextPage = () => {
  const { setAuthUser, clusterOfUser, setClusterOfUser } = useStore();

  const userQuery = trpc.useQuery(['user.me'], {
    retry: 1,
    onSuccess: ({ data }) => {
      setAuthUser(data.user as User);
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    setClusterOfUser(null);
  }, []);

  if (userQuery.isSuccess) {
    return (
      <main className="page-default">
        <div className="w-full max-w-[800px] mt-16 flex flex-col gap-4">
          <ItemSearchField
            resource={resources.CLUSTER}
            placeholder="Nach Clustern suchen"
            name="cluster-search"
          />
          <ClusterFilterBox showResetButton={!!clusterOfUser} />
          <ItemList
            resource={resources.CLUSTER}
            items={clusterOfUser}
            placeholder="Benutze das Suchfeld oder die Filter um nach Clustern zu suchen"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <MoonLoader size={80} />
    </main>
  );
};

export default ClusterSearchPage;
