import React, { useState } from 'react';
import ListCluster from './Cluster';
import Tag from './Tag';
import type { Cluster, Item } from '../../lib/types';

type Props = {
  cluster: Cluster[][] | null;
  title?: 'Lerneinheiten' | 'Cluster';
};

const ClusterList = ({ cluster, title }: Props) => {
  const [page, setPage] = useState(1);

  const loadNewPage = (e: any) => {
    const nextPage = e.target.innerText;

    if (nextPage === page) return;

    setPage(nextPage);
  };

  return (
    <div className="h-[700px] w-full max-w-[800px] mt-8">
      {title ? (
        <p className="px-4 rounded-sm bg-gray-100 text-2xl">{title}</p>
      ) : (
        <></>
      )}
      <div className="h-full w-full overflow-y-auto card flex flex-col justify-between divide-y">
        <div className="h-fit divide-y">
          {cluster &&
            cluster[page - 1].map((item, idx) => (
              <ListCluster
                key={idx}
                clustername={item.clustername}
                description={item.description}
                creator={item.person && item.person.username}
                link={'/cluster/' + item.clustername + '#' + item.id}
              ></ListCluster>
            ))}
        </div>
        <div className="py-3 flex justify-center items-center gap-2">
          {cluster &&
            cluster.map((item, idx) => (
              <div
                key={idx + 1}
                className={`${page == idx + 1 ? 'text-white bg-blue-400' : ''}
                  w-6 h-6 rounded-sm text-gray-700 hover:text-white hover:bg-blue-400 slow-animate flex justify-center items-center cursor-pointer text-md`}
                onClick={loadNewPage}
              >
                {idx + 1}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClusterList;
