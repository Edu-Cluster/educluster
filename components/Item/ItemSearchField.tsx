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
    const searchResultItems: Appointment[][] = [
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

    if (!appointments && !cluster) {
      // Save search result items as a state
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
