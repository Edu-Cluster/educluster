import React from 'react';
import { CogIcon } from '@heroicons/react/outline';
import useStore from '../../lib/store';

const SettingsCog = () => {
  const { setSettingsPopupOpen, settingsPopupOpen } = useStore();

  return (
    <div
      className="header-option"
      onClick={() => setSettingsPopupOpen(!settingsPopupOpen)}
    >
      <CogIcon className="header-icon" />
    </div>
  );
};

export default SettingsCog;
