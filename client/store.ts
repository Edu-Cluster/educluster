import create from 'zustand';
import { User, Member } from '../lib/types';
import { Room } from 'webuntis';

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

  rooms: Room[][] | null;
  setRooms: (rooms: Room[][] | null) => void;
  beginTimes: any;
  setBeginTimes: (times: any) => void;
  endTimes: any;
  setEndTimes: (times: any) => void;

  clusterOfUser: any;
  setClusterOfUser: (items: any) => void;
  appointmentsOfUser: any;
  setAppointmentOfUser: (items: any) => void;
  userOfCluster: any;
  setUserOfCluster: (items: any) => void;
  appointmentOfCluster: any;
  setAppointmentOfCluster: (items: any) => void;

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

  rooms: null,
  setRooms: (rooms) => set((state) => ({ ...state, rooms })),
  beginTimes: null,
  setBeginTimes: (beginTimes) => set((state) => ({ ...state, beginTimes })),
  endTimes: null,
  setEndTimes: (endTimes) => set((state) => ({ ...state, endTimes })),

  clusterOfUser: null,
  setClusterOfUser: (clusterOfUser) =>
    set((state) => ({ ...state, clusterOfUser })),
  appointmentsOfUser: null,
  setAppointmentOfUser: (appointmentsOfUser) =>
    set((state) => ({ ...state, appointmentsOfUser })),

  userOfCluster: null,
  setUserOfCluster: (userOfCluster) =>
    set((state) => ({ ...state, userOfCluster })),
  appointmentOfCluster: null,
  setAppointmentOfCluster: (appointmentOfCluster) =>
    set((state) => ({ ...state, appointmentOfCluster })),

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
