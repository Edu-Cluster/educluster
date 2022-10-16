import React from 'react';
import { CogIcon } from '@heroicons/react/outline';
import useStore from '../../client/store';

const SettingsCog = () => {
  const store = useStore();

  return (
    <div
      className="header-option"
      onClick={() => store.setSettingsPopupOpen(!store.settingsPopupOpen)}
    >
      <CogIcon className="header-icon" />
    </div>
  );
};

export default SettingsCog;
