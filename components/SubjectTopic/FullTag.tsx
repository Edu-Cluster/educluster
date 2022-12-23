import React from 'react';
import useStore from '../../client/store';
import { resources } from '../../lib/enums';

type Props = {
  resource: resources.SUBJECT | resources.TOPIC;
  name: string;
};

const FullTag = ({ resource, name }: Props) => {
  const { subjects, setSubjects, topics, setTopics } = useStore();

  const removeTag = (e: any) => {
    const tagName = e.currentTarget.parentElement.parentElement.querySelector(
      `#${name}`,
    ).textContent;

    if (resource === resources.SUBJECT) {
      const newSubjects =
        subjects && subjects.filter((subject) => subject !== tagName);

      if (newSubjects) {
        setSubjects(newSubjects);
      }
    } else if (resource === resources.TOPIC) {
      const newTopics = topics && topics.filter((topic) => topic !== tagName);

      if (newTopics) {
        setTopics(newTopics);
      }
    }
  };

  return (
    <span
      onClick={(e) => removeTag(e)}
      className="bg-sky-700 text-center rounded-md w-fit cursor-default mb-2"
    >
      <p id={name} className="text-white p-2">
        {name}
      </p>
    </span>
  );
};

export default FullTag;
