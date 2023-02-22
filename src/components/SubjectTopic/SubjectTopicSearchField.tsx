import React, { useEffect, useState } from 'react';
import useStore from '../../lib/store';
import SearchField from '../SearchField';
import SubjectTopicComponent from './SubjectTopicComponent';
import { resources } from '../../lib/enums';
import Loader from '../Loader';

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

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        if (isTopic) {
          // TODO Lara: topics query aufrufen
          const searchResultTopics: string[] = [
            'Vektoren',
            'Grammatik',
            'Lineare Algebra',
            'Hibernate',
          ];

          if (!potentialTopics) {
            // Save search result potential topics as a state
            setPotentialTopics(searchResultTopics);
          }

          setSearchPotentialTopicsLoading(false);
        } else {
          // TODO Lara: subjects query aufrufen
          const searchResultSubjects: string[] = [
            'Mathematik',
            'Deutsch',
            'Programmieren',
            'Statik',
            'Chemie',
          ];

          if (!potentialSubjects) {
            // Save search result potential subjects as a state
            setPotentialSubjects(searchResultSubjects);
          }

          setSearchPotentialSubjectsLoading(false);
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
          {potentialTopics && (
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
          {(isTopic && searchPotentialTopicsLoading) ||
          (!isTopic && searchPotentialSubjectsLoading) ? (
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
