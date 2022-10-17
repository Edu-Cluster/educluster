import React from 'react';
import { SearchIcon } from '@heroicons/react/solid';

const SearchField = () => {
  return (
    <form
      className="hidden h-12 items-center justify-between rounded-xl border border-2
        border-gray-200 px-2 transition duration-300 ease-in-out hover:border-gray-400
        md:flex md:w-[30rem] lg:flex lg:w-[40rem] searchbox-md:lg:w-[24rem]"
    >
      <SearchIcon className="inline h-7 w-5 cursor-pointer text-gray-700 lg:w-7 lg:p-1" />
      <input
        className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
        placeholder="Nach beliebigen Inhalten suchen"
      />
      <button hidden type="submit"></button>
    </form>
  );
};

export default SearchField;
