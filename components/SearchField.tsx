import React from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { resources } from '../lib/enums';

type Props = {
  resource: resources.APPOINTMENT | resources.USER | resources.CLUSTER;
  placeholder?: string;
};

const SearchField = ({ resource, placeholder }: Props) => {
  // TODO Lara GET request an den Backend schicken (resource = Tabellenname = Ressourcentyp, der gebracht wird)

  return (
    <form
      className="hidden h-12 w-full items-center justify-between rounded-xl border border-2
        border-gray-200 px-2 transition duration-300 ease-in-out hover:border-gray-400
        md:flex lg:flex"
    >
      <SearchIcon className="inline h-7 w-5 cursor-pointer text-gray-700 lg:w-7 lg:p-1" />
      <input
        className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
        placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
      />
      <button hidden type="submit"></button>
    </form>
  );
};

export default SearchField;
