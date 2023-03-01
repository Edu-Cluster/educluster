import React, { useEffect, useState } from 'react';
import { resources } from '../../lib/enums';
import useStore from '../../lib/store';
import SearchField from '../SearchField';
import { AppointmentData, ClusterData, RoomData } from '../../lib/types';
import trpc from '../../lib/trpc';

type Props = {
  resource: resources.CLUSTER | resources.APPOINTMENT | resources.ROOM;
  placeholder?: string;
  name?: string;
};

const ItemSearchField = ({ resource, placeholder, name }: Props) => {
  const {
    clusters,
    appointments,
    setClusters,
    setAppointments,
    setRooms,
    setSearchItemsLoading,
  } = useStore();
  const [textInput, setTextInput] = useState('');
  const debouncedSearchTerm = useDebounce(textInput, 500);

  useEffect(
    () => {
      // Send item query to get a list of the given resource from the database
      if (resource === resources.APPOINTMENT) {
        appointmentsQuery.refetch();
      } else if (resource === resources.CLUSTER) {
        clustersQuery.refetch();
      } else {
        setSearchItemsLoading(false);
        setItems(null);
      }
    },
    [debouncedSearchTerm], // Only call effect if debounced search term changes
  );

  const clustersQuery = trpc.useQuery(['item.clusters', textInput], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      if (!clusters) {
        // Save search result clusters as state
        setItems(data.clusters);
        setSearchItemsLoading(false);
      }
    },
    onError: async (err) => {
      setItems(null);
      setSearchItemsLoading(false);
      console.error(err);
    },
  });

  const appointmentsQuery = trpc.useQuery(['item.appointments', textInput], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      if (!appointments) {
        // Save search result appointments as state
        setItems(data.appointments);
        setSearchItemsLoading(false);
      }
    },
    onError: async (err) => {
      setItems(null);
      setSearchItemsLoading(false);
      console.error(err);
    },
  });

  const setItems = (
    items: AppointmentData[][] | ClusterData[][] | RoomData[][] | null,
  ) => {
    if (resource === resources.CLUSTER) {
      setClusters(items as ClusterData[][]);
    } else if (resource === resources.APPOINTMENT) {
      setAppointments(items as AppointmentData[][]);
    }
  };

  const setNewTextInput = async (e: any) => {
    const val = e.currentTarget.value;

    setItems(null);
    setTextInput(val);
    setSearchItemsLoading(true);
  };

  return (
    <SearchField
      placeholder={placeholder}
      onChangeHandler={setNewTextInput}
      name={name}
    />
  );
};

function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export default ItemSearchField;
