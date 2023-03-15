import React, { useEffect, useState } from 'react';
import useStore from '../../lib/store';
import SearchField from '../SearchField';
import SubjectTopicComponent from './SubjectTopicComponent';
import { resources } from '../../lib/enums';
import Loader from '../Loader';
import trpc from '../../lib/trpc';

type Props = {
  resource: resources.TOPIC | resources.SUBJECT;
};

const SubjectTopicSearchField = ({ resource }: Props) => {
  const {
    potentialSubjects,
    setPotentialSubjects,
    subjects,
    potentialTopics,
    setPotentialTopics,
    topics,
    searchPotentialSubjectsLoading,
    setSearchPotentialSubjectsLoading,
    searchPotentialTopicsLoading,
    setSearchPotentialTopicsLoading,
  } = useStore();
  const [textInput, setTextInput] = useState('');
  const debouncedSearchTerm = useDebounce(textInput, 500);
  const isTopic = resource === resources.TOPIC;

  const matchingSubjects =
    (potentialSubjects &&
      potentialSubjects.filter((potentialSubject) => {
        if (subjects) {
          return subjects.indexOf(potentialSubject) !== -1;
        }
      })) ||
    [];
  const matchingTopics =
    (potentialTopics &&
      potentialTopics.filter((potentialTopic) => {
        if (topics) {
          return topics.indexOf(potentialTopic) !== -1;
        }
      })) ||
    [];

  const findSubjectsQuery = trpc.useQuery(['catalog.subjects', textInput], {
    enabled: false,
    onSuccess: async ({ data }) => {
      if (!potentialSubjects) {
        setPotentialSubjects(data.subjects);
      }

      setSearchPotentialSubjectsLoading(false);
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const findTopicsQuery = trpc.useQuery(['catalog.topics', textInput], {
    enabled: false,
    onSuccess: async ({ data }) => {
      if (!potentialTopics) {
        setPotentialTopics(data.topics);
      }

      setSearchPotentialTopicsLoading(false);
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        if (isTopic) {
          findTopicsQuery.refetch();
        } else {
          findSubjectsQuery.refetch();
        }
      }
    },
    [debouncedSearchTerm], // Only call effect if debounced search term changes
  );

  const setNewTextInput = async (e: any) => {
    const val = e.currentTarget.value;

    if (isTopic) {
      if (val === '') {
        setSearchPotentialTopicsLoading(false);
        setPotentialTopics(null);
        return;
      }
    } else {
      if (val === '') {
        setSearchPotentialSubjectsLoading(false);
        setPotentialSubjects(null);
        return;
      }
    }

    if (isTopic) {
      setSearchPotentialTopicsLoading(true);
    } else {
      setSearchPotentialSubjectsLoading(true);
    }

    setTextInput(val);
  };

  return (
    <>
      {isTopic ? (
        <div className="w-full flex flex-col">
          <SearchField
            placeholder="Thema eingeben"
            noIcon={true}
            name="topic-search"
            onChangeHandler={setNewTextInput}
          />
          {searchPotentialTopicsLoading ? (
            <Loader
              type="div"
              size={50}
              extraClasses="h-40 bg-gray-50 h-auto mt-2"
            />
          ) : (
            potentialTopics && (
              <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 overflow-y-auto mt-2">
                {potentialTopics.map((potentialTopic, idx) => (
                  <SubjectTopicComponent
                    key={idx}
                    resource={resource}
                    name={potentialTopic}
                    showPlusButton={
                      !matchingTopics.some((topic) => topic === potentialTopic)
                    }
                  />
                ))}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col">
          <SearchField
            placeholder="Fach eingeben"
            noIcon={true}
            name="subject-search"
            onChangeHandler={setNewTextInput}
          />
          {searchPotentialSubjectsLoading ? (
            <Loader
              type="div"
              size={50}
              extraClasses="h-40 bg-gray-50 h-auto mt-2"
            />
          ) : (
            potentialSubjects && (
              <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 overflow-y-auto mt-2">
                {potentialSubjects.map((potentialSubject, idx) => (
                  <SubjectTopicComponent
                    key={idx}
                    resource={resource}
                    name={potentialSubject}
                    showPlusButton={
                      !matchingSubjects.some(
                        (subject) => subject === potentialSubject,
                      )
                    }
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}
    </>
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

export default SubjectTopicSearchField;
