import React, { useState } from 'react';
import type { AppointmentData, ClusterData } from '../../lib/types';
import { conditionSatisfactionTypes, resources } from '../../lib/enums';
import ClusterItemInList from '../Cluster/ClusterItemInList';
import AppointmentItemInList from '../Appointment/AppointmentItemInList';
import Tag from '../SubjectTopic/Tag';
import { Room } from 'webuntis';
import RoomItemInList from '../Room/RoomItemInList';
import { MoonLoader } from 'react-spinners';
import useStore from '../../lib/store';

type Props = {
  resource: resources.CLUSTER | resources.APPOINTMENT | resources.ROOM;
  items: ClusterData[][] | AppointmentData[][] | Room[][] | null;
  title?: 'Lerneinheiten' | 'Cluster';
  placeholder?: string;
};

const ItemList = ({ resource, items, title, placeholder }: Props) => {
  const { searchItemsLoading } = useStore();
  const [page, setPage] = useState(1);

  const loadNewPage = (e: any) => {
    const nextPage = e.target.innerText;

    if (nextPage === page) return;

    setPage(nextPage);
  };

  if (!items || !items.length) {
    if (!searchItemsLoading) {
      if (placeholder) {
        return (
          <div className="text-center mt-24">
            <p className="text-gray-400">{placeholder}</p>
          </div>
        );
      } else if (items && !items.length) {
        return <></>;
      }
    }

    return (
      <div className="h-fit w-full mt-8 border-2 border-sky-50">
        {title ? (
          <p className="px-4 rounded-sm bg-gray-100 text-2xl">{title}</p>
        ) : (
          <></>
        )}
        <div className="h-[500px] w-full flex justify-center items-center">
          <MoonLoader size={50} />
        </div>
      </div>
    );
  }

  let ItemsInList;

  switch (resource) {
    case resources.CLUSTER:
      ItemsInList = (
        <>
          {(items as ClusterData[][])[page - 1].map((item, idx) => (
            <ClusterItemInList
              key={idx}
              clustername={item.clustername}
              description={item.description}
              creator={item.person.username}
              link={'/cluster/' + item.clustername + '*' + item.id}
            />
          ))}
        </>
      );
      break;
    case resources.APPOINTMENT:
      ItemsInList = (
        <>
          {(items as AppointmentData[][])[page - 1].map((item, idx) => (
            <AppointmentItemInList
              key={idx}
              title={item.name}
              description={item.description}
              creator={item.person.username}
              roomname={item.roomname}
              link={'/termin/' + item.name + '*' + item.id}
            >
              {item.topics_for_appointment &&
                item.topics_for_appointment.map((tag, idx) => {
                  if (tag.topic_topicTotopics_for_appointment) {
                    return (
                      <Tag
                        key={idx}
                        name={tag.topic_topicTotopics_for_appointment.symbol}
                      />
                    );
                  }
                })}
            </AppointmentItemInList>
          ))}
        </>
      );
      break;
    case resources.ROOM:
      ItemsInList = (
        <>
          {(items as Room[][])[page - 1].map((item, idx) => (
            <RoomItemInList
              key={idx}
              name={item.name}
              link={'/appointment/' + item.name + '#' + item.id}
              conditionsSatisfied={conditionSatisfactionTypes.SATISFIED}
            />
          ))}
        </>
      );
      break;
  }

  return (
    <div className="h-fit w-full max-w-[800px] mt-8">
      {title ? (
        <p className="px-4 rounded-sm bg-gray-100 text-2xl">{title}</p>
      ) : (
        <></>
      )}
      <div className="h-full w-full overflow-y-auto card flex flex-col justify-between divide-y">
        <div className="h-fit divide-y">{ItemsInList}</div>
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
