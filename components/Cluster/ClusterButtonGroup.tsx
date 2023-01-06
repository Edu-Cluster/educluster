import React, { useState } from 'react';
import {
  PencilIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
  UserAddIcon,
  ArrowNarrowLeftIcon,
  MailIcon,
} from '@heroicons/react/outline';
import useStore from '../../client/store';
import toast from 'react-hot-toast';
import trpc from '../../client/trpc';

type Props = {
  clusterfullname: string | undefined;
  isOnInvitationPage?: boolean;
};

const ClusterButtonGroup = ({ clusterfullname, isOnInvitationPage }: Props) => {
  const [invitationsSent, setInvitationsSent] = useState(false);
  const { editMode, setEditMode, membersToInvite } = useStore();
  const clusterId = clusterfullname && Number(clusterfullname.split('*')[1]);

  const { mutate: invite } = trpc.useMutation(['item.inviteToCluster'], {
    async onSuccess() {
      setInvitationsSent(false);
      toast.success('Einladungen wurden versendet!');

      setTimeout(() => {
        document.location.href = `/cluster/${clusterfullname}`;
      }, 1300);
    },

    onError(error: any) {
      console.error(error);
      setInvitationsSent(false);
      toast.error('Leider konnten die Einladungen nicht versendet werden!');
    },
  });

  // TODO Denis: Nachdem es eindeutig ist ob authUser Clusteradmin ist oder nicht, EC-63 umsetzen

  const sendInvitations = async () => {
    if (!invitationsSent) {
      setInvitationsSent(true);

      // Invoke the invite mutation
      invite(clusterId as number);
    }
  };

  const saveSettings = () => {
    // Send cluster change POST Request to item router
    // TODO Lara

    setEditMode(false); // TODO Lara: Diese Zeile bitte ins onSuccess verschieben
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
                  (document.location.href = `./einladen/${clusterfullname}`)
                }
              >
                <p className="mr-2 text-blue-500">Mitglieder einladen</p>
                <UserAddIcon height={20} width={20} />
              </div>
              <div
                className="cluster-button text-violet-500 hover:bg-violet-100"
                onClick={() => setEditMode(true)}
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
                  (document.location.href = `../../cluster/${clusterfullname}`)
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
            onClick={() => saveSettings()}
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

export default ClusterButtonGroup;
