import React, { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  options: string[];
};

const ProfileBadge = (props: Props) => {
  return (
    <div className="inline-block relative dropdown">
      <div className="header-option">{props.children}</div>
      <div className="hidden absolute right-[-30%] bg-white w-40 overflow-auto shadow-2xl flex-col items-start dropdown-content">
        <div className="h-[55px] w-full pl-6 mb-2 border-b-[1px]">
          <p className="text text-xs">Eingeloggt als</p>
          <p className="text text-xs block font-bold mt-1">Name</p>
        </div>
        <div className="w-full">
          {props.options.map((option, idx) => (
            <Link key={idx} href="/">
              <div className="w-full hover:bg-gray-200 p-2 pl-6 cursor-pointer">
                <p className="text">{option}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;
