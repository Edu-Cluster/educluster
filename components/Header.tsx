import React from 'react';
import { NextPage } from 'next';
import {
  AcademicCapIcon,
  CubeIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import { ChevronDownIcon, MenuIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import GlobalSearchField from './GlobalSearchField';
import Logo from './Logo';

const username = ''; // You can only access a username's profile if you have the authority (teacher or admin)
/*
# Profile is a dropdown with options PROFILE and SIGNIN/SIGNOUT
<Link href={`/profiles/${username}`}>
*/

const Header: NextPage = () => {
  return (
    <div className="sticky top-0 z-50 mb-8 flex h-20 items-center justify-between bg-white px-8 shadow-lg">
      {/* Logo */}
      <Logo />

      {/* Global Search Bar */}
      <GlobalSearchField placeholder="Nach beliebigen Inhalten suchen" />

      {/* Spaces, Profile and Notifications */}
      <div className="mx-5 flex items-center space-x-2 text-white lg:inline-flex">
        <Link href="/units">
          <div className="header-tab pr-2">
            <AcademicCapIcon className="icon" />
            <p className="text">Lerneinheiten</p>
          </div>
        </Link>
        <Link href="/clusters">
          <div className="header-tab pr-2">
            <CubeIcon className="icon" />
            <p className="text">Cluster</p>
          </div>
        </Link>
        <div className="header-tab">
          <BellIcon className="icon" />
        </div>
        <div className="header-tab">
          <UserCircleIcon className="icon" />
          <ChevronDownIcon className="inline h-5 w-5" />
        </div>
        <div className="header-menu-tab">
          <MenuIcon className="icon" />
        </div>
      </div>
    </div>
  );
};

export default Header;
