import React from 'react';
import {Calendar} from 'react-native-calendars';

import useDateStore from '@/store/useDateStore';

const CalenderComponents = () => {
  const {date, setDate} = useDateStore();

  return (
    <Calendar
      onDayPress={day => {
        setDate(day.dateString);
      }}
      style={{
        backgroundColor: '#F3F3F3',
        paddingBottom: 20,
        borderRadius: 20,
      }}
      theme={{
        backgroundColor: '#F3F3F3',
        calendarBackground: '#F3F3F3',
        arrowColor: '#49454F',
        textSectionTitleColor: '#49454F',
        dayTextColor: '#1D1B20',
        selectedDayBackgroundColor: '#000',
        selectedDayTextColor: '#fff',
      }}
      markedDates={{
        [date]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: 'orange',
        },
      }}
    />
  );
};

export default CalenderComponents;
