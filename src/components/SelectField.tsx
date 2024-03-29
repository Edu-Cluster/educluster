import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  children: ReactNode;
  name: string;
  preselected?: string;
  onChangeHandler?: Function;
  required?: boolean;
  max?: string;
};

const SelectField = ({
  preselected,
  children,
  name,
  onChangeHandler,
  required,
}: Props) => {
  const handleChange = () => {
    if (onChangeHandler) {
      const newSelectedValue = document.querySelector(
        `[name="${name}"] option:checked`,
      );

      // @ts-ignore
      onChangeHandler(newSelectedValue.value);
    }
  };

  return (
    <select
      name={name}
      className="h-12 w-full rounded-xl border border-2
        border-gray-200 px-2 transition duration-300 ease-in-out hover:border-gray-400"
      onChange={handleChange}
      required={required}
    >
      {preselected ? (
        <option value="-1" defaultValue={preselected}>
          {preselected}
        </option>
      ) : (
        <></>
      )}
      {children}
    </select>
  );
};

export default SelectField;
