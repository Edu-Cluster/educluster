import React from 'react';
import {
  AcademicCapIcon,
  CubeIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import Logo from '../Logo';
import HoverMenuOption from './HoverMenuOption';
import NotificationBell from './NotificationBell';
import ProfileBadge from './ProfileBadge';
import { MenuIcon } from '@heroicons/react/solid';
import MenuDrawer from './MenuDrawer';

type Props = {
  isSignedIn: boolean;
};

const Header = ({ isSignedIn }: Props) => {
  return isSignedIn ? (
    <div className="sticky top-0 z-50 mb-8 flex h-20 items-center justify-between bg-white px-12 lg:px-36 shadow-lg">
      <Logo />

      <div className="mx-5 flex items-center space-x-3 text-white lg:inline-flex">
        <HoverMenuOption options={['Termin suchen']}>
          <AcademicCapIcon className="header-icon" />
          <p className="text">Termin</p>
        </HoverMenuOption>

        <HoverMenuOption options={['Cluster suchen', 'Cluster erstellen']}>
          <CubeIcon className="header-icon" />
          <p className="text">Cluster</p>
        </HoverMenuOption>

        <ProfileBadge options={['Profil', 'Einstellungen', 'Ausloggen']}>
          <UserCircleIcon className="header-icon" />
        </ProfileBadge>

        <NotificationBell
          options={[
            'test1sdafsfasfdasdfasdfasfdasfasfasfdasdfasfdasdfasfasdfasfdasdfasdfasdfasdasdf',
            'test2',
            'test3',
            'test4',
            'test5',
            'test6',
            'test7',
            'test8',
          ]}
        >
          <BellIcon className="header-icon" />
        </NotificationBell>

        <MenuDrawer
          options={[
            'Termin finden',
            'Cluster finden',
            'Cluster erstellen',
            'Profil',
            'Einstellungen',
            'Ausloggen',
          ]}
          notificationOptions={[
            'test1sdafsfasfdasdfasdfasfdasfasfasfdasdfasfdasdfasfasdfasfdasdfasdfasdfasdasdf',
            'test2',
            'test3',
            'test4',
            'test5',
            'test6',
            'test7',
            'test8',
          ]}
        >
          <MenuIcon className="header-icon" />
        </MenuDrawer>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Header;
