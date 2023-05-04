import React from 'react';
import {
  ArrowRightIcon,
  ArrowNarrowLeftIcon,
  MailIcon,
  PencilIcon,
  SaveIcon,
  TrashIcon,
  UserAddIcon,
  XIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import useStore from '../../lib/store';
import toast from 'react-hot-toast';
import trpc from '../../lib/trpc';
import { clusterAssociations } from '../../lib/enums';
import Link from 'next/link';

type Props = {
  isNotMainPage?: boolean;
  isPrivate?: boolean;
};

const ClusterButtonGroup = ({ isNotMainPage, isPrivate }: Props) => {
  const {
    editMode,
    setEditMode,
    membersToInvite,
    clusterDetails,
    clusterAssociation,
    userOfCluster,
    authUser,
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

  const { mutate: addMemberToClusterMutation } = trpc.useMutation(
    ['item.addNewMemberToCluster'],
    {
      onSuccess: () => {
        document.location.reload();
      },
      onError: (err) => {
        console.error(err);
      },
    },
  );

  const { mutate: warningClusterDeletedMutation } = trpc.useMutation(
    ['notification.warningClusterDeleted'],
    {
      onSuccess: () => {
        document.location.href = '../../';
      },
      onError: (err) => {
        console.error(err);
      },
    },
  );

  const { mutate: deleteClusterMutation } = trpc.useMutation(
    ['item.deleteCluster'],
    {
      onSuccess: () => {
        const userIds: bigint[] = [];

        userOfCluster.forEach((userArr: any) => {
          userArr.forEach((user: any) => {
            if (authUser && user.username !== authUser.username) {
              userIds.push(user.id);
            }
          });
        });

        warningClusterDeletedMutation({
          clusterId: clusterDetails.id,
          clusterName: clusterDetails.clustername,
          userIds,
        });
      },
      onError: (err) => {
        console.error(err);
      },
    },
  );

  const sendInvitations = async () => {
    const userIds: bigint[] = [];

    membersToInvite.forEach((member) => {
      userIds.push(member.id);
    });

    // Invoke the invite mutation
    invite({
      userIds,
      clusterId: clusterDetails.id,
      clusterName: clusterDetails.clustername,
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

  const addNewMember = () => {
    addMemberToClusterMutation(Number(clusterDetails.id));
  };

  const deleteCluster = () => {
    deleteClusterMutation(clusterDetails.id);
  };

  return (
    <div className="flex flex-col gap-4">
      {!editMode ? (
        <>
          {!isNotMainPage ? (
            <>
              {isAdmin && (
                <>
                  <Link href={`./admin/${clusterfullname}`}>
                    <div className="banner-button text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-100">
                      <p className="mr-2 dark:text-blue-emerald text-emerald-500">
                        Termin erstellen
                      </p>
                      <PlusIcon height={20} width={20} />
                    </div>
                  </Link>
                  <Link href={`./einladen/${clusterfullname}`}>
                    <div className="banner-button text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-100">
                      <p className="mr-2 dark:text-blue-500 text-blue-500">
                        Mitglieder einladen
                      </p>
                      <UserAddIcon height={20} width={20} />
                    </div>
                  </Link>
                  <div
                    className="banner-button text-violet-500 hover:bg-violet-100 dark:hover:bg-violet-100"
                    onClick={() => setEditMode(true)}
                  >
                    <p className="mr-2 dark:text-violet-500 text-violet-500">
                      Cluster bearbeiten
                    </p>
                    <PencilIcon height={20} width={20} />
                  </div>
                </>
              )}
              {isAdmin || isMember ? (
                <div className="banner-button text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-100">
                  <p className="mr-2 dark:text-orange-500 text-orange-500">
                    Cluster verlassen
                  </p>
                  <ArrowNarrowLeftIcon height={20} width={20} />
                </div>
              ) : !isPrivate ? (
                <div
                  className="banner-button text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-100"
                  onClick={() => addNewMember()}
                >
                  <p className="mr-2 dark:text-emerald-500 text-emerald-500">
                    Cluster beitreten
                  </p>
                  <ArrowRightIcon height={20} width={20} />
                </div>
              ) : (
                <></>
              )}
              {isAdmin && (
                <div
                  className="banner-button text-red-500 hover:bg-red-100 dark:hover:bg-red-100"
                  onClick={deleteCluster}
                >
                  <p className="mr-2 dark:text-red-500 text-red-500">
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
                  className="banner-button text-fuchsia-500 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-100"
                  onClick={() => sendInvitations()}
                >
                  <p className="mr-2 dark:text-fuchsia-500 text-fuchsia-500">
                    Anfragen versenden
                  </p>
                  <MailIcon height={20} width={20} />
                </div>
              ) : (
                <></>
              )}
              <Link href={`../../cluster/${clusterfullname}`}>
                <div className="banner-button text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-100">
                  <p className="mr-2 dark:text-orange-500 text-orange-500">
                    Zurück zum Cluster
                  </p>
                  <ArrowNarrowLeftIcon height={20} width={20} />
                </div>
              </Link>
            </>
          )}
        </>
      ) : (
        <>
          <div
            className="banner-button text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-100"
            onClick={() => saveSettings()}
          >
            <p className="mr-2 dark:text-amber-500 text-amber-500">Speichern</p>
            <SaveIcon height={20} width={20} />
          </div>
          <div
            className="banner-button text-red-500 hover:bg-red-100 dark:hover:bg-red-100"
            onClick={() => setEditMode(false)}
          >
            <p className="mr-2 dark:text-red-500 text-red-500">Abbrechen</p>
            <XIcon height={20} width={20} />
          </div>
        </>
      )}
    </div>
  );
};

export default ClusterButtonGroup;
