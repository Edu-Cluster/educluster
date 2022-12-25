import create from 'zustand';
import { User, Member } from '../lib/types';

// Note: Store only contains states that cannot be isolated in a single component

type Store = {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;

  settingsPopupOpen: boolean;
  setSettingsPopupOpen: (isOpen: boolean) => void;

  editMode: boolean;
  setEditMode: (inEditMode: boolean) => void;

  potentialMembers: Member[] | null;
  setPotentialMembers: (members: Member[] | null) => void;
  membersToInvite: Member[];
  setMembersToInvite: (members: Member[]) => void;

  cluster: any;
  setCluster: (items: any) => void;
  appointments: any;
  setAppointment: (items: any) => void;
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

  potentialMembers: null,
  setPotentialMembers: (members) =>
    set((state) => ({ ...state, potentialMembers: members })),
  membersToInvite: [],
  setMembersToInvite: (members) =>
    set((state) => ({ ...state, membersToInvite: members })),

  cluster: null,
  setCluster: (cluster) => set((state) => ({ ...state, cluster })),

  appointments: null,
  setAppointment: (appointments) =>
    set((state) => ({ ...state, appointments })),
}));

export default useStore;
