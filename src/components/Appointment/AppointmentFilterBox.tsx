import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { resources, timeTypes } from '../../lib/enums';
import useStore from '../../lib/store';
import TimeSelectField from '../TimeSelectField';
import FullTag from '../SubjectTopic/FullTag';
import RegisteredSearchField from '../RegisteredSearchField';
import SubjectTopicSearchField from '../SubjectTopic/SubjectTopicSearchField';
import ItemListHeader from '../Item/ItemListHeader';
import trpc from '../../lib/trpc';

type Props = {
  showResetButton: boolean;
};

const AppointmentFilterBox = ({ showResetButton }: Props) => {
  const {
    setAppointments,
    setPotentialSubjects,
    subjects,
    setSubjects,
    setPotentialTopics,
    topics,
    setTopics,
    setSearchItemsLoading,
  } = useStore();
  const [newFromDate, setNewFromDate] = useState(null);
  const [newToDate, setNewToDate] = useState(null);
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const resetAll = () => {
    setValue('timeFrom', '-1');
    setValue('timeTo', '-1');
    setValue('dateFrom', '');
    setValue('dateTo', '');

    setAppointments(null);
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
    // Get values from the input fields
    const { timeFrom, timeTo } = getValues();

    // @ts-ignore
    const searchFieldValue = document.querySelector(
      '[name="appointment-search"]',
      // @ts-ignore
    ).value;

    // Query the database for matches using the filters and the text in the search field
    advancedSearchQuery({
      name: searchFieldValue === '' ? null : searchFieldValue,
      timeFrom: timeFrom === '-1' ? null : timeFrom,
      timeTo: timeTo === '-1' ? null : timeTo,
      dateFrom: newFromDate || null,
      dateTo: newToDate || null,
      topics: topics || null,
      subject: subjects || null,
    });

    // Reset some filters
    setPotentialSubjects(null);
    setPotentialTopics(null);
    // @ts-ignore
    document.querySelector('[name="subject-search"]').value = '';
    // @ts-ignore
    document.querySelector('[name="topic-search"]').value = '';
  });

  const { mutate: advancedSearchQuery } = trpc.useMutation(
    ['item.advancedAppointments'],
    {
      retry: 0,
      onSuccess: ({ data }) => {
        // Save search result appointments as state
        setAppointments(data.appointments);
        setSearchItemsLoading(false);
      },
      onError: async (err) => {
        setAppointments(null);
        setSearchItemsLoading(false);
        console.error(err);
      },
    },
  );

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
                  onChangeHandler={(e: any) => setNewFromDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs ml-1">Datum bis</span>
                <RegisteredSearchField
                  noIcon={true}
                  type="date"
                  registerInputName="dateTo"
                  onChangeHandler={(e: any) => setNewToDate(e.target.value)}
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
