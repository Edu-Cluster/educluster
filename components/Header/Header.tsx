import React from 'react';
import {
  AcademicCapIcon,
  CubeIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import { MenuIcon } from '@heroicons/react/solid';
import Logo from './Logo';
import HoverMenuOption from './HoverMenuOption';
import NotificationBell from './NotificationBell';
import ProfileBadge from './ProfileBadge';
import MenuDrawer from './MenuDrawer';
import SettingsCog from './SettingsCog';
import useStore from '../../client/store';

// Notification Bell
const notifications = [
  'test1sdafsfasfdasdfasdfasfdasfasfasfdasdfasfdasdfasfasdfasfdasdfasdfasdfasdasdf',
  'test2',
  'test3',
  'test4',
  'test5',
  'test6',
  'test7',
  'test8',
];

// Menu Drawer
const options = [
  'Lerneinheit finden',
  'Cluster finden',
  'Cluster erstellen',
  'Profil',
  'Ausloggen',
  'Einstellungen',
];
const notificationOptions = [
  'test1sdafsfasfdasdfasdfasfdasfasfasfdasdfasfdasdfasfasdfasfdasdfasdfasdfasdasdf',
  'test2',
  'test3',
  'test4',
  'test5',
  'test6',
  'test7',
  'test8',
];

const Header = () => {
  const user = useStore().authUser;

  return user ? (
    <div className="sticky top-0 z-50 mb-8 flex h-20 items-center justify-between bg-white px-12 lg:px-36 shadow-lg">
      <Logo />

      <div className="mx-5 flex items-center space-x-3 text-white lg:inline-flex">
        <HoverMenuOption options={['Lerneinheit suchen']}>
          <AcademicCapIcon className="header-icon" />
          <p className="text">Lerneinheit</p>
        </HoverMenuOption>

        <HoverMenuOption options={['Cluster suchen', 'Cluster erstellen']}>
          <CubeIcon className="header-icon" />
          <p className="text">Cluster</p>
        </HoverMenuOption>

        <ProfileBadge
          options={[{ text: 'Ausloggen', isLogout: true, link: null }]}
        >
          <UserCircleIcon className="header-icon" />
        </ProfileBadge>

        <NotificationBell notifications={notifications}>
          <BellIcon className="header-icon" />
        </NotificationBell>

        <SettingsCog />

        <MenuDrawer options={options} notificationOptions={notificationOptions}>
          <MenuIcon className="header-icon" />
        </MenuDrawer>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Header;