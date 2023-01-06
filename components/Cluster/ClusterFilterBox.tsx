import React from 'react';
import { useForm } from 'react-hook-form';
import useStore from '../../client/store';

type Props = {
  showResetButton: boolean;
};

const ClusterFilterBox = ({ showResetButton }: Props) => {
  const { setClusterOfUser } = useStore();
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const resetAll = () => {
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

    // Set the cluster state with the matches
    // TODO Lara
  });

  return (
    <div className="h-fit w-full max-w-[800px] mt-8">
      <div className="flex flex-col gap-5">
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
