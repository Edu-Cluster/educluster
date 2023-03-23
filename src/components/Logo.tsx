import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '../../public/assets/Logo.png';

const Logo = ({ bigger }: { bigger?: boolean }) => {
  return (
    <div>
      <Link href="/">
        {bigger ? (
          <div className="cursor-pointer flex flex-col min-w-[200px] min-h-[125px]">
            <Image src={LogoImage} height={125} width={200} />
            <h1 className="text-[35px] font-semibold pt-1">EduCluster</h1>
          </div>
        ) : (
          <div className="cursor-pointer flex min-w-[80px] min-h-[50px]">
            <Image src={LogoImage} height={50} width={80} />
            <h1 className="text-[26px] font-semibold pt-1 hidden sm:block">
              EduCluster
            </h1>
          </div>
        )}
      </Link>
    </div>
  );
};

export default Logo;
