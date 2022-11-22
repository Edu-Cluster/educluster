import React from 'react';
import Image from 'next/image';

type Props = {
  type: 'user' | 'cluster';
  bigger?: boolean;
  seed?: string;
  rounded?: boolean;
};

const Avatar = ({ type, bigger, seed, rounded }: Props) => {
  const svgSeed = seed || 'placeholder';

  return (
    <div
      className={`relative overflow-hidden ${
        rounded && 'rounded-full'
      } border border-gray-700 bg-white ${bigger ? 'h-28 w-28' : 'h-10 w-10'}`}
    >
      <Image
        layout="fill"
        objectFit="contain"
        src={`https://avatars.dicebear.com/api/${
          type === 'user' ? 'open-peeps' : 'jdenticon'
        }/${svgSeed}.svg`}
      />
    </div>
  );
};

export default Avatar;
