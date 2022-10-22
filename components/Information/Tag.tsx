import React from 'react';

type Props = {
  name: string;
};

const Tag = (props: Props) => {
  return (
    <span className="bg-sky-700 flex justify-center items-center rounded-sm min-w-[15px] cursor-default">
      <p className="text-[9px] text-white p-[2px]">{props.name}</p>
    </span>
  );
};

export default Tag;
