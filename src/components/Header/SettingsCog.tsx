import React from 'react';
import { CogIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const SettingsCog = () => {
  return (
    <Link href={'/einstellungen'}>
      <div className="header-option">
        <CogIcon className="header-icon" />
      </div>
    </Link>
  );
};

export default SettingsCog;
