import create from 'zustand';
import { User } from '../lib/types';

// Note: Store only contains states that cannot be isolated in a single component

type Store = {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;

  introPopupOpen: boolean;
  setIntroPopupOpen: (isOpen: boolean) => void;

  settingsPopupOpen: boolean;
  setSettingsPopupOpen: (isOpen: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),

  settingsPopupOpen: false,
  setSettingsPopupOpen: (isOpen) =>
    set((state) => ({ ...state, settingsPopupOpen: isOpen })),

  introPopupOpen: false,
  setIntroPopupOpen: (isOpen) =>
    set((state) => ({ ...state, introPopupOpen: isOpen })),
}));

export default useStore;
