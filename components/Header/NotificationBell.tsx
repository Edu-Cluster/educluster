import React, { ReactNode, useEffect } from 'react';
import Link from 'next/link';

type Props = {
  // TODO if notification is an invitation, you should have buttons to accept/reject it
  children: ReactNode;
  notifications: string[];
};

const NotificationBell = (props: Props) => {
  useEffect(() => {
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

  const toggleDropdownBell = () => {
    const dropdownContent = document.getElementById('dropdown-bell-content');

    if (dropdownContent) {
      dropdownContent.classList.toggle('hidden');
    }
  };

  return (
    <div className="inline-block relative">
      <div
        id="dropdown-bell"
        className="header-option block dropdown-click"
        onClick={toggleDropdownBell}
      >
        {props.children}
      </div>
      <div
        id="dropdown-bell-content"
        className="hidden absolute right-[-50%] bg-white w-[400px] h-[500px] overflow-auto shadow-2xl flex-col items-start dropdown-content-click rounded-md"
      >
        <div className="w-full divide-y mt-2">
          {props.notifications.map((notification, idx) => (
            <Link key={idx} href="/">
              <div className="w-full hover:bg-gray-100 px-4 py-2 flex justify-around">
                <div className="w-full break-words">
                  <p className="text-sm font-semibold block mb-[-5px]">
                    Geplante Lerneinheit
                  </p>
                  <p className="text-sm leading-tight">{notification}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
