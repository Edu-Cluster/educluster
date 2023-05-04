import React, { ReactNode, useEffect } from 'react';
import useStore from '../../lib/store';
import { clusterAssociations, statusCodes } from '../../lib/enums';
import trpc from '../../lib/trpc';
import { useTheme } from 'next-themes';
import { CheckIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { deleteCookie } from 'cookies-next';
import Loader from '../Loader';

type Props = {
  children: ReactNode;
  darkMode?: boolean;
};

const NotificationBell = (props: Props) => {
  const {
    authUser,
    notifications,
    setNotifications,
    newNotificationsAvailable,
    setNewNotificationsAvailable,
  } = useStore();
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === 'dark';

  function listenCookieChange(callback: Function, interval = 1000) {
    let lastCookie = document.cookie;

    setInterval(() => {
      let cookie = document.cookie;

      if (cookie !== lastCookie) {
        try {
          callback({ cookie });
        } finally {
          lastCookie = cookie;
        }
      }
    }, interval);
  }

  listenCookieChange(({ cookie }: { cookie: any }) => {
    if (cookie.includes('notification')) {
      deleteCookie('notification');

      setNewNotificationsAvailable(true);
      getNotificationsQuery.refetch();
    }
  }, 1000);

  useEffect(() => {
    deleteCookie('notification');

    document.addEventListener('click', ({ target }: any) => {
      const targetDropdown = target && target.closest('div');
      const targetContent = target && target.closest('.dropdown-content-click');
      const dropdownBell = document.getElementById('dropdown-bell');
      const dropdownBellContent = document.getElementById(
        'dropdown-bell-content',
      );

      if (targetDropdown && targetDropdown === dropdownBell) {
        return;
      }

      if (!targetContent) {
        if (dropdownBellContent) {
          dropdownBellContent.classList.add('hidden');
        }
      }
    });
  }, []);

  const getNotificationsQuery = trpc.useQuery(['notification.getAll'], {
    enabled: true,
    retry: 0,
    onSuccess: async ({ data }) => {
      if (data && data.status === statusCodes.SUCCESS) {
        const allViewed = !data.notifications.every(
          (notification: any) => notification.viewed === true,
        );

        setNotifications(data.notifications);

        if (allViewed) {
          setNewNotificationsAvailable(true);
        }
      }
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const { mutate: markAsViewedMutation } = trpc.useMutation(
    ['notification.setAllViewed'],
    {
      onError: (err) => {
        console.error(err);
      },
    },
  );

  const { mutate: deleteNotification } = trpc.useMutation(
    ['notification.deleteOne'],
    {
      onSuccess: async (data) => {
        if (data.status === statusCodes.SUCCESS) {
          await getNotificationsQuery.refetch();
        }
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const { mutate: addMemberToClusterMutation } = trpc.useMutation(
    ['item.addMemberToCluster'],
    {
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const { mutate: removeMemberMutation } = trpc.useMutation(
    ['item.removeMemberFromCluster'],
    {
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const toggleDropdownBell = async () => {
    const dropdownContent = document.getElementById('dropdown-bell-content');

    if (dropdownContent) {
      dropdownContent.classList.toggle('hidden');

      const isOpen = !dropdownContent.classList.contains('hidden');

      setNewNotificationsAvailable(false);

      if (isOpen && newNotificationsAvailable) {
        await markAsViewedMutation();
      } else if (!isOpen) {
        await getNotificationsQuery.refetch();
      }
    }
  };

  const respondToInvitation = async (response: boolean, idx: number) => {
    if (!notifications) {
      return;
    }

    const targetNotification = notifications[idx];
    const { body, id } = targetNotification;

    // @ts-ignore
    const regMatch = body.match(/#.*/);

    if (!Array.isArray(regMatch)) {
      return;
    }

    const clusterId = Number(regMatch[0].split(' ')[0].substring(1));

    if (response) {
      // User accepted the invitation -> officially add him to the cluster
      await addMemberToClusterMutation(clusterId);
    } else {
      // User rejected the invitation -> remove him as provisional member of the cluster
      await removeMemberMutation({
        clusterId,
        username: authUser?.username || '',
        type: clusterAssociations.IS_MEMBER,
      });
    }

    // Now remove the notification
    await deleteNotification(id);
  };

  return (
    <div className="inline-block relative">
      <div
        id="dropdown-bell"
        className={`header-option block dropdown-click${
          props.darkMode ? ' hover:bg-slate-400' : ''
        }`}
        onClick={toggleDropdownBell}
      >
        {props.children}
        {newNotificationsAvailable ? (
          <div className="bg-blue-500 rounded-3xl w-2 h-2 absolute top-1 right-2"></div>
        ) : (
          ''
        )}
      </div>
      <div
        id="dropdown-bell-content"
        className={`hidden absolute right-[-50%] w-[250px] sm:w-[400px] h-[500px] shadow-2xl flex-col items-start dropdown-content-click rounded-md${
          darkMode ? ' bg-black' : ' bg-white'
        }`}
      >
        <div className="w-full divide-y mt-2">
          {getNotificationsQuery.isLoading ? (
            <Loader type="div" size={50} />
          ) : notifications && notifications.length ? (
            notifications.map((notification, idx) => (
              <div
                key={idx}
                className={`w-full px-4 py-2 flex justify-around${
                  darkMode ? ' hover:bg-slate-800' : ' hover:bg-gray-100'
                }`}
                data-id={notification.id}
              >
                <div className="w-full break-words">
                  <span className="flex justify-between">
                    <span className="flex gap-2">
                      <p
                        className={`text-md font-semibold${
                          notification.title === 'Warnung'
                            ? ' text-red-600'
                            : ' text-green-600'
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.viewed ? (
                        <p className="text-sm mt-1 text-cyan-700 dark:text-cyan-700">
                          Neu
                        </p>
                      ) : (
                        <></>
                      )}
                    </span>
                    <span>
                      <p className="text-sm mr-1">von</p>
                      <p className="text-sm text-cyan-700 dark:text-cyan-700">
                        {notification.sender}
                      </p>
                    </span>
                  </span>
                  {notification.title === 'Einladung' ? (
                    <>
                      <p className="text-sm leading-tight">
                        {notification.body}
                      </p>
                      <div className="flex flex-wrap sm:flex-nowrap justify-around gap-2 mt-2 mb-2">
                        <div
                          className="banner-button text-emerald-500 dark:hover:bg-emerald-100 hover:bg-emerald-100 w-16"
                          onClick={() => respondToInvitation(true, idx)}
                        >
                          <CheckIcon height={20} width={20} />
                        </div>
                        <div
                          className="banner-button text-red-500 dark:hover:bg-red-100 hover:bg-red-100 w-16"
                          onClick={() => respondToInvitation(false, idx)}
                        >
                          <XIcon height={20} width={20} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex mt-2 gap-4">
                      <p className="text-sm leading-9">{notification.body}</p>
                      <div
                        className="banner-button text-red-500 dark:hover:bg-red-100 hover:bg-red-100 w-12"
                        onClick={() =>
                          deleteNotification(notifications[idx].id)
                        }
                      >
                        <TrashIcon height={20} width={20} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-[500px] w-full flex justify-center items-center">
              <p>Keine Benachrichtigungen 🥱</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
