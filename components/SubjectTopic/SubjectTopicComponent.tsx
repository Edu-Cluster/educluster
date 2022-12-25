import React from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import useStore from '../../client/store';
import { resources } from '../../lib/enums';

type Props = {
  resource: resources.TOPIC | resources.SUBJECT;
  name: string;
  showPlusButton?: boolean;
};

const SubjectTopicComponent = ({ resource, name, showPlusButton }: Props) => {
  const {
    potentialSubjects,
    subjects,
    setSubjects,
    potentialTopics,
    topics,
    setTopics,
  } = useStore();

  const addPotentialSubjectTopic = (e: any) => {
    const subjectTopicName =
      e.currentTarget.parentElement.parentElement.querySelector(
        '#subject-topic-name',
      ).textContent;

    if (resource === resources.SUBJECT) {
      const subject =
        potentialSubjects &&
        potentialSubjects.filter(
          (potentialSubject) => potentialSubject === subjectTopicName,
        )[0];
      const newSubjects = subjects || [];

      newSubjects.push(subject || subjectTopicName);
      setSubjects(newSubjects);
    } else if (resource === resources.TOPIC) {
      const topic =
        potentialTopics &&
        potentialTopics.filter(
          (potentialTopic) => potentialTopic === subjectTopicName,
        )[0];
      const newTopics = topics || [];

      newTopics.push(topic || subjectTopicName);
      setTopics(newTopics);
    }
  };

  return (
    <div className="flex justify-between items-center py-1 px-4 hover:bg-gray-100 fast-animate">
      <div className="flex flex-col items-start ml-12">
        <p id="subject-topic-name">{name}</p>
      </div>
      {showPlusButton && (
        <div className="flex gap-4">
          <div
            className="secondary-button h-8 w-12 flex justify-center items-center text-emerald-500 transition-colors hover:bg-emerald-100"
            onClick={(e) => addPotentialSubjectTopic(e)}
          >
            <PlusIcon height={20} width={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectTopicComponent;
