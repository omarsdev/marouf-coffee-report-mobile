import {create, StateCreator} from 'zustand';
import {isEqual} from 'lodash';

interface DateStore {
  tickets: object | null;
  defaultTickets: object;
  setTickets: (tickets: object) => void;
  hasChanged: () => boolean;
}

const ticketsStore: StateCreator<DateStore> = (set, get) => ({
  tickets: null,
  defaultTickets: {
    ticket_title: '',
    ticket_description: '',
    priority: null,
    status: 0,
    department: '',
    branch: '',
    area_manager: '',
  },
  setTickets: tickets => set({tickets}),

  hasChanged: () => {
    const {tickets, defaultTickets} = get();
    return tickets !== null && !isEqual(tickets, defaultTickets);
  },
});

const useTicketsStore = create<DateStore>()(ticketsStore);

export default useTicketsStore;
