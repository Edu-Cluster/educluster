import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { timeTypes } from '../../lib/enums';
import useStore from '../../lib/store';
import TimeSelectField from '../TimeSelectField';
import RegisteredSearchField from '../RegisteredSearchField';
import RegisteredSelectField from '../RegisteredSelectField';
import trpc from '../../lib/trpc';
import toast from 'react-hot-toast';

type Props = {
  showResetButton: boolean;
};

const RoomFilterBox = ({ showResetButton }: Props) => {
  const store = useStore();
  const [newFromDate, setNewFromDate] = useState(null);
  const [newToDate, setNewToDate] = useState(null);
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const maxDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  const maxDateDay =
    maxDate.getDate().toString().length === 1
      ? `0${maxDate.getDate()}`
      : maxDate.getDate();
  const maxDateMonth =
    (maxDate.getMonth() + 1).toString().length === 1
      ? `0${maxDate.getMonth() + 1}`
      : maxDate.getMonth() + 1;
  const maxDateString = `${maxDate.getFullYear()}-${maxDateMonth}-${maxDateDay}`;

  const minDate = new Date();
  const minDateDay =
    minDate.getDate().toString().length === 1
      ? `0${minDate.getDate()}`
      : minDate.getDate();
  const minDateMonth =
    (minDate.getMonth() + 1).toString().length === 1
      ? `0${minDate.getMonth() + 1}`
      : minDate.getMonth() + 1;
  const minDateString = `${minDate.getFullYear()}-${minDateMonth}-${minDateDay}`;

  const resetAll = () => {
    setValue('timeFrom', '-1');
    setValue('timeTo', '-1');
    setValue('dateFrom', '');
    setValue('dateTo', '');
    setValue('personCount', '-1');
    setValue('equipment', '-1');

    store.setRooms(null);
  };

  const onSubmit = handleSubmit(async () => {
    store.setSearchItemsLoading(true);
    store.setRooms(null);

    // Get values from the input fields
    const { timeFrom, timeTo, personCount, equipment } = getValues();

    if (
      timeFrom === '-1' ||
      timeTo === '-1' ||
      Number(timeFrom) > Number(timeTo)
    ) {
      toast.error('Bitte wählen Sie einen validen Zeitrahmen aus!');
      store.setSearchItemsLoading(false);
      return;
    }

    if (!newFromDate || !newToDate) {
      toast.error('Ein Problem mit dem Datum ist aufgetreten!');
      store.setSearchItemsLoading(false);
      return;
    }

    const fromDate = new Date(newFromDate as string);
    const toDate = new Date(newToDate as string);

    if (!fromDate || !toDate) {
      toast.error('Ein Problem mit dem Datum ist aufgetreten!');
      store.setSearchItemsLoading(false);
      return;
    }

    fromDate.setMinutes(timeFrom.slice(timeFrom.length - 2, timeFrom.length));
    fromDate.setHours(timeFrom.slice(0, timeFrom.length - 2));

    toDate.setMinutes(timeTo.slice(timeTo.length - 2, timeTo.length));
    toDate.setHours(timeTo.slice(0, timeTo.length - 2));

    const sizeMin =
      personCount === '-1' ? 0 : Number(personCount.split('-')[0]);
    const sizeMax =
      personCount === '-1' ? 0 : Number(personCount.split('-')[1]);

    specificRoomsMutation({
      sizeMin,
      sizeMax,
      to: toDate,
      from: fromDate,
      equipment: equipment === '-1' ? '' : equipment,
    });
  });

  const { mutate: specificRoomsMutation } = trpc.useMutation(
    ['item.specificRooms'],
    {
      retry: 0,
      onSuccess: ({ data }) => {
        // Save search result rooms as state
        store.setRooms(data.rooms);
        store.setSearchItemsLoading(false);

        if (data.availabilities) {
          store.setRoomAvailabilities(data.availabilities);
        }
      },
      onError: async (err) => {
        store.setRooms(null);
        store.setSearchItemsLoading(false);
        console.error(err);
      },
    },
  );

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
                registerSelectName="timeFrom"
                timeType={timeTypes.FROM}
                required={true}
                preselected="-"
              />
              <TimeSelectField
                registerSelectName="timeTo"
                timeType={timeTypes.TO}
                required={true}
                preselected="-"
              />
              <RegisteredSearchField
                noIcon={true}
                type="date"
                registerInputName="dateFrom"
                required={true}
                onChangeHandler={(e: any) => setNewFromDate(e.target.value)}
                max={maxDateString}
                min={minDateString}
              />
              <RegisteredSearchField
                noIcon={true}
                type="date"
                registerInputName="dateTo"
                required={true}
                onChangeHandler={(e: any) => setNewToDate(e.target.value)}
                max={maxDateString}
                min={minDateString}
              />
            </div>
            <div className="flex flex-wrap sm:flex-nowrap justify-around gap-5 mt-5">
              <RegisteredSelectField
                preselected="-"
                registerSelectName="personCount"
              >
                <>
                  {store.roomSizesTerm &&
                    store.roomSizesTerm.map((name: any, idx: any) => (
                      <option
                        key={idx}
                        value={`${store.roomSizesMin[idx]}-${store.roomSizesMax[idx]}`}
                      >
                        {name}
                      </option>
                    ))}
                </>
              </RegisteredSelectField>
              <RegisteredSelectField
                preselected="-"
                registerSelectName="equipment"
              >
                <>
                  {store.equipment &&
                    store.equipment.map((name: any, idx: any) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                </>
              </RegisteredSelectField>
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
