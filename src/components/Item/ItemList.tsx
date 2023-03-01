import React, { useState } from 'react';
import type { AppointmentData, ClusterData } from '../../lib/types';
import { RoomData } from '../../lib/types';
import { conditionSatisfactionTypes, resources } from '../../lib/enums';
import ClusterItemInList from '../Cluster/ClusterItemInList';
import AppointmentItemInList from '../Appointment/AppointmentItemInList';
import Tag from '../SubjectTopic/Tag';
import RoomItemInList from '../Room/RoomItemInList';
import useStore from '../../lib/store';
import Loader from '../Loader';
import ItemListHeader from './ItemListHeader';

type Props = {
  resource: resources.CLUSTER | resources.APPOINTMENT | resources.ROOM;
  items: ClusterData[][] | AppointmentData[][] | RoomData[][] | null;
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
        {title ? <ItemListHeader title={title} /> : <></>}
        <Loader
          type="div"
          size={50}
          loaderText={
            resource === resources.ROOM ? 'Räume werden geladen...' : undefined
          }
        />
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
          {(items as RoomData[][])[page - 1].map((item, idx) => (
            <RoomItemInList
              id={item.untis_id}
              key={idx}
              name={item.name}
              conditionsSatisfied={item.conditionSatisfaction}
            />
          ))}
        </>
      );
      break;
  }

  return (
    <div className="h-fit w-full max-w-[800px] mt-8">
      {title ? <ItemListHeader title={title} /> : <></>}
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
