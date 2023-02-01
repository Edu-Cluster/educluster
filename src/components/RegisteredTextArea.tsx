import React from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { useFormContext } from 'react-hook-form';

type Props = {
  name?: string;
  placeholder?: string;
  onChangeHandler?: Function;
  registerInputName: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  height: string;
};

const RegisteredTextArea = ({
  name,
  placeholder,
  onChangeHandler,
  registerInputName,
  required,
  maxLength,
  minLength,
  height,
}: Props) => {
  const { register } = useFormContext();

  return (
    <div
      className={`flex w-full items-center justify-between rounded-xl border border-2
        border-gray-200 transition duration-300 ease-in-out hover:border-gray-400 h-${height}`}
    >
      {onChangeHandler ? (
        <textarea
          {...register(registerInputName)}
          className={`h-full w-full rounded-xl border-none text-[18px] outline-none p-2`}
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
          onChange={(e) => onChangeHandler(e)}
          name={name}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
        />
      ) : (
        <textarea
          {...register(registerInputName)}
          className={`h-full w-full rounded-xl border-none text-[18px] outline-none p-2`}
          placeholder={placeholder || 'Nach beliebigen Inhalten suchen'}
          name={name}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
        />
      )}
    </div>
  );
};

export default RegisteredTextArea;
