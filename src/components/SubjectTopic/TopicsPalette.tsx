import React, { useEffect, useState } from 'react';
import useStore from '../../lib/store';
import SubjectTopicComponent from './SubjectTopicComponent';
import { resources } from '../../lib/enums';
import ItemListHeader from '../Item/ItemListHeader';
import trpc from '../../lib/trpc';
import Loader from '../Loader';

type Props = {
  subject: string | null;
};

const TopicsPalette = ({ subject }: Props) => {
  const {
    potentialTopics,
    setPotentialTopics,
    topics,
    searchPotentialTopicsLoading,
    setSearchPotentialTopicsLoading,
  } = useStore();
  const debouncedSearchTerm = useDebounce(subject || '', 250);

  const matchingTopics =
    (potentialTopics &&
      potentialTopics.filter((potentialTopic) => {
        if (topics) {
          return topics.indexOf(potentialTopic) !== -1;
        }
      })) ||
    [];

  useEffect(() => {
    if (!subject) {
      setPotentialTopics(null);
      return;
    }

    setSearchPotentialTopicsLoading(true);
    findTopicsBySubjectQuery.refetch();
  }, [debouncedSearchTerm]);

  const findTopicsBySubjectQuery = trpc.useQuery(
    // @ts-ignore
    ['catalog.topicsBySubject', subject],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        setPotentialTopics(data.topics);

        setSearchPotentialTopicsLoading(false);
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  return potentialTopics ? (
    <div className="w-full flex flex-col">
      <span>
        <ItemListHeader title="Themen" />
      </span>
      {searchPotentialTopicsLoading ? (
        <Loader
          type="div"
          size={50}
          extraClasses="h-40 bg-gray-50 h-auto mt-2"
        />
      ) : (
        <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 overflow-y-auto mt-2">
          {potentialTopics.map((potentialTopic, idx) => (
            <SubjectTopicComponent
              key={idx}
              resource={resources.TOPIC}
              name={potentialTopic}
              showPlusButton={
                !matchingTopics.some((topic) => topic === potentialTopic)
              }
            />
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="w-full flex flex-col">
      <span>
        <ItemListHeader title="Themen" />
      </span>
      <p className="mt-4 text-gray-400">
        Wähle ein Fach aus um Themen zu sehen.
      </p>
    </div>
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

export default TopicsPalette;
