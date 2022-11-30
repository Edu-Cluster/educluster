import React from 'react';
import { resources } from '../lib/enums';
import { SearchIcon } from '@heroicons/react/solid';

type Props = {
  resource: resources.APPOINTMENT | resources.USER | resources.CLUSTER;
  placeholder?: string;
  onChangeHandler?: Function;
};

const SearchField = ({ resource, placeholder, onChangeHandler }: Props) => {
  return (
    <form
      className="flex h-12 w-full items-center justify-between rounded-xl border border-2
        border-gray-200 px-2 transition duration-300 ease-in-out hover:border-gray-400"
    >
      <SearchIcon className="inline h-7 w-5 cursor-pointer text-gray-700 lg:w-7 lg:p-1" />
      {onChangeHandler ? (
        <input
          className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
          onChange={(e) => onChangeHandler(e)}
        />
      ) : (
        <input
          className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
        />
      )}
      <button hidden type="submit"></button>
    </form>
  );
};

export default SearchField;
