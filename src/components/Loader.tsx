import React from 'react';
import { MoonLoader } from 'react-spinners';

type Props = {
  size: number;
  type: string;
  extraClasses?: string;
};

const Loader = ({ size, type, extraClasses }: Props) => {
  if (type === 'main') {
    return (
      <main
        className={`h-screen flex items-center justify-center ${
          extraClasses || ''
        }`}
      >
        <MoonLoader color="gray" size={size} />
      </main>
    );
  } else if (type === 'div') {
    return (
      <div
        className={`h-[500px] w-full flex justify-center items-center ${
          extraClasses || ''
        }`}
      >
        <MoonLoader color="gray" size={size} />
      </div>
    );
  }

  return <MoonLoader color="gray" size={size || 20} />;
};

export default Loader;
