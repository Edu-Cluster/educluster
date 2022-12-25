import React from 'react';
import { NextPage } from 'next';
import Logo from '../components/Logo';

const NotFoundPage: NextPage = () => {
  return (
    <main className="page-default h-[90vh]">
      <div className="flex flex-col justify-center gap-5 text-center mt-10">
        <Logo />
        <h1 className="text-[22px] text-gray-700">
          Diese Seite existiert leider nicht...
        </h1>
        <p>
          Hör auf falsche Links einzugeben und benutze stattdessen unsere
          intuitive Buttons zum Navigieren! :)
        </p>
      </div>
    </main>
  );
};

export default NotFoundPage;
