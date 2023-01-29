import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import trpc from '../../lib/trpc';
import { User } from '../../lib/types';
import useStore from '../../lib/store';
import { statusCodes } from '../../lib/enums';
import Loader from '../../components/Loader';
import RegisteredSearchField from '../../components/RegisteredSearchField';
import RegisteredTextArea from '../../components/RegisteredTextArea';

const CreateClusterPage: NextPage = () => {
  const store = useStore();
  const [isSliderOn, setSliderOn] = useState(false);
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      store.setAuthUser(data.user as User);
    },
    onError: (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  const { mutate: createClusterMutation } = trpc.useMutation(
    ['item.createCluster'],
    {
      onSuccess: ({ data, status }) => {
        if (status === statusCodes.SUCCESS && data) {
          const { clustername } = getValues();
          document.location.href = `./${clustername}*${data.id}`;
        } else if (status === statusCodes.FAILURE) {
          toast.error('Ein Cluster mit diesen Namen existiert bereits!');
        }
      },
      onError: (err) => {
        console.error(err);
        setValue('clustername', '');
        setValue('description', '');
      },
    },
  );

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();
  }, []);

  const onSubmit = handleSubmit(() => {
    // Get values from the input fields
    const { clustername, description } = getValues();

    // Block the use of special characters
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(clustername)) {
      toast.error('Clustername darf nur alphanumerische Zeichen enthalten!');
      return;
    }

    // Call mutation to create new cluster
    createClusterMutation({ clustername, description, isPrivate: isSliderOn });
  });

  if (userQuery.isSuccess) {
    return (
      <main className="flex w-full h-[90vh] mt-[-2rem] flex-1 flex-col items-center justify-center px-5 md:px-20">
        <div className="h-full md:h-[600px] w-full sm:w-[80%] lg:w-[50%] input-mask px-4">
          <div className="flex justify-center align-items mt-12 mb-8 text-center">
            <h1 className="text-[30px] md:text-[40px] screen-xxl:text-[60px] text-gray-700 dark:text-gray-100">
              Neues Cluster Erstellen
            </h1>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} id="create-cluster-form">
              <div className="flex items-center justify-center w-full h-full flex-col gap-8">
                <RegisteredSearchField
                  registerInputName="clustername"
                  name="clustername"
                  type="text"
                  maxLength={20}
                  minLength={5}
                  required={true}
                  placeholder="Clustername"
                  noIcon={true}
                />
                <RegisteredTextArea
                  registerInputName="description"
                  name="description"
                  maxLength={100}
                  placeholder="Beschreibung"
                  height="40"
                />
                <div className="flex items-center text-center mt-6">
                  <span
                    className={`text-md mr-5 flex-1 ${
                      isSliderOn
                        ? 'text-gray-400 line-through'
                        : 'text-[#546de5]'
                    }`}
                  >
                    Öffentlich
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={() => setSliderOn((prevState) => !prevState)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span
                    className={`text-md ml-5 flex-1 ${
                      !isSliderOn
                        ? 'text-gray-400 line-through'
                        : 'text-[#546de5]'
                    }`}
                  >
                    Privat
                  </span>
                </div>
              </div>
            </form>
          </FormProvider>
          <div className="flex justify-center align-items mt-12">
            <button
              aria-label="Cluster erstellen"
              className="w-[80%] lg:w-[40%] h-16 primary-button"
              type="submit"
              form="create-cluster-form"
            >
              Cluster erstellen
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <Loader type="main" size={100} />;
};

export default CreateClusterPage;
