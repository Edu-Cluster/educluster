import React from 'react';
import { MoonLoader } from 'react-spinners';

type Props = {
  size: number;
  type: string;
  extraClasses?: string;
  loaderText?: string;
};

const Loader = ({ size, type, extraClasses, loaderText }: Props) => {
  if (type === 'main') {
    return (
      <main
        className={`h-screen flex flex-col items-center justify-center ${
          extraClasses || ''
        }`}
      >
        <MoonLoader color="gray" size={size} />
        {loaderText ? (
          <p className="text-gray-400 mt-10">{loaderText}</p>
        ) : (
          <></>
        )}
      </main>
    );
  } else if (type === 'div') {
    return (
      <div
        className={`h-[500px] w-full flex flex-col justify-center items-center ${
          extraClasses || ''
        }`}
      >
        <MoonLoader color="gray" size={size} />
        {loaderText ? (
          <p className="text-gray-400 mt-10">{loaderText}</p>
        ) : (
          <></>
        )}
      </div>
    );
  }

  return <MoonLoader color="gray" size={size || 20} />;
};

export default Loader;
