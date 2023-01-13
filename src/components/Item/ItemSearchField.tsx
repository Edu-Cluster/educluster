import React from 'react';
import { resources } from '../../lib/enums';
import useStore from '../../lib/store';
import SearchField from '../SearchField';
import { AppointmentData, ClusterData } from '../../lib/types';
import { Room } from 'webuntis';

type Props = {
  resource: resources.CLUSTER | resources.APPOINTMENT | resources.ROOM;
  placeholder?: string;
  name?: string;
};

const ItemSearchField = ({ resource, placeholder, name }: Props) => {
  const {
    clusterOfUser,
    appointmentsOfUser,
    rooms,
    setClusterOfUser,
    setAppointmentOfCluster,
    setRooms,
  } = useStore();

  const setItems = (
    items: AppointmentData[][] | ClusterData[][] | Room[][] | null,
  ) => {
    if (resource === resources.CLUSTER) {
      setClusterOfUser(items as ClusterData[][]);
    } else if (resource === resources.APPOINTMENT) {
      setAppointmentOfCluster(items as AppointmentData[][]);
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
      searchResultItems = [];
    } else if (resource === resources.CLUSTER) {
      searchResultItems = [];
    } else if (resource === resources.ROOM) {
      searchResultItems = [];
    }

    if (!appointmentsOfUser && !clusterOfUser && !rooms) {
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
