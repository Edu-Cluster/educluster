import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { resources, timeTypes } from '../../lib/enums';
import useStore from '../../lib/store';
import TimeSelectField from '../TimeSelectField';
import SearchField from '../SearchField';
import SubjectTopicComponent from '../SubjectTopic/SubjectTopicComponent';
import FullTag from '../SubjectTopic/FullTag';
import RegisteredSearchField from '../RegisteredSearchField';

type Props = {
  showResetButton: boolean;
};

const AppointmentFilterBox = ({ showResetButton }: Props) => {
  const {
    setAppointmentOfCluster,
    potentialSubjects,
    setPotentialSubjects,
    subjects,
    setSubjects,
    potentialTopics,
    setPotentialTopics,
    topics,
    setTopics,
  } = useStore();
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

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

  const resetAll = () => {
    setValue('timeFrom', '-1');
    setValue('timeTo', '-1');
    setValue('dateFrom', '');
    setValue('dateTo', '');

    setAppointmentOfCluster(null);
    setPotentialSubjects(null);
    setPotentialTopics(null);
    setSubjects(null);
    setTopics(null);

    // @ts-ignore
    document.querySelector('[name="subject-search"]').value = '';
    // @ts-ignore
    document.querySelector('[name="topic-search"]').value = '';
  };

  const onSubmit = handleSubmit(() => {
    // Reset some filters
    setPotentialSubjects(null);
    setPotentialTopics(null);
    // @ts-ignore
    document.querySelector('[name="subject-search"]').value = '';
    // @ts-ignore
    document.querySelector('[name="topic-search"]').value = '';

    // Get values from the input fields
    const { timeFrom, timeTo, dateFrom, dateTo } = getValues();

    // @ts-ignore
    const searchFieldValue = document.querySelector(
      '[name="appointment-search"]',
      // @ts-ignore
    ).value;

    // Query the database for matches using the filters and the text in the search field
    // TODO Lara (EC-96)

    // Set the appointments state with the matches
    // TODO Lara (EC-96)
  });

  const searchForSubjects = (e: any) => {
    if (e.currentTarget.value === '') {
      setPotentialSubjects(null);
      return;
    }

    // TODO Lara GET request an den Backend schicken, um user zu finden
    const searchResultSubjects: string[] = [
      'Mathematik',
      'Deutsch',
      'Programmieren',
      'Statik',
      'Chimie',
    ];

    if (!potentialSubjects) {
      // Save search result potential subjects as a state
      setPotentialSubjects(searchResultSubjects);
    }
  };

  const searchForTopics = (e: any) => {
    if (e.currentTarget.value === '') {
      setPotentialTopics(null);
      return;
    }

    // TODO Lara GET request an den Backend schicken, um user zu finden
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
  };

  return (
    <div className="h-fit w-full max-w-[800px] mt-2">
      <div className="flex flex-col gap-5">
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} id="appointment-search-form">
            <div className="flex flex-wrap sm:flex-nowrap justify-around gap-5">
              <div className="flex flex-col w-full">
                <span className="text-xs ml-1">Zeit von</span>
                <TimeSelectField
                  preselected="-"
                  registerSelectName="timeFrom"
                  timeType={timeTypes.FROM}
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs ml-1">Zeit bis</span>
                <TimeSelectField
                  preselected="-"
                  registerSelectName="timeTo"
                  timeType={timeTypes.TO}
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs ml-1">Datum von</span>
                <RegisteredSearchField
                  noIcon={true}
                  type="date"
                  registerInputName="dateFrom"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs ml-1">Datum bis</span>
                <RegisteredSearchField
                  noIcon={true}
                  type="date"
                  registerInputName="dateTo"
                />
              </div>
            </div>
          </form>
        </FormProvider>
        <div className="flex flex-wrap sm:flex-nowrap justify-around gap-5">
          <div className="w-full flex flex-col">
            <SearchField
              placeholder="Fach eingeben"
              noIcon={true}
              name="subject-search"
              onChangeHandler={searchForSubjects}
            />
            {potentialSubjects && (
              <div className="w-full h-fit divide-y max-h-[635px] bg-gray-50 overflow-y-auto mt-2">
                {potentialSubjects.map((potentialSubject, idx) => (
                  <SubjectTopicComponent
                    key={idx}
                    resource={resources.SUBJECT}
                    name={potentialSubject}
                    showPlusButton={
                      !matchingSubjects.some(
                        (subject) => subject === potentialSubject,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
          <div className="w-full flex flex-col">
            <SearchField
              placeholder="Thema eingeben"
              noIcon={true}
              name="topic-search"
              onChangeHandler={searchForTopics}
            />
            {potentialTopics && (
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
        </div>
        {subjects && subjects.length ? (
          <div className="flex flex-wrap gap-2 w-full">
            <p className="mr-2 text-cyan-700 dark:text-cyan-700">Fächer</p>
            {subjects.map((subject, idx) => (
              <FullTag key={idx} resource={resources.SUBJECT} name={subject} />
            ))}
          </div>
        ) : (
          <></>
        )}
        {topics && topics.length ? (
          <div className="flex flex-wrap gap-2 w-full">
            <p className="text-cyan-700 dark:text-cyan-700">Themen</p>
            {topics.map((topic, idx) => (
              <FullTag key={idx} resource={resources.TOPIC} name={topic} />
            ))}
          </div>
        ) : (
          <></>
        )}
        <button
          aria-label="Alle Filter übernehmen"
          className="w-full h-16 primary-button"
          type="submit"
          form="appointment-search-form"
        >
          Alle Filter übernehmen
        </button>
        {showResetButton && (
          <button
            aria-label="Alles zurücksetzen"
            className="w-full h-16 primary-button bg-red-400 hover:bg-red-500"
            onClick={() => resetAll()}
          >
            Alles zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentFilterBox;
