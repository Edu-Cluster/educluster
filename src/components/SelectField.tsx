import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  preselected: string;
  children: ReactNode;
  registerSelectName: string;
  onChangeHandler?: Function;
};

const SelectField = ({
  preselected,
  registerSelectName,
  children,
  onChangeHandler,
}: Props) => {
  const { register } = useFormContext();

  const handleChange = () => {
    if (onChangeHandler) {
      const newSelectedValue = document.querySelector(
        `[name="${registerSelectName}"] option:checked`,
      );

      // @ts-ignore
      onChangeHandler(newSelectedValue.value);
    }
  };

  return (
    <select
      {...register(registerSelectName)}
      name={registerSelectName}
      className="h-12 w-full rounded-xl border border-2
        border-gray-200 px-2 transition duration-300 ease-in-out hover:border-gray-400"
      onChange={handleChange}
    >
      <option value="-1" defaultValue={preselected}>
        {preselected}
      </option>
      {children}
    </select>
  );
};

export default SelectField;
