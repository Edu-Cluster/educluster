import React from 'react';
import { CogIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const SettingsCog = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <Link href={'/einstellungen'}>
      <div className={`header-option${darkMode ? ' hover:bg-slate-400' : ''}`}>
        <CogIcon className={`header-icon${darkMode ? ' text-white' : ''}`} />
      </div>
    </Link>
  );
};

export default SettingsCog;
