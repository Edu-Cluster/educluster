import React, { useState } from 'react';
import {
  ArrowRightIcon,
  ArrowNarrowLeftIcon,
  MailIcon,
  PencilIcon,
  SaveIcon,
  TrashIcon,
  UserAddIcon,
  XIcon,
} from '@heroicons/react/outline';
import useStore from '../../lib/store';
import toast from 'react-hot-toast';
import trpc from '../../lib/trpc';
import { clusterAssociations } from '../../lib/enums';

type Props = {
  isOnInvitationPage?: boolean;
  isPrivate?: boolean;
};

const ClusterButtonGroup = ({ isOnInvitationPage, isPrivate }: Props) => {
  const {
    editMode,
    setEditMode,
    membersToInvite,
    clusterDetails,
    clusterAssociation,
  } = useStore();
  const clusterfullname = `${clusterDetails.clustername}*${clusterDetails.id}`;
  const isAdmin = clusterAssociation === clusterAssociations.IS_ADMIN;
  const isMember = clusterAssociation === clusterAssociations.IS_MEMBER;

  const { mutate: invite } = trpc.useMutation(['item.inviteToCluster'], {
    async onSuccess() {
      toast.success('Einladungen wurden versendet!');

      setTimeout(() => {
        document.location.href = `/cluster/${clusterfullname}`;
      }, 1300);
    },

    onError(error: any) {
      console.error(error);
      toast.error('Leider konnten die Einladungen nicht versendet werden!');
    },
  });

  const { mutate: updateCluster } = trpc.useMutation(['item.updateCluster'], {
    async onSuccess() {
      const newClustername = document.querySelector(
        'input[name="clustername"]',
        // @ts-ignore
      )?.value;

      setEditMode(false);
      document.location.href = `./${
        newClustername || clusterDetails.clustername
      }*${clusterDetails.id}`;
    },

    onError(error: any) {
      console.error(error);
      setEditMode(false);
      toast.error('Leider konnten die Einstellungen nicht gespeichert werden!');
    },
  });

  // TODO Denis: Nachdem es eindeutig ist ob authUser Clusteradmin ist oder nicht, EC-63 umsetzen

  const sendInvitations = async () => {
    const foundUsernames = document.querySelectorAll('.member-list #username');

    let usernames: any[] = [];
    Array.from(foundUsernames).forEach((username) => {
      // @ts-ignore
      usernames.push(username.innerText);
    });

    // Invoke the invite mutation
    invite({
      usernames,
      clusterId: clusterDetails.id,
    });
  };

  const saveSettings = () => {
    const newClustername = document.querySelector(
      'input[name="clustername"]',
      // @ts-ignore
    )?.value;
    const newDescription = document.querySelector(
      'textarea[name="description"]',
      // @ts-ignore
    )?.value;

    // Send cluster change POST Request to item router
    updateCluster({
      clusterId: clusterDetails.id,
      clustername: newClustername,
      description: newDescription,
      isPrivate: isPrivate as boolean,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {!editMode ? (
        <>
          {!isOnInvitationPage ? (
            <>
              {isAdmin && (
                <div
                  className="cluster-button text-blue-500 dark:hover:text-black hover:bg-blue-100"
                  onClick={() =>
                    (document.location.href = `./einladen/${clusterfullname}`)
                  }
                >
                  <p className="mr-2 dark:hover:text-black text-blue-500">
                    Mitglieder einladen
                  </p>
                  <UserAddIcon height={20} width={20} />
                </div>
              )}
              {isAdmin && (
                <div
                  className="cluster-button text-violet-500 dark:hover:text-black hover:bg-violet-100"
                  onClick={() => setEditMode(true)}
                >
                  <p className="mr-2 dark:hover:text-black text-violet-500">
                    Cluster bearbeiten
                  </p>
                  <PencilIcon height={20} width={20} />
                </div>
              )}
              {isAdmin || isMember ? (
                <div className="cluster-button text-orange-500 dark:hover:text-black hover:bg-orange-100">
                  <p className="mr-2 dark:hover:text-black text-orange-500">
                    Cluster verlassen
                  </p>
                  <ArrowNarrowLeftIcon height={20} width={20} />
                </div>
              ) : (
                <div className="cluster-button text-emerald-500 dark:hover:text-black hover:bg-emerald-100">
                  <p className="mr-2 dark:hover:text-black text-emerald-500">
                    Cluster beitreten
                  </p>
                  <ArrowRightIcon height={20} width={20} />
                </div>
              )}
              {isAdmin && (
                <div className="cluster-button text-red-500 dark:hover:text-black hover:bg-red-100">
                  <p className="mr-2 dark:hover:text-black text-red-500">
                    Cluster löschen
                  </p>
                  <TrashIcon height={20} width={20} />
                </div>
              )}
            </>
          ) : (
            <>
              {membersToInvite.length ? (
                <div
                  className="cluster-button text-fuchsia-500 dark:hover:text-black hover:bg-fuchsia-100"
                  onClick={() => sendInvitations()}
                >
                  <p className="mr-2 dark:hover:text-black text-fuchsia-500">
                    Anfragen versenden
                  </p>
                  <MailIcon height={20} width={20} />
                </div>
              ) : (
                <></>
              )}
              <div
                className="cluster-button text-orange-500 dark:hover:text-black hover:bg-orange-100"
                onClick={() =>
                  (document.location.href = `../../cluster/${clusterfullname}`)
                }
              >
                <p className="mr-2 dark:hover:text-black text-orange-500">
                  Zurück zum Cluster
                </p>
                <ArrowNarrowLeftIcon height={20} width={20} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div
            className="cluster-button text-amber-500 dark:hover:text-black hover:bg-amber-100"
            onClick={() => saveSettings()}
          >
            <p className="mr-2 dark:hover:text-black text-amber-500">
              Speichern
            </p>
            <SaveIcon height={20} width={20} />
          </div>
          <div
            className="cluster-button text-red-500 dark:hover:text-black hover:bg-red-100"
            onClick={() => setEditMode(false)}
          >
            <p className="mr-2 dark:hover:text-black text-red-500">Abbrechen</p>
            <XIcon height={20} width={20} />
          </div>
        </>
      )}
    </div>
  );
};

export default ClusterButtonGroup;
