import React from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <div className="cursor-pointer">
          <h1 className="text-[22px] searchbox-md:text-[18px]">EduCluster</h1>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
