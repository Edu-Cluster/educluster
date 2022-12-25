import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { resources } from '../../lib/enums';
import useStore from '../../client/store';
import ItemSearchField from '../../components/Item/ItemSearchField';
import ItemList from '../../components/Item/ItemList';
import ClusterFilterBox from '../../components/Cluster/ClusterFilterBox';
import trpc from '../../client/trpc';
import { User } from '../../lib/types';
import { MoonLoader } from 'react-spinners';

const ClusterSearchPage: NextPage = () => {
  const store = useStore();

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      store.setAuthUser(data.user as User);
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();
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
          <ClusterFilterBox showResetButton={!!store.cluster} />
          <ItemList
            resource={resources.CLUSTER}
            items={store.cluster}
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
