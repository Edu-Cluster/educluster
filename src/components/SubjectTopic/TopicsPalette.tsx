import React, { useEffect } from 'react';
import useStore from '../../lib/store';
import SubjectTopicComponent from './SubjectTopicComponent';
import { resources } from '../../lib/enums';
import ItemListHeader from '../Item/ItemListHeader';

type Props = {
  subject: string | null;
};

const TopicsPalette = ({ subject }: Props) => {
  const { potentialTopics, setPotentialTopics, topics } = useStore();

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

    // TODO Lara: topics-query aufrufen (alle Themen, die unter dem Fach "subject" zu finden sind)
    const searchResultTopics: string[] = [
      'Vektoren',
      'Grammatik',
      'Lineare Algebra',
      'Hibernate',
    ];

    setPotentialTopics(searchResultTopics);
  }, [subject]);

  return potentialTopics ? (
    <div className="w-full flex flex-col">
      <span>
        <ItemListHeader title="Themen" />
      </span>
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

export default TopicsPalette;
