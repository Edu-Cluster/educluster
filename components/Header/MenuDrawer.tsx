import React, { ReactNode, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

type Props = {
  children: ReactNode;
  options: string[];
  notificationOptions: string[];
};

const HoverMenuOption = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownIsOpen, setDropdownOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const toggleNotificationsDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
    document.getElementById('drawer-dropdown')?.classList.toggle('hidden');
  };

  useEffect(() => {
    document.addEventListener('click', ({ target }: any) => {
      const drawer = target && target.closest('.drawer');
      const drawerToggler = target && target.closest('.drawer-toggler');

      if (isOpen && !drawer && !drawerToggler) {
        toggleDrawer();
      }
    });
  }, [isOpen]);

  return (
    <div
      className="inline-block relative rounded-lg p-1 text-gray-700 text-2xl lg:hover:bg-blue-200 sm:block md:hidden drawer-toggler"
      onClick={toggleDrawer}
    >
      {props.children}
      <div>
        <Drawer
          className="drawer"
          open={isOpen}
          onClose={toggleDrawer}
          direction="right"
          enableOverlay={false}
        >
          <div className="divide-y">
            {props.options.map((option, idx) => (
              <Link key={idx} href="/">
                <div className="w-full hover:bg-gray-200 p-2 pl-4 cursor-pointer">
                  <p>{option}</p>
                </div>
              </Link>
            ))}
            <Link href="/">
              <div
                className="w-full hover:bg-gray-200 p-2 pl-4 cursor-pointer"
                onClick={toggleNotificationsDropdown}
              >
                <p className="mr-1">Benachrichtigungen</p>
                {!dropdownIsOpen ? (
                  <ChevronDownIcon className="inline h-5 w-5" />
                ) : (
                  <ChevronUpIcon className="inline h-5 w-5" />
                )}
              </div>
            </Link>
            <div
              id="drawer-dropdown"
              className="hidden h-[500px] w-full overflow-y-auto"
            >
              {props.notificationOptions.map((option, idx) => (
                <Link key={idx} href="/">
                  <div className="w-full hover:bg-gray-100 px-4 py-2 flex justify-around">
                    <div className="w-full break-words">
                      <p className="text-sm font-semibold block mb-[-5px]">
                        Geplante Lerneinheit
                      </p>
                      <p className="text-sm leading-tight">{option}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default HoverMenuOption;
