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

  potentialTopics: string[] | null;
  setPotentialTopics: (topics: string[] | null) => void;
  topics: string[] | null;
  setTopics: (topics: string[] | null) => void;
  potentialSubjects: string[] | null;
  setPotentialSubjects: (subjects: string[] | null) => void;
  subjects: string[] | null;
  setSubjects: (subjects: string[] | null) => void;
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

  potentialTopics: null,
  setPotentialTopics: (potentialTopics) =>
    set((state) => ({ ...state, potentialTopics })),
  topics: null,
  setTopics: (topics) => set((state) => ({ ...state, topics })),
  potentialSubjects: null,
  setPotentialSubjects: (potentialSubjects) =>
    set((state) => ({ ...state, potentialSubjects })),
  subjects: null,
  setSubjects: (subjects) => set((state) => ({ ...state, subjects })),
}));

export default useStore;
