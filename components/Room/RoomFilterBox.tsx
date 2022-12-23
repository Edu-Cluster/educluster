import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { timeTypes } from '../../lib/enums';
import useStore from '../../client/store';
import TimeSelectField from '../TimeSelectField';
import RegisteredSearchField from '../RegisteredSearchField';
import SelectField from '../SelectField';

type Props = {
  showResetButton: boolean;
};

const RoomFilterBox = ({ showResetButton }: Props) => {
  const { setRooms } = useStore();
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const resetAll = () => {
    setValue('timeFrom', '-1');
    setValue('timeTo', '-1');
    setValue('dateFrom', '');
    setValue('dateTo', '');
    setValue('personCount', '-1');
    setValue('equipment', '-1');

    // @ts-ignore
    document.querySelector('[name="room-search"]').value = '';

    setRooms(null);
  };

  const onSubmit = handleSubmit(() => {
    // Get values from the input fields
    const { timeFrom, timeTo, dateFrom, dateTo, personCount, equipment } =
      getValues();

    // @ts-ignore
    const searchFieldValue = document.querySelector(
      '[name="room-search"]',
      // @ts-ignore
    ).value;

    // Query the database for matches using the filters and the text in the search field
    // TODO Lara
  });

  return (
    <div className="h-fit w-full max-w-[800px] mt-8">
      <FormProvider {...methods}>
        <div className="flex flex-col gap-5">
          <form onSubmit={onSubmit} id="room-search-form">
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
            <div className="flex flex-wrap sm:flex-nowrap justify-around gap-5 mt-5">
              <SelectField preselected="-" registerSelectName="personCount">
                <option value="1">1-10 Sitzplätze</option>
                <option value="10">11-20 Sitzplätze</option>
                <option value="20">21-30 Sitzplätze</option>
                <option value="30">{'>'} 31 Sitzplätze</option>
              </SelectField>
              <SelectField preselected="-" registerSelectName="equipment">
                <option value="Tafel">Tafel</option>
                <option value="Beamer">Beamer</option>
                <option value="Tafel&Beamer">Tafel und Beamer</option>
              </SelectField>
            </div>
          </form>
          <button
            aria-label="Alle Filter übernehmen"
            className="w-full h-16 primary-button"
            type="submit"
            form="room-search-form"
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
      </FormProvider>
    </div>
  );
};

export default RoomFilterBox;
