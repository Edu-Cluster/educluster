import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import trpc from '../../client/trpc';
import { User } from '../../lib/types';
import useStore from '../../client/store';

const CreateClusterPage: NextPage = () => {
  const store = useStore();

  const [clusterName, setClusterName] = useState();
  const [isSliderOn, setSliderOn] = useState(false);
  const { register, setValue, getValues, handleSubmit } = useForm();

  const query = trpc.useQuery(['user.me'], {
    enabled: false,
    onSuccess: ({ data }) => {
      store.setAuthUser(data.user as User);
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '../login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    query.refetch();
  }, []);

  // TODO Lara: Mutation definieren und bei onSuccess await router.push(`./${clusterName}`);

  const onSubmit = handleSubmit(() => {
    // Get values from the input fields
    const { clustername, description } = getValues();

    setClusterName(clustername);

    toast.loading('Ihr Cluster wird erstellt...');

    // Send login POST request to items router
    // TODO Lara endpoint mit mutation aufrufen (isSliderOn = öffentliches oder privates Cluster)
  });

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-5 md:px-20 mt-32">
      <div className="h-[70%] w-full sm:w-[80%] lg:w-[50%] rounded-lg input-mask px-4">
        <div className="flex justify-center align-items mt-24 text-center">
          <h1 className="text-[40px] text-gray-700">Neues Cluster Erstellen</h1>
        </div>
        <form onSubmit={onSubmit} id="create-cluster-form">
          <div className="flex items-center justify-center w-full h-full flex-col">
            <div className="input-box">
              <input
                {...register('clustername', { required: true })}
                name="clustername"
                type="text"
                maxLength={20}
                required
              />
              <span>Clustername</span>
            </div>
            <div className="input-box mt-6">
              <input
                {...register('description', { required: true })}
                name="description"
                type="text"
                maxLength={80}
                required
              />
              <span>Beschreibung</span>
            </div>
            <div className="flex items-center text-center mt-6">
              <span
                className={`text-md mr-5 ${
                  isSliderOn ? 'text-gray-400 line-through' : 'text-[#546de5]'
                }`}
              >
                Öffentliches Cluster
              </span>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={() => setSliderOn((prevState) => !prevState)}
                />
                <span className="slider round"></span>
              </label>
              <span
                className={`text-md ml-5 ${
                  !isSliderOn ? 'text-gray-400 line-through' : 'text-[#546de5]'
                }`}
              >
                Privates Cluster
              </span>
            </div>
          </div>
        </form>
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
};

export default CreateClusterPage;
