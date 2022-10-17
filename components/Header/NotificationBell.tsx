import React, { ReactNode, useEffect } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  options: string[];
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
        className="rounded-lg p-1 text-gray-700 text-[22px] hover:bg-gray-200 hidden md:block cursor-pointer searchbox-md:text-[18px]
      transition ease-in-out duration-300 hover:text-black dropdown-click'"
        onClick={toggleDropdownBell}
      >
        {props.children}
      </div>
      <div
        id="dropdown-bell-content"
        className="hidden absolute right-[-50%] bg-white w-[400px] h-[500px] overflow-auto shadow-2xl flex-col items-start dropdown-content-click"
      >
        <div className="w-full divide-y mt-2">
          {props.options.map((option, idx) => (
            <Link key={idx} href="/">
              <div className="w-full hover:bg-gray-100 px-4 py-2 flex justify-around">
                <div className="w-full break-words">
                  <p className="text text-sm font-semibold block mb-[-5px]">
                    Geplante Lerneinheit
                  </p>
                  <p className="text text-sm leading-tight">{option}</p>
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
