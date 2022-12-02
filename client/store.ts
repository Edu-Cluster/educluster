import create from 'zustand';
import { User } from '../lib/types';

// Note: Store only contains states that cannot be isolated in a single component

type Store = {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;

  settingsPopupOpen: boolean;
  setSettingsPopupOpen: (isOpen: boolean) => void;

  editMode: boolean;
  setEditMode: (inEditMode: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),

  settingsPopupOpen: false,
  setSettingsPopupOpen: (isOpen) =>
    set((state) => ({ ...state, settingsPopupOpen: isOpen })),

  editMode: false,
  setEditMode: (inEditMode) =>
    set((state) => ({ ...state, editMode: inEditMode })),
}));

export default useStore;
