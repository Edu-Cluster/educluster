import React from 'react';

type Props = {
  name: string;
  bigger?: boolean;
};

const Tag = (props: Props) => {
  if (props.bigger) {
    return (
      <span className="bg-sky-700 rounded-md cursor-default mb-2">
        <p className="text-white p-2">{props.name}</p>
      </span>
    );
  }

  return (
    <span className="bg-sky-700 flex justify-center items-center rounded-sm min-w-[15px] w-fit cursor-default mb-2">
      <p className="text-[9px] text-white py-[2px] px-1">{props.name}</p>
    </span>
  );
};

export default Tag;
