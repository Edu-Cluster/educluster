import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import trpc from '../../../lib/trpc';
import { User } from '../../../lib/types';
import useStore from '../../../lib/store';
import { clusterAssociations, resources, timeTypes } from '../../../lib/enums';
import ClusterBanner from '../../../components/Cluster/ClusterBanner';
import Loader from '../../../components/Loader';
import RegisteredSearchField from '../../../components/RegisteredSearchField';
import RegisteredTextArea from '../../../components/RegisteredTextArea';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import RegisteredSelectField from '../../../components/RegisteredSelectField';
import ItemListHeader from '../../../components/Item/ItemListHeader';
import TopicsPalette from '../../../components/SubjectTopic/TopicsPalette';
import FullTag from '../../../components/SubjectTopic/FullTag';
import TimeSelectField from '../../../components/TimeSelectField';

const AdminClusterPage: NextPage = () => {
  const router = useRouter();
  const {
    setAuthUser,
    setClusterDetails,
    setClusterAssociation,
    subjects,
    setSubjects,
    topics,
    setTopics,
  } = useStore();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isRoomless, setIsRoomless] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const methods = useForm();
  const { getValues, handleSubmit } = methods;
  let { clustername } = router.query;

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

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();

    // Reset topics state
    setTopics(null);

    if (Array.isArray(clustername)) {
      clustername = clustername[0];
    }

    if (clustername && !clustername.includes('*')) {
      document.location.href = '/404';
    }
  }, []);

  const clusterId =
    clustername && Number((clustername as string).split('*')[1]);
  const clusterDetailsQuery = trpc.useQuery(
    // @ts-ignore
    ['item.clusterDetails', clusterId],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        if (data) {
          setClusterDetails(data.clusterDetails);
        }
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const clusterAssociationQuery = trpc.useQuery(
    ['item.clusterAssociation', clusterId as number],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        if (data) {
          if (data.association !== clusterAssociations.IS_ADMIN) {
            document.location.href = './';
          }

          setClusterAssociation(data.association);
        }
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: async ({ data }) => {
      setAuthUser(data.user as User);

      // Fetch cluster association
      await clusterAssociationQuery.refetch();

      // Fetch cluster details
      await clusterDetailsQuery.refetch();

      // Fetch all subjects
      await findAllSubjectsQuery.refetch();
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

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

  const findAllSubjectsQuery = trpc.useQuery(['catalog.allSubjects'], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      setSubjects(data.subjects);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = handleSubmit(() => {
    // Get values from the input fields
    const { appointmentname, description, subject } = getValues();

    if (subject === '-1' || !topics || !topics.length) {
      toast.error('Bitte wählen sie einen Fach und zumindest ein Thema aus!');
      return;
    }

    const tags = topics?.join(',');

    // Block the use of special characters
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~´]/;

    if (format.test(appointmentname)) {
      toast.error(
        'Die Terminbezeichnung darf nur alphanumerische Zeichen enthalten!',
      );
      return;
    }

    if (isRoomless) {
      const { timeFrom, timeTo } = getValues();

      if (
        timeFrom === '-1' ||
        timeTo === '-1' ||
        Number(timeFrom) > Number(timeTo) ||
        !newDate
      ) {
        toast.error('Bitte wählen Sie einen validen Zeitrahmen aus!');
        return;
      }

      createAppointmentMutation({
        clusterId: clusterId as number,
        name: appointmentname,
        date: newDate as string,
        roomname: null,
        description,
        timeFrom,
        topics,
        timeTo,
        subject,
      });
    } else {
      // Redirect to room search page with data as query params
      document.location.href = `../../../raum/suche?name=${appointmentname}&description=${description}&subject=${subject}&tags=${tags}&cluster=${clusterId}`;
    }
  });

  const onSubjectChange = (val: any) => {
    if (val === '-' || val === '-1') {
      val = null;
    }

    setSelectedSubject(val);
  };

  if (clusterDetailsQuery.isSuccess) {
    return (
      <main className="page-default flex-wrap screen-xxl:flex-nowrap">
        <div className="list-container flex-wrap gap-10 screen-xxxl:flex-nowrap screen-xxxl:gap-0">
          <div className="min-h-[600px] w-full max-w-[800px] input-mask px-4">
            <div className="flex justify-center align-items mt-12 mb-8 text-center">
              <h1 className="text-[30px] md:text-[40px] text-gray-700 dark:text-gray-100">
                Neue Lerneinheit
              </h1>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} id="create-appointment-form">
                <div className="flex items-center justify-center w-full h-full flex-col gap-8">
                  <RegisteredSearchField
                    registerInputName="appointmentname"
                    name="appointmentname"
                    type="text"
                    maxLength={20}
                    minLength={5}
                    required={true}
                    placeholder="Terminbezeichnung"
                    noIcon={true}
                  />
                  <RegisteredTextArea
                    registerInputName="description"
                    name="description"
                    maxLength={100}
                    placeholder="Beschreibung"
                    height="40"
                  />
                  <div className="flex flex-col w-full">
                    <span className="text-xs ml-1">Typ</span>
                    <RegisteredSelectField
                      preselected="mit Raum"
                      registerSelectName="room"
                      onChangeHandler={() => setIsRoomless(!isRoomless)}
                    >
                      <option value="1">ohne Raum</option>
                    </RegisteredSelectField>
                  </div>
                  {isRoomless ? (
                    <>
                      <div className="flex flex-col w-full">
                        <span className="text-xs ml-1">Datum</span>
                        <RegisteredSearchField
                          noIcon={true}
                          type="date"
                          registerInputName="dateFrom"
                          onChangeHandler={(e: any) =>
                            setNewDate(e.target.value)
                          }
                          min={minDateString}
                        />
                      </div>
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
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="flex flex-col w-full">
                    <span className="text-xs ml-1">Fach</span>
                    <RegisteredSelectField
                      preselected="-"
                      registerSelectName="subject"
                      onChangeHandler={onSubjectChange}
                    >
                      {subjects &&
                        subjects.map((subject, idx) => (
                          <option key={idx} value={subject}>
                            {subject}
                          </option>
                        ))}
                    </RegisteredSelectField>
                  </div>
                </div>
              </form>
            </FormProvider>
            {topics && topics.length ? (
              <div className="mt-8">
                <ItemListHeader title="Themen" />
                <div className="flex flex-wrap gap-2 mt-4">
                  {topics.map((topic, idx) => (
                    <FullTag
                      resource={resources.TOPIC}
                      name={topic}
                      key={idx}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="flex justify-center align-items mt-12">
              <button
                aria-label="Lerneinheit erstellen"
                className=" h-16 primary-button w-80"
                type="submit"
                form="create-appointment-form"
              >
                {isRoomless
                  ? 'Lerneinheit erstellen'
                  : 'Weiter zur Raumselektion'}
              </button>
            </div>
          </div>

          <div className="w-full lg:min-w-[400px] mt-16 flex flex-col gap-4">
            <TopicsPalette subject={selectedSubject} />
          </div>
        </div>

        <ClusterBanner isNotMainPage={true} />
      </main>
    );
  }

  return <Loader type="main" size={80} />;
};

export default AdminClusterPage;
