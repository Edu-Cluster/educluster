import React, { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  options: {
    name: string;
    link: string;
  }[];
  darkMode?: boolean;
};

const HoverMenuOption = (props: Props) => {
  return (
    <div className="inline-block relative dropdown">
      <div
        className={`header-option pr-3${
          props.darkMode ? ' hover:bg-slate-400' : ''
        }`}
      >
        {props.children}
      </div>
      <div
        className={`hidden absolute bg-white w-48 overflow-auto shadow-2xl flex-col justify-center items-center dropdown-content${
          props.darkMode ? ' bg-gray-800' : ''
        }`}
      >
        {props.options.map(({ name, link }, idx) => (
          <Link key={idx} href={link}>
            <div
              className={`w-full p-2 pl-4 cursor-pointer${
                props.darkMode ? ' hover:bg-slate-400' : ' hover:bg-gray-200'
              }`}
            >
              <p className={props.darkMode ? 'text-black' : ''}>{name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HoverMenuOption;
