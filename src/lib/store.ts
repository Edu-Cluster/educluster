import create from 'zustand';
import { AppointmentData, ClusterData, Notifications, User } from './types';
import { Room } from 'webuntis';
import { clusterAssociations } from './enums';

// Note: Store only contains states that cannot be isolated in a single component

type Store = {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;

  settingsPopupOpen: boolean;
  setSettingsPopupOpen: (isOpen: boolean) => void;

  notifications: Notifications[] | null;
  setNotifications: (notifications: Notifications[] | null) => void;
  newNotificationsAvailable: boolean;
  setNewNotificationsAvailable: (newAvailable: boolean) => void;

  editMode: boolean;
  setEditMode: (inEditMode: boolean) => void;

  potentialMembers: User[] | null;
  setPotentialMembers: (members: User[] | null) => void;
  membersToInvite: User[];
  setMembersToInvite: (members: User[]) => void;

  clusters: ClusterData[][] | null;
  setClusters: (clusters: ClusterData[][] | null) => void;
  appointments: AppointmentData[][] | null;
  setAppointments: (appointments: AppointmentData[][] | null) => void;
  rooms: Room[][] | null;
  setRooms: (rooms: Room[][] | null) => void;
  searchItemsLoading: boolean;
  setSearchItemsLoading: (status: boolean) => void;

  clusterAssociation:
    | clusterAssociations.IS_ADMIN
    | clusterAssociations.IS_MEMBER
    | clusterAssociations.IS_FOREIGNER
    | null;
  setClusterAssociation: (
    clusterAssociation:
      | clusterAssociations.IS_ADMIN
      | clusterAssociations.IS_MEMBER
      | clusterAssociations.IS_FOREIGNER
      | null,
  ) => void;

  beginTimes: any;
  setBeginTimes: (times: any) => void;
  endTimes: any;
  setEndTimes: (times: any) => void;

  equipment: any;
  setEquipment: (items: any) => void;
  roomSizesTerm: any;
  setRoomSizesTerm: (items: any) => void;
  roomSizesMin: any;
  setRoomSizesMin: (items: any) => void;
  roomSizesMax: any;
  setRoomSizesMax: (items: any) => void;

  clusterOfUser: any;
  setClusterOfUser: (items: any) => void;
  appointmentsOfUser: any;
  setAppointmentOfUser: (items: any) => void;
  userOfCluster: any;
  setUserOfCluster: (items: any) => void;
  appointmentOfCluster: any;
  setAppointmentOfCluster: (items: any) => void;
  clusterDetails: any;
  setClusterDetails: (clusterDetails: any) => void;

  potentialTopics: string[] | null;
  setPotentialTopics: (topics: string[] | null) => void;
  topics: string[] | null;
  setTopics: (topics: string[] | null) => void;
  potentialSubjects: string[] | null;
  setPotentialSubjects: (subjects: string[] | null) => void;
  subjects: string[] | null;
  setSubjects: (subjects: string[] | null) => void;

  searchPotentialMembersLoading: boolean;
  setSearchPotentialMembersLoading: (status: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),

  settingsPopupOpen: false,
  setSettingsPopupOpen: (isOpen) =>
    set((state) => ({ ...state, settingsPopupOpen: isOpen })),

  notifications: null,
  setNotifications: (notifications) =>
    set((state) => ({ ...state, notifications })),
  newNotificationsAvailable: false,
  setNewNotificationsAvailable: (newAvailable) =>
    set((state) => ({ ...state, newNotificationsAvailable: newAvailable })),

  editMode: false,
  setEditMode: (inEditMode) =>
    set((state) => ({ ...state, editMode: inEditMode })),

  potentialMembers: null,
  setPotentialMembers: (members) =>
    set((state) => ({ ...state, potentialMembers: members })),
  membersToInvite: [],
  setMembersToInvite: (members) =>
    set((state) => ({ ...state, membersToInvite: members })),

  clusters: null,
  setClusters: (clusters) => set((state) => ({ ...state, clusters })),
  appointments: null,
  setAppointments: (appointments) =>
    set((state) => ({ ...state, appointments })),
  rooms: null,
  // @ts-ignore
  setRooms: (rooms) => set((state) => ({ ...state, rooms })),
  searchItemsLoading: false,
  setSearchItemsLoading: (status) =>
    set((state) => ({ ...state, searchItemsLoading: status })),

  clusterAssociation: null,
  setClusterAssociation: (association) =>
    set((state) => ({ ...state, clusterAssociation: association })),

  beginTimes: null,
  setBeginTimes: (beginTimes) => set((state) => ({ ...state, beginTimes })),
  endTimes: null,
  setEndTimes: (endTimes) => set((state) => ({ ...state, endTimes })),

  equipment: null,
  setEquipment: (equipment) => set((state) => ({ ...state, equipment })),
  roomSizesTerm: null,
  setRoomSizesTerm: (roomSizesTerm) =>
    set((state) => ({ ...state, roomSizesTerm })),
  roomSizesMin: null,
  setRoomSizesMin: (roomSizesMin) =>
    set((state) => ({ ...state, roomSizesMin })),
  roomSizesMax: null,
  setRoomSizesMax: (roomSizesMax) =>
    set((state) => ({ ...state, roomSizesMax })),

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
  clusterDetails: null,
  setClusterDetails: (clusterDetails) =>
    set((state) => ({ ...state, clusterDetails })),

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

  searchPotentialMembersLoading: false,
  setSearchPotentialMembersLoading: (status) =>
    set((state) => ({ ...state, searchPotentialMembersLoading: status })),
}));

export default useStore;
