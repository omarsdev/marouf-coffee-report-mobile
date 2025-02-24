import AsyncStorage from '@react-native-async-storage/async-storage';
import {create, StateCreator} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

interface DateStore {
  reports: Record<string, any>;
  _hasHydrated: boolean;
  setReports: (assignmentId: string, reportId: string, reportData: any) => void;
  setHasHydrated: (state: boolean) => void;
}

const reportsStore: StateCreator<DateStore> = (set, get) => ({
  reports: {},
  _hasHydrated: false,

  setReports: (assignmentId, body) => {
    set(state => ({
      reports: {
        ...state.reports,
        [assignmentId]: body,
      },
    }));
  },
  setHasHydrated: state => {
    if (get()._hasHydrated !== state) {
      set({_hasHydrated: state});
    }
  },
});

const useReportsStore = create<DateStore>()(
  persist(reportsStore, {
    name: 'reportsCash',
    storage: createJSONStorage(() => AsyncStorage),
    onRehydrateStorage: () => state => {
      state?.setHasHydrated(true);
    },
    partialize: state => ({reports: state.reports}),
  }),
);

export default useReportsStore;
