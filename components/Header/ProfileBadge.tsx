import React, { ReactNode } from 'react';
import Link from 'next/link';
import useStore from '../../client/store';
import { trpc } from '../../client/trpc';
import toast from 'react-hot-toast';
import { statusCodes } from '../../lib/enums';
import { useRouter } from 'next/router';

type Props = {
  children: ReactNode;
  options: { text: string; link: string | null; isLogout: boolean }[];
};

const ProfileBadge = (props: Props) => {
  const store = useStore();
  const router = useRouter();

  const { mutate: logoutUser } = trpc.useMutation(['auth.logout'], {
    async onSuccess(data) {
      toast.dismiss();

      if (data.status === statusCodes.SUCCESS) {
        // Redirect to login page
        await router.push('./login');
      } else {
        toast.error('Oops: Irgendwas ist falsch gelaufen!');
      }
    },

    onError(error: any) {
      toast.dismiss();

      // Internal server error
      error.response.errors.forEach((err: any) => {
        console.error(err);
      });

      toast.error('Internal Server Error!');
    },
  });

  const handleLogout = async () => {
    toast.loading('Sie werden ausgeloggt...');

    logoutUser();

    store.setAuthUser(null);

    await router.push('./');
  };

  return (
    <div className="inline-block relative dropdown">
      <div className="header-option">{props.children}</div>
      <div className="hidden absolute right-[-30%] bg-white w-40 overflow-auto shadow-2xl flex-col items-start dropdown-content">
        <div className="h-[55px] w-full pl-6 mb-2 border-b-[1px]">
          <p className="text-xs">Eingeloggt als</p>
          <p className="text-xs block font-bold mt-1">Name</p>
        </div>
        <div className="w-full">
          {props.options.map((option, idx) => (
            <Link key={idx} href={option.link || ''}>
              <div
                className="w-full hover:bg-gray-200 p-2 pl-6 cursor-pointer"
                onClick={option.isLogout ? handleLogout : undefined}
              >
                <p className="text">{option.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;
