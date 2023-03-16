import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { resources } from '../../lib/enums';
import useStore from '../../lib/store';
import ItemSearchField from '../../components/Item/ItemSearchField';
import ItemList from '../../components/Item/ItemList';
import trpc from '../../lib/trpc';
import { User } from '../../lib/types';
import Loader from '../../components/Loader';

const ClusterSearchPage: NextPage = () => {
  const { setAuthUser, clusters } = useStore();

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
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
    userQuery.refetch();
  }, []);

  if (userQuery.isSuccess) {
    return (
      <main className="page-default h-auto">
        <div className="w-full max-w-[800px] mt-16 flex flex-col gap-4">
          <ItemSearchField
            resource={resources.CLUSTER}
            placeholder="Nach Clustern suchen"
            name="cluster-search"
          />
          <ItemList
            resource={resources.CLUSTER}
            items={clusters}
            placeholder="Benutze das Suchfeld um nach Clustern zu suchen"
          />
        </div>
      </main>
    );
  }

  return <Loader type="main" size={80} />;
};

export default ClusterSearchPage;
