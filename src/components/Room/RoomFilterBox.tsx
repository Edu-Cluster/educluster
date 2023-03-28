import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { resources, timeTypes } from '../../lib/enums';
import useStore from '../../lib/store';
import TimeSelectField from '../TimeSelectField';
import RegisteredSearchField from '../RegisteredSearchField';
import RegisteredSelectField from '../RegisteredSelectField';
import trpc from '../../lib/trpc';
import toast from 'react-hot-toast';
import FullTag from '../SubjectTopic/FullTag';

type Props = {
  showResetButton: boolean;
  showSummary?: string | null;
};

const RoomFilterBox = ({ showResetButton, showSummary }: Props) => {
  const store = useStore();
  const [newFromDate, setNewFromDate] = useState(null);
  const [newToDate, setNewToDate] = useState(null);
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  // @ts-ignore
  const params = new URL(document.location).searchParams;
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
    const now = new Date();
    const hours = now.getHours().toString();
    let minutes = now.getMinutes().toString();

    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }

    const timeNow = `${hours}${minutes}`;
    const dateNow = new Date();
    const dateNowDay =
      dateNow.getDate().toString().length === 1
        ? `0${dateNow.getDate()}`
        : dateNow.getDate();
    const dateNowMonth =
      (dateNow.getMonth() + 1).toString().length === 1
        ? `0${dateNow.getMonth() + 1}`
        : dateNow.getMonth() + 1;
    const dateNowString = `${dateNow.getFullYear()}-${dateNowMonth}-${dateNowDay}`;

    if (
      timeFrom === '-1' ||
      timeTo === '-1' ||
      Number(timeFrom) > Number(timeTo) ||
      (newFromDate === dateNowString &&
        (Number(timeNow) > Number(timeFrom) ||
          Number(timeNow) > Number(timeTo)))
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

  const createNewAppointment = () => {
    const { timeFrom, timeTo } = getValues();
    const date =
      (store.appointmentDateSelected as string) ||
      (newFromDate as unknown as string);
    const roomname = store.appointmentRoomSelected;

    createAppointmentMutation({
      name: params.get('name') as string,
      description: params.get('description') as string,
      subject: params.get('subject') as string,
      topics: params.get('tags')?.split(',') as string[],
      clusterId: Number(params.get('cluster')),
      timeFrom,
      timeTo,
      date,
      roomname,
    });
  };

  const { mutate: createAppointmentMutation } = trpc.useMutation(
    ['item.createAppointment'],
    {
      retry: 0,
      onSuccess: ({ data }) => {
        document.location.href = `../../termin/${data.name}*${data.id}`;
      },
      onError: (err) => {
        toast.error(
          'Leider ist ein Fehler beim Erstellen dieses Termins aufgetreten!',
        );
        console.error(err);
      },
    },
  );

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
      onError: (err) => {
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

  if (!!showSummary) {
    return (
      <div className="h-fit w-full max-w-[800px]">
        <h1 className="text-[30px] md:text-[40px] screen-xxl:text-[60px] text-gray-700 dark:text-gray-100 mb-10 text-center">
          Terminübersicht
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Bezeichnung: </p>
            <p className="text-2xl">{params?.get('name')}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Beschreibung: </p>
            <p className="text-2xl">{params?.get('description')}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Raum: </p>
            <p className="text-2xl">{store.appointmentRoomSelected}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Datum: </p>
            <p className="text-2xl">
              {store.appointmentDateSelected
                ? `${store.appointmentDateSelected
                    .toString()
                    .slice(0, 4)}-${store.appointmentDateSelected
                    .toString()
                    .slice(4, 6)}-${store.appointmentDateSelected
                    .toString()
                    .slice(6, 8)}`
                : newFromDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Zeitrahmen: </p>
            <p className="text-2xl">
              {getValues().timeFrom.length === 3
                ? `${getValues().timeFrom.slice(
                    0,
                    1,
                  )}:${getValues().timeFrom.slice(1, 3)}`
                : `${getValues().timeFrom.slice(
                    0,
                    2,
                  )}:${getValues().timeFrom.slice(2, 4)}`}{' '}
              -{' '}
              {getValues().timeTo.length === 3
                ? `${getValues().timeTo.slice(0, 1)}:${getValues().timeTo.slice(
                    1,
                    3,
                  )}`
                : `${getValues().timeTo.slice(0, 2)}:${getValues().timeTo.slice(
                    2,
                    4,
                  )}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Fach: </p>
            <p className="text-2xl">{params?.get('subject')}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Themen: </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {params
                .get('tags')
                ?.split(',')
                ?.map((topic, idx) => (
                  <FullTag key={idx} resource={resources.TOPIC} name={topic} />
                ))}
            </div>
          </div>
          <button
            className="primary-button w-80 h-16 mt-10 bg-emerald-500 hover:bg-emerald-700"
            onClick={createNewAppointment}
          >
            Lerneinheit erstellen
          </button>
          <button
            className="primary-button w-80 h-16 bg-red-500 hover:bg-red-700"
            onClick={() => {
              document.location.href = '/';
            }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

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
