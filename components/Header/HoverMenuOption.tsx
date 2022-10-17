import React, { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  options: string[];
};

const HoverMenuOption = (props: Props) => {
  return (
    <div className="inline-block relative dropdown">
      <div
        className="rounded-lg p-1 text-gray-700 text-[22px] hover:bg-gray-200 hidden md:block cursor-pointer searchbox-md:text-[18px]
        transition ease-in-out duration-300 hover:text-black pr-3"
      >
        {props.children}
      </div>
      <div className="hidden absolute bg-white w-40 overflow-auto shadow-2xl flex-col justify-center items-center dropdown-content">
        {props.options.map((option, idx) => (
          <Link key={idx} href="/">
            <div className="w-full hover:bg-gray-200 p-2 pl-4 cursor-pointer">
              <p className="text">{option}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HoverMenuOption;
