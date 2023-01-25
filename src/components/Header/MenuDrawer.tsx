import React, { ReactNode, useState } from 'react';
import Drawer from 'react-modern-drawer';
import Link from 'next/link';
import Logo from '../Logo';
import toast from 'react-hot-toast';
import trpc from '../../lib/trpc';
import { statusCodes } from '../../lib/enums';
import useStore from '../../lib/store';

type Props = {
  children: ReactNode;
  options: { name: string; link: string; isLogout?: boolean }[];
};

const MenuDrawer = (props: Props) => {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: logoutUser } = trpc.useMutation(['auth.logout'], {
    async onSuccess(data) {
      toast.dismiss();

      if (data.status === statusCodes.SUCCESS) {
        store.setAuthUser(null);

        // Redirect to login page
        document.location.href = '/login';
      } else {
        toast.error('Oops, Irgendwas ist falsch gelaufen!');
      }
    },

    onError(error: any) {
      toast.dismiss();

      // Internal server error
      error.response.errors.forEach((err: any) => {
        console.error(err);
      });

      toast.error('Beim Ausloggen ist etwas falsch gelaufen!');
    },
  });

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    toast.loading('Sie werden ausgeloggt...');

    logoutUser();
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
              <Link key={idx} href={option.link}>
                <div
                  className="w-full hover:bg-gray-200 p-4 pl-5 cursor-pointer"
                  onClick={option.isLogout ? handleLogout : undefined}
                >
                  <p>{option.name}</p>
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

export default MenuDrawer;
