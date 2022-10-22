import React from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <div>
      <Link href="/login.tsx">
        <div className="cursor-pointer">
          <h1 className="text-[22px] text-gray-700 searchbox-md:text-[18px]">
            LOGO Placeholder
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
