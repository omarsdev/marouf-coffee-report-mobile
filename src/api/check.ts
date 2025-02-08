import useTicketsStore from '@/store/useTickets';
import {HttpCall} from './HttpCall';
import {showMessage} from 'react-native-flash-message';

export const checkAPI = {
  in: async (body: any) => await HttpCall('/checks/check_in', 'POST', body),

  out: async (branch: any) => {
    const {hasChanged} = useTicketsStore.getState();

    if (hasChanged()) {
      const message =
        'There are unsaved changes in your tickets. Please review before logging out.';
      showMessage({
        message,
        type: 'danger',
      });
      throw new Error(message);
    }

    return await HttpCall('/checks/check_out', 'POST', {branch});
  },
};
