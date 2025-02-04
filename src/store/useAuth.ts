import {create, StateCreator} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userAPI} from '@/api/user';

interface AuthStore {
  token: string | null;
  user: object | null;
  isAreaManager: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setToken: (state: string) => void;
  setUser: (state: any) => void;
  resetAuthStore: () => void;
  refetchUser: () => Promise<void>;
}

const authStore: StateCreator<AuthStore> = (set, get) => ({
  token: null,
  user: null,
  isAreaManager: false,
  _hasHydrated: false,

  setHasHydrated: state => {
    if (get()._hasHydrated !== state) {
      set({_hasHydrated: state});
    }
  },
  setToken: (token: string) => set({token}),
  setUser: (user: any) => set({user, isAreaManager: user?.role === 2}),
  refetchUser: async () => {
    const res = (await userAPI.me()) as any;
    set({user: res});
  },
  resetAuthStore: () =>
    set({
      token: null,
      user: null,
      isAreaManager: false,
    }),
});

const useAuthStore = create<AuthStore>()(
  persist(authStore, {
    name: 'auth',
    storage: createJSONStorage(() => AsyncStorage),
    onRehydrateStorage: () => state => {
      state?.setHasHydrated(true);
    },
    partialize: state => ({token: state.token}),
  }),
);

export default useAuthStore;
