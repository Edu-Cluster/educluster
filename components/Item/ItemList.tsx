import React, { useState } from 'react';
import ClusterItemInList from '../Cluster/ClusterItemInList';
import type { Appointment, Cluster, Item } from '../../lib/types';
import AppointmentItemInList from '../Appointment/AppointmentItemInList';
import Tag from '../SubjectTopic/Tag';
import { resources } from '../../lib/enums';

type Props = {
  resource: resources.CLUSTER | resources.APPOINTMENT;
  items: Cluster[][] | Appointment[][] | Item[][] | null;
  title?: 'Lerneinheiten' | 'Cluster';
  placeholder?: string;
};

const ItemList = ({ resource, items, title, placeholder }: Props) => {
  const [page, setPage] = useState(1);

  const loadNewPage = (e: any) => {
    const nextPage = e.target.innerText;

    if (nextPage === page) return;

    setPage(nextPage);
  };

  console.log(items);

  if (!items || !items.length) {
    return (
      <div className="text-center mt-24">
        <p className="text-gray-400">{placeholder}</p>
      </div>
    );
  }

  return (
    <div className="h-fit w-full max-w-[800px] mt-8">
      {title ? (
        <p className="px-4 rounded-sm bg-gray-100 text-2xl">{title}</p>
      ) : (
        <></>
      )}
      <div className="h-full w-full overflow-y-auto card flex flex-col justify-between divide-y">
        <div className="h-fit divide-y">
          {resource === resources.CLUSTER
            ? // @ts-ignore
              (items as Cluster)[page - 1].map((item, idx) => (
                <ClusterItemInList
                  key={idx}
                  clustername={item.clustername}
                  description={item.description}
                  creator={item.person.username}
                  link={'/cluster/' + item.clustername + '#' + item.id}
                ></ClusterItemInList>
              ))
            : // @ts-ignore
              (items as Appointment)[page - 1].map((item, idx) => (
                <AppointmentItemInList
                  key={idx}
                  title={item.title}
                  description={item.description}
                  creator={item.creator}
                  roomname={item.roomname}
                  link={'/appointment/' + item.name + '#' + item.id}
                >
                  {item.topics_for_appointment &&
                    item.topics_for_appointment.map(
                      (
                        tag: {
                          topic_topicTotopics_for_appointment: {
                            symbol: string;
                          };
                        },
                        idx: React.Key | null | undefined,
                      ) => (
                        <Tag
                          key={idx}
                          name={tag.topic_topicTotopics_for_appointment.symbol}
                        />
                      ),
                    )}
                </AppointmentItemInList>
              ))}
        </div>
        <div className="py-3 flex justify-center items-center gap-2">
          {items.map((item, idx) => (
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
