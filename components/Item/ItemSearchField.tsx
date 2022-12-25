import React from 'react';
import { resources } from '../../lib/enums';
import useStore from '../../client/store';
import { Appointment, Cluster } from '../../lib/types';
import SearchField from '../SearchField';

type Props = {
  resource: resources.CLUSTER | resources.APPOINTMENT;
  placeholder?: string;
  name?: string;
};

const ItemSearchField = ({ resource, placeholder, name }: Props) => {
  const { cluster, appointments, setCluster, setAppointment } = useStore();

  const setItems = (items: Appointment[][] | Cluster[][] | null) => {
    if (resource === resources.CLUSTER) {
      setCluster(items as Cluster[][]);
    } else if (resource === resources.APPOINTMENT) {
      setAppointment(items as Appointment[][]);
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
            topics: { child: null },
            title: 'random',
            description: 'test',
            creator: 'me',
            roomname: '1AHIF',
            link: 'lol',
          },
          {
            topics: { child: null },
            title: 'randomness',
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
    }

    if (!appointments && !cluster) {
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
