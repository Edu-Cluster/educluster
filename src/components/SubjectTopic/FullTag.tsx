import React from 'react';
import useStore from '../../lib/store';
import { resources } from '../../lib/enums';

type Props = {
  resource: resources.SUBJECT | resources.TOPIC;
  name: string;
};

const FullTag = ({ resource, name }: Props) => {
  const { subjects, setSubjects, topics, setTopics } = useStore();

  const removeTag = () => {
    if (resource === resources.SUBJECT) {
      const newSubjects =
        subjects && subjects.filter((subject) => subject !== name);

      if (newSubjects) {
        setSubjects(newSubjects);
      }
    } else if (resource === resources.TOPIC) {
      const newTopics = topics && topics.filter((topic) => topic !== name);

      if (newTopics) {
        setTopics(newTopics);
      }
    }
  };

  return (
    <span
      onClick={removeTag}
      className="bg-sky-700 rounded-md cursor-default mb-2"
    >
      <p id={name} className="text-white p-2">
        {name}
      </p>
    </span>
  );
};

export default FullTag;
