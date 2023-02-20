import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { timeTypes } from '../../lib/enums';
import useStore from '../../lib/store';
import TimeSelectField from '../TimeSelectField';
import RegisteredSearchField from '../RegisteredSearchField';
import SelectField from '../SelectField';
import trpc from '../../lib/trpc';

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
  });

  const store = useStore();
  const equipmentQuery = trpc.useQuery(['catalog.equipment'], {
    enabled: false,
    onSuccess: async ({ data }) => {
      store.setEquipment(data.equipment.map((obj: { name: any }) => obj.name));
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const roomSizeQuery = trpc.useQuery(['catalog.roomsize'], {
    enabled: false,
    onSuccess: async ({ data }) => {
      store.setRoomSizesTerm(
        data.roomsizes.map((obj: { seatcount: any }) => obj.seatcount),
      );
      store.setRoomSizesMin(
        data.roomsizes.map((obj: { minimum: any }) => obj.minimum),
      );
      store.setRoomSizesMax(
        data.roomsizes.map((obj: { maximum: any }) => obj.maximum),
      );
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    equipmentQuery.refetch();
    roomSizeQuery.refetch();
  }, []);

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
                <>
                  {store.roomSizesTerm &&
                    store.roomSizesTerm.map((name: any, idx: any) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                </>
              </SelectField>
              <SelectField preselected="-" registerSelectName="equipment">
                <>
                  {store.equipment &&
                    store.equipment.map((name: any, idx: any) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                </>
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
