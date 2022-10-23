import React, { ReactNode, useState } from 'react';
import Drawer from 'react-modern-drawer';
import Link from 'next/link';
import Logo from './Logo';

type Props = {
  children: ReactNode;
  options: string[];
};

const HoverMenuOption = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div
      className="inline-block relative rounded-lg p-1 text-gray-700 text-2xl lg:hover:bg-blue-200 sm:block md:hidden drawer-toggler"
      onClick={toggleDrawer}
    >
      {props.children}
      <div>
        <Drawer
          className="flex flex-col justify-between"
          open={isOpen}
          onClose={toggleDrawer}
          direction="right"
          enableOverlay={true}
        >
          <div className="divide-y">
            {props.options.map((option, idx) => (
              <Link key={idx} href="/">
                <div className="w-full hover:bg-gray-200 p-4 pl-5 cursor-pointer">
                  <p>{option}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="m-5 flex justify-center items-center">
            <Logo />
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default HoverMenuOption;
