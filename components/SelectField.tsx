import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  preselected: string;
  children: ReactNode;
  registerSelectName: string;
};

const SelectField = ({ preselected, registerSelectName, children }: Props) => {
  const { register } = useFormContext();

  return (
    <select
      {...register(registerSelectName)}
      className="h-12 w-full rounded-xl border border-2
        border-gray-200 px-2 transition duration-300 ease-in-out hover:border-gray-400"
    >
      <option value="-1" defaultValue={preselected}>
        {preselected}
      </option>
      {children}
    </select>
  );
};

export default SelectField;
