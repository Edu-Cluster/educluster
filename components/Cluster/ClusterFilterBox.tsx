import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { timeTypes } from '../../lib/enums';
import useStore from '../../client/store';
import TimeSelectField from '../TimeSelectField';
import RegisteredSearchField from '../RegisteredSearchField';

type Props = {
  showResetButton: boolean;
};

const ClusterFilterBox = ({ showResetButton }: Props) => {
  const { setClusterOfUser } = useStore();
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const resetAll = () => {
    setValue('timeFrom', '-1');
    setValue('timeTo', '-1');
    setValue('dateFrom', '');
    setValue('dateTo', '');

    // @ts-ignore
    document.querySelector('[name="cluster-search"]').value = '';

    setClusterOfUser(null);
  };

  const onSubmit = handleSubmit(() => {
    // Get values from the input fields
    const { timeFrom, timeTo, dateFrom, dateTo } = getValues();

    // @ts-ignore
    const searchFieldValue = document.querySelector(
      '[name="cluster-search"]',
      // @ts-ignore
    ).value;

    // Query the database for matches using the filters and the text in the search field
    // TODO Lara
  });

  return (
    <div className="h-fit w-full max-w-[800px] mt-8">
      <div className="flex flex-col gap-5">
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} id="cluster-search-form">
            <div className="flex flex-wrap sm:flex-nowrap justify-around gap-5">
              <TimeSelectField
                preselected="-"
                registerSelectName="timeFrom"
                timeType={timeTypes.FROM}
              />
              <TimeSelectField
                preselected="-"
                registerSelectName="timeTo"
                timeType={timeTypes.TO}
              />
              <RegisteredSearchField
                noIcon={true}
                type="date"
                registerInputName="dateFrom"
              />
              <RegisteredSearchField
                noIcon={true}
                type="date"
                registerInputName="dateTo"
              />
            </div>
          </form>
        </FormProvider>
        <button
          aria-label="Alle Filter übernehmen"
          className="w-full h-16 primary-button"
          type="submit"
          form="cluster-search-form"
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

export default ClusterFilterBox;
