import React from 'react';
import {
  AcademicCapIcon,
  CubeIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import { MenuIcon } from '@heroicons/react/solid';
import Logo from '../Logo';
import HoverMenuOption from './HoverMenuOption';
import NotificationBell from './NotificationBell';
import ProfileBadge from './ProfileBadge';
import MenuDrawer from './MenuDrawer';
import SettingsCog from './SettingsCog';
import useStore from '../../lib/store';
import Avatar from '../Avatar';
import { useTheme } from 'next-themes';

const Header = () => {
  const user = useStore().authUser;
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === 'dark';

  return user ? (
    <div
      className={`sticky top-0 z-50 mb-8 flex h-20 items-center justify-between bg-white px-12 lg:px-36 shadow-lg${
        darkMode ? ' bg-slate-800' : ''
      }`}
    >
      <Logo />

      <div className="mx-5 flex items-center space-x-3 text-white lg:inline-flex">
        <HoverMenuOption
          darkMode={darkMode}
          options={[{ name: 'Lerneinheit suchen', link: '/termin/suche' }]}
        >
          <AcademicCapIcon
            className={`header-icon${darkMode ? ' text-white' : ''}`}
          />
          <p>Lerneinheit</p>
        </HoverMenuOption>

        <HoverMenuOption
          darkMode={darkMode}
          options={[
            { name: 'Cluster suchen', link: '/cluster/suche' },
            { name: 'Cluster erstellen', link: '/cluster/erstellen' },
          ]}
        >
          <CubeIcon className={`header-icon${darkMode ? ' text-white' : ''}`} />
          <p>Cluster</p>
        </HoverMenuOption>

        <ProfileBadge
          darkMode={darkMode}
          options={[{ text: 'Ausloggen', isLogout: true, link: '/login' }]}
        >
          {user?.username ? (
            <Avatar type="user" rounded={true} seed={user?.username} />
          ) : (
            <UserCircleIcon
              className={`header-icon${darkMode ? ' text-white' : ''}`}
            />
          )}
        </ProfileBadge>

        <NotificationBell darkMode={darkMode}>
          <BellIcon className={`header-icon${darkMode ? ' text-white' : ''}`} />
        </NotificationBell>

        <SettingsCog darkMode={darkMode} />

        <MenuDrawer
          options={[
            { name: 'Lerneinheit finden', link: '/termin/suche' },
            { name: 'Cluster finden', link: '/cluster/suche' },
            { name: 'Cluster erstellen', link: '/cluster/erstellen' },
            { name: 'Einstellungen', link: '/einstellungen' },
            { name: 'Ausloggen', link: '/login', isLogout: true },
          ]}
        >
          <MenuIcon className={`header-icon${darkMode ? ' text-white' : ''}`} />
        </MenuDrawer>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Header;
