import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { resources, timeTypes } from '../../lib/enums';
import useStore from '../../lib/store';
import TimeSelectField from '../TimeSelectField';
import FullTag from '../SubjectTopic/FullTag';
import RegisteredSearchField from '../RegisteredSearchField';
import SubjectTopicSearchField from '../SubjectTopic/SubjectTopicSearchField';
import ItemListHeader from '../Item/ItemListHeader';

type Props = {
  showResetButton: boolean;
};

const AppointmentFilterBox = ({ showResetButton }: Props) => {
  const {
    setAppointmentOfCluster,
    setPotentialSubjects,
    subjects,
    setSubjects,
    setPotentialTopics,
    topics,
    setTopics,
  } = useStore();
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

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
          <SubjectTopicSearchField resource={resources.SUBJECT} />
          <SubjectTopicSearchField resource={resources.TOPIC} />
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
          <div className="mt-4">
            <ItemListHeader title="Themen" />
            <div className="flex flex-wrap gap-2 mt-4">
              {topics.map((topic, idx) => (
                <FullTag key={idx} resource={resources.TOPIC} name={topic} />
              ))}
            </div>
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
