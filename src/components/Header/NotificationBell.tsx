import React, { ReactNode, useEffect } from 'react';
import useStore from '../../lib/store';
import { statusCodes } from '../../lib/enums';
import trpc from '../../lib/trpc';
import { useTheme } from 'next-themes';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { deleteCookie, setCookie } from 'cookies-next';
import Loader from '../Loader';

type Props = {
  children: ReactNode;
  darkMode?: boolean;
};

const NotificationBell = (props: Props) => {
  const {
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
          (notification) => notification.viewed === true,
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
      onSuccess: async ({ data }) => {
        if (data && data.status === statusCodes.SUCCESS) {
          // TODO
        }
      },
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

  const respondToInvitation = (response: boolean) => {
    // TODO Denis: EC-87
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
          {getNotificationsQuery.isSuccess && notifications ? (
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
                      <p className="text-md font-semibold">
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
                  <p className="text-sm leading-tight">{notification.body}</p>
                  {notification.title === 'Einladung' ? (
                    <div className="flex flex-wrap sm:flex-nowrap justify-around gap-2 mt-4 mb-2">
                      <div
                        className="cluster-button text-emerald-500 dark:hover:bg-emerald-100 hover:bg-emerald-100 w-36 sm:w-52"
                        onClick={() => respondToInvitation(true)}
                      >
                        <p className="mr-2 text-emerald-500 dark:text-emerald-500">
                          Annehmen
                        </p>
                        <CheckIcon height={20} width={20} />
                      </div>
                      <div
                        className="cluster-button text-red-500 dark:hover:bg-red-100 hover:bg-red-100 w-36 sm:w-52"
                        onClick={() => respondToInvitation(true)}
                      >
                        <p className="mr-2 text-red-500 dark:text-red-500">
                          Ablehnen
                        </p>
                        <XIcon height={20} width={20} />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Loader type="main" size={50} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
