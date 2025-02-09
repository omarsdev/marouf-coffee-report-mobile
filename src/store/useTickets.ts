import {create, StateCreator} from 'zustand';
import {isEqual} from 'lodash';

interface DateStore {
  tickets: object | null;
  defaultTickets: object;
  setTickets: (tickets: object) => void;
  hasChanged: () => boolean;
  reset: () => void;
}

const DEFAULT_TICKETS = {
  ticket_title: '',
  ticket_description: '',
  priority: null,
  status: 0,
  department: '',
  branch: '',
  area_manager: '',
};

const ticketsStore: StateCreator<DateStore> = (set, get) => ({
  tickets: null,
  defaultTickets: DEFAULT_TICKETS,
  setTickets: tickets => set({tickets}),
  reset: () => set({tickets: null, defaultTickets: DEFAULT_TICKETS}),
  hasChanged: () => {
    const {tickets, defaultTickets} = get();
    return tickets !== null && !isEqual(tickets, defaultTickets);
  },
});

const useTicketsStore = create<DateStore>()(ticketsStore);

export default useTicketsStore;
