import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
} from '@heroicons/react/outline';
import useStore from '../client/store';

const ButtonGroup = () => {
  const { editMode, setEditMode } = useStore();

  return (
    <div className="flex flex-col gap-4">
      {!editMode ? (
        <>
          <div
            className="secondary-button h-12 w-52 flex justify-center items-center text-violet-500 transition-colors hover:bg-violet-100"
            onClick={() => setEditMode(!editMode)}
          >
            <p className="mr-2 text-violet-500">Cluster Bearbeiten</p>
            <PencilIcon height={25} width={25} />
          </div>
          <div className="secondary-button h-12 w-52 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100">
            <p className="mr-2 text-red-500">Cluster Löschen</p>
            <TrashIcon height={25} width={25} />
          </div>
        </>
      ) : (
        <>
          <div
            className="secondary-button h-12 w-52 flex justify-center items-center text-amber-500 transition-colors hover:bg-amber-100"
            onClick={() => setEditMode(false)}
          >
            <p className="mr-2 text-amber-500">Speichern</p>
            <SaveIcon height={25} width={25} />
          </div>
          <div
            className="secondary-button h-12 w-52 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100"
            onClick={() => setEditMode(false)}
          >
            <p className="mr-2 text-red-500">Abbrechen</p>
            <XIcon height={25} width={25} />
          </div>
        </>
      )}
    </div>
  );
};

export default ButtonGroup;
