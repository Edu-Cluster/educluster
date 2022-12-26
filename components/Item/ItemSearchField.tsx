import React from 'react';
import { resources } from '../../lib/enums';
import useStore from '../../client/store';
import { Appointment, Cluster } from '../../lib/types';
import SearchField from '../SearchField';
import { Room } from 'webuntis';

type Props = {
  resource: resources.CLUSTER | resources.APPOINTMENT | resources.ROOM;
  placeholder?: string;
  name?: string;
};

const ItemSearchField = ({ resource, placeholder, name }: Props) => {
  const { cluster, appointments, rooms, setCluster, setAppointment, setRooms } =
    useStore();

  const setItems = (items: Appointment[][] | Cluster[][] | Room[][] | null) => {
    if (resource === resources.CLUSTER) {
      setCluster(items as Cluster[][]);
    } else if (resource === resources.APPOINTMENT) {
      setAppointment(items as Appointment[][]);
    } else if (resource === resources.ROOM) {
      setRooms(items as Room[][]);
    }
  };

  const searchForItems = (e: any) => {
    if (e.currentTarget.value === '') {
      setItems(null);
      return;
    }

    // TODO Lara GET request an den Backend schicken, um user zu finden
    let searchResultItems;
    if (resource === resources.APPOINTMENT) {
      searchResultItems = [
        [
          {
            id: 1,
            topics_for_appointment: [
              { topic_topicTotopics_for_appointment: null },
            ],
            name: 'random',
            description: 'test',
            creator: 'me',
            roomname: '1AHIF',
            link: 'lol',
          },
          {
            id: 2,
            topics_for_appointment: [
              { topic_topicTotopics_for_appointment: null },
            ],
            name: 'randomness',
            description: 'test2',
            creator: 'christopher',
            roomname: '5AHIF',
            link: 'lol',
          },
        ],
      ];
    } else if (resource === resources.CLUSTER) {
      searchResultItems = [
        [
          {
            clustername: 'test',
            description: 'the most random description',
            person: { username: 'yoyo' },
            id: 1,
          },
        ],
      ];
    } else if (resource === resources.ROOM) {
      searchResultItems = [
        [
          {
            id: 1,
            name: '1AHIF',
            longName: '1AHIF',
            alternateName: '1AHIF',
            active: true,
            foreColor: 'blue',
            backColor: 'white',
          },
        ],
      ];
    }

    if (!appointments && !cluster && !rooms) {
      // Save search result items as a state
      // @ts-ignore
      setItems(searchResultItems);
    }
  };

  return (
    <SearchField
      placeholder={placeholder}
      onChangeHandler={searchForItems}
      name={name}
    />
  );
};

export default ItemSearchField;
