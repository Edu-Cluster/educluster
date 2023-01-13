import React from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { useFormContext } from 'react-hook-form';

type Props = {
  name?: string;
  type?: string;
  placeholder?: string;
  noIcon?: boolean;
  onChangeHandler?: Function;
  registerInputName: string;
};

const RegisteredSearchField = ({
  type,
  name,
  noIcon,
  placeholder,
  onChangeHandler,
  registerInputName,
}: Props) => {
  const { register } = useFormContext();

  return (
    <div
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
          {...register(registerInputName)}
          className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
          type={type}
          onChange={(e) => onChangeHandler(e)}
          name={name}
        />
      ) : (
        <input
          {...register(registerInputName)}
          className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
          type={type}
          name={name}
        />
      )}
    </div>
  );
};

export default RegisteredSearchField;
