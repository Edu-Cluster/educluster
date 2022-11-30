import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
  UserAddIcon,
  ArrowNarrowLeftIcon,
} from '@heroicons/react/outline';
import useStore from '../client/store';

const ButtonGroup = () => {
  const { editMode, setEditMode } = useStore();

  return (
    <div className="flex flex-col gap-4">
      {!editMode ? (
        <>
          <div className="cluster-button text-blue-500 hover:bg-blue-100">
            <p className="mr-2 text-blue-500">Mitglieder einladen</p>
            <UserAddIcon height={25} width={25} />
          </div>
          <div
            className="cluster-button text-violet-500 hover:bg-violet-100"
            onClick={() => setEditMode(!editMode)}
          >
            <p className="mr-2 text-violet-500">Cluster bearbeiten</p>
            <PencilIcon height={25} width={25} />
          </div>
          <div className="cluster-button text-orange-500 hover:bg-orange-100">
            <p className="mr-2 text-orange-500">Cluster verlassen</p>
            <ArrowNarrowLeftIcon height={25} width={25} />
          </div>
          <div className="cluster-button text-red-500 hover:bg-red-100">
            <p className="mr-2 text-red-500">Cluster löschen</p>
            <TrashIcon height={25} width={25} />
          </div>
        </>
      ) : (
        <>
          <div
            className="cluster-button text-amber-500 hover:bg-amber-100"
            onClick={() => setEditMode(false)}
          >
            <p className="mr-2 text-amber-500">Speichern</p>
            <SaveIcon height={25} width={25} />
          </div>
          <div
            className="cluster-button text-red-500 hover:bg-red-100"
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
