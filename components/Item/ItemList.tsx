import React, { useState } from 'react';
import ClusterItemInList from './ClusterItemInList';
import type { Cluster, Appointment, Item } from '../../lib/types';
import AppointmentItemInList from './AppointmentItemInList';
import Tag from './Tag';

type Props = {
  items: Cluster[][] | Appointment[][] | Item[][] | null;
  title?: 'Lerneinheiten' | 'Cluster';
};

const ItemList = ({ items, title }: Props) => {
  const [page, setPage] = useState(1);

  // console.log('Items: ' + items);

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
          {items &&
            (title === 'Cluster'
              ? // @ts-ignore
                (items as Cluster)[page - 1].map((item, idx) => (
                  <ClusterItemInList
                    key={idx}
                    clustername={item.clustername}
                    description={item.description}
                    creator={item.person?.username}
                    link={'/cluster/' + item.clustername + '#' + item.id}
                  ></ClusterItemInList>
                ))
              : // @ts-ignore
                (items as Appointment)[page - 1].map((item, idx) => (
                  <AppointmentItemInList
                    key={idx}
                    title={item.name}
                    description={item.description}
                    creator={item.person?.username}
                    roomname={item.roomname}
                    link={'/appointment/' + item.name + '#' + item.id}
                  >
                    {item.topics_for_appointment &&
                      item.topics_for_appointment.map((tag, idx) => (
                        <Tag
                          key={idx}
                          name={tag.topic_topicTotopics_for_appointment.symbol}
                        />
                      ))}
                  </AppointmentItemInList>
                )))}
        </div>
        <div className="py-3 flex justify-center items-center gap-2">
          {items &&
            items.map((item, idx) => (
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

export default ItemList;
