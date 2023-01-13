import React from 'react';
import { SearchIcon } from '@heroicons/react/solid';

type Props = {
  placeholder?: string;
  name?: string;
  onChangeHandler?: Function;
  noIcon?: boolean;
  type?: string;
};

const SearchField = ({
  placeholder,
  name,
  onChangeHandler,
  noIcon,
  type,
}: Props) => {
  return (
    <form
      className="flex h-12 w-full items-center justify-between rounded-xl border border-2
        border-gray-200 px-2 transition duration-300 ease-in-out hover:border-gray-400"
    >
      {!noIcon ? (
        <SearchIcon className="inline h-7 w-5 cursor-pointer text-gray-700 lg:w-7 lg:p-1" />
      ) : (
        <></>
      )}
      {onChangeHandler ? (
        <input
          className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
          type={type}
          onChange={(e) => onChangeHandler(e)}
          name={name}
        />
      ) : (
        <input
          className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
          type={type}
          name={name}
        />
      )}
      <button hidden type="submit"></button>
    </form>
  );
};

export default SearchField;
