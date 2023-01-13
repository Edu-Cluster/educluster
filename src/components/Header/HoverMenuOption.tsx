import React, { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  options: {
    name: string;
    link: string;
  }[];
};

const HoverMenuOption = (props: Props) => {
  return (
    <div className="inline-block relative dropdown">
      <div className="header-option pr-3">{props.children}</div>
      <div className="hidden absolute bg-white w-48 overflow-auto shadow-2xl flex-col justify-center items-center dropdown-content">
        {props.options.map(({ name, link }, idx) => (
          <Link key={idx} href={link}>
            <div className="w-full hover:bg-gray-200 p-2 pl-4 cursor-pointer">
              <p className="text">{name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HoverMenuOption;
