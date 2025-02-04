import {create, StateCreator} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DateStore {
  date: string;
  selectedBranch: object | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setDate: (dateParams: string) => void;
  setSelectedBranchBranch: (branch: any) => void;
  resetDateStore: () => void;
}

const dateStore: StateCreator<DateStore> = (set, get) => ({
  date: '',
  selectedBranch: null,
  _hasHydrated: false,

  setHasHydrated: state => {
    if (get()._hasHydrated !== state) {
      set({_hasHydrated: state});
    }
  },

  setDate: dateParams => set({date: dateParams}),
  setSelectedBranchBranch: selectedBranch => set({selectedBranch}),
  resetDateStore: () =>
    set({
      date: '',
      selectedBranch: null,
    }),
});

const useDateStore = create<DateStore>()(
  persist(dateStore, {
    name: 'dateSetting',
    storage: createJSONStorage(() => AsyncStorage),
    onRehydrateStorage: () => state => {
      state?.setHasHydrated(true);
    },
    partialize: state => ({date: state.date}),
  }),
);

export default useDateStore;
