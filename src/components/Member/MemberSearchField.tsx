import React, { useEffect, useState } from 'react';
import useStore from '../../lib/store';
import SearchField from '../SearchField';
import trpc from '../../lib/trpc';

type Props = {
  placeholder?: string;
  clusterId: number;
};

const MemberSearchField = ({ placeholder, clusterId }: Props) => {
  const {
    potentialMembers,
    setPotentialMembers,
    setSearchPotentialMembersLoading,
  } = useStore();
  const [textInput, setTextInput] = useState('');
  const debouncedSearchTerm = useDebounce(textInput, 500);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        usersQuery.refetch();
      }
    },
    [debouncedSearchTerm], // Only call effect if debounced search term changes
  );

  const usersQuery = trpc.useQuery(
    ['user.users', { username: textInput, clusterId }],
    {
      enabled: false,
      retry: 0,
      onSuccess: ({ data }) => {
        if (!potentialMembers) {
          // Save search result potential members as a state
          setPotentialMembers(data.users);
          setSearchPotentialMembersLoading(false);
        }
      },
      onError: async (err) => {
        setSearchPotentialMembersLoading(false);
        console.error(err);
      },
    },
  );

  const setNewTextInput = async (e: any) => {
    const val = e.currentTarget.value;

    setSearchPotentialMembersLoading(false);
    setPotentialMembers(null);

    if (val === '') {
      setTextInput(val);
      return;
    }

    setSearchPotentialMembersLoading(true);
    setTextInput(val);
  };

  return (
    <SearchField placeholder={placeholder} onChangeHandler={setNewTextInput} />
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

export default MemberSearchField;
