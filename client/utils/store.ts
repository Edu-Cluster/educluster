import create from 'zustand';
import { User } from '../../types';

type Store = {
  authUser: User | null;
  pageLoading: boolean;
  setAuthUser: (user: User) => void;
  setPageLoading: (isLoading: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  pageLoading: false,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
  setPageLoading: (isLoading) =>
    set((state) => ({ ...state, pageLoading: isLoading })),
}));

export default useStore;