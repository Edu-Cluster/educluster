import React from 'react';
import {
  AcademicCapIcon,
  CubeIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import { ChevronDownIcon, MenuIcon, SearchIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Logo from './Logo';

export type Header = {
  isSignedIn: boolean;
};

const Header = ({ isSignedIn }: Header) => {
  return isSignedIn ? (
    <div className="sticky top-0 z-50 mb-8 flex h-20 items-center justify-between bg-white px-8 shadow-lg">
      {/* Logo */}
      <Logo />

      {/* Global Search Bar */}
      <form className="global-search-field">
        <SearchIcon className="inline h-7 w-5 cursor-pointer text-gray-700 lg:w-7 lg:p-1" />
        <input
          className="h-full w-full rounded-xl border-none p-2 text-[18px] outline-none"
          placeholder="Nach beliebigen Inhalten suchen"
        />
        <button hidden type="submit"></button>
      </form>

      {/* Spaces, Profile and Notifications */}
      <div className="mx-5 flex items-center space-x-2 text-white lg:inline-flex">
        <Link href="/pages">
          <div className="header-tab pr-2">
            <AcademicCapIcon className="header-icon" />
            <p className="text">Lerneinheiten</p>
          </div>
        </Link>
        <Link href="/pages">
          <div className="header-tab pr-2">
            <CubeIcon className="header-icon" />
            <p className="text">Cluster</p>
          </div>
        </Link>
        <div className="header-tab">
          <BellIcon className="header-icon" />
        </div>
        <div className="header-tab">
          <UserCircleIcon className="header-icon" />
          <ChevronDownIcon className="inline h-5 w-5" />
        </div>
        <div className="header-menu-tab">
          <MenuIcon className="header-icon" />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Header;
