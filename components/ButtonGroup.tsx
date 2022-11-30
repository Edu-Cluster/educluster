import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
  UserAddIcon,
  ArrowNarrowLeftIcon,
  MailIcon,
} from '@heroicons/react/outline';
import useStore from '../client/store';

type Props = {
  clustername: string | undefined;
  isOnInvitationPage?: boolean;
};

const ButtonGroup = ({ clustername, isOnInvitationPage }: Props) => {
  const { editMode, setEditMode, membersToInvite } = useStore();

  // TODO Lara: Mutation definieren und bei onSuccess await router.push(`../../${clustername}`);

  const sendInvitations = () => {
    // Send invitation POST request to user router
    // TODO Lara
  };

  return (
    <div className="flex flex-col gap-4">
      {!editMode ? (
        <>
          {!isOnInvitationPage ? (
            <>
              <div
                className="cluster-button text-blue-500 hover:bg-blue-100"
                onClick={() =>
                  (document.location.href = `./invite/${clustername}`)
                }
              >
                <p className="mr-2 text-blue-500">Mitglieder einladen</p>
                <UserAddIcon height={20} width={20} />
              </div>
              <div
                className="cluster-button text-violet-500 hover:bg-violet-100"
                onClick={() => setEditMode(!editMode)}
              >
                <p className="mr-2 text-violet-500">Cluster bearbeiten</p>
                <PencilIcon height={20} width={20} />
              </div>
              <div className="cluster-button text-orange-500 hover:bg-orange-100">
                <p className="mr-2 text-orange-500">Cluster verlassen</p>
                <ArrowNarrowLeftIcon height={20} width={20} />
              </div>
              <div className="cluster-button text-red-500 hover:bg-red-100">
                <p className="mr-2 text-red-500">Cluster löschen</p>
                <TrashIcon height={20} width={20} />
              </div>
            </>
          ) : (
            <>
              {membersToInvite.length ? (
                <div
                  className="cluster-button text-fuchsia-500 hover:bg-fuchsia-100"
                  onClick={() => sendInvitations()}
                >
                  <p className="mr-2 text-fuchsia-500">Anfragen versenden</p>
                  <MailIcon height={20} width={20} />
                </div>
              ) : (
                <></>
              )}
              <div
                className="cluster-button text-orange-500 hover:bg-orange-100"
                onClick={() =>
                  (document.location.href = `../../cluster/${clustername}`)
                }
              >
                <p className="mr-2 text-orange-500">Zurück zum Cluster</p>
                <ArrowNarrowLeftIcon height={20} width={20} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div
            className="cluster-button text-amber-500 hover:bg-amber-100"
            onClick={() => setEditMode(false)}
          >
            <p className="mr-2 text-amber-500">Speichern</p>
            <SaveIcon height={20} width={20} />
          </div>
          <div
            className="cluster-button text-red-500 hover:bg-red-100"
            onClick={() => setEditMode(false)}
          >
            <p className="mr-2 text-red-500">Abbrechen</p>
            <XIcon height={20} width={20} />
          </div>
        </>
      )}
    </div>
  );
};

export default ButtonGroup;
