import React from 'react';
import {View} from 'react-native';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CalenderComponents from '@/components/CalenderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {useNavigation} from '@react-navigation/native';
import useDateStore from '@/store/useDateStore';
import {twMerge} from 'tailwind-merge';
import useAuthStore from '@/store/useAuth';

const CalenderScreen = () => {
  const navigation = useNavigation();

  const {date} = useDateStore();
  const {user} = useAuthStore();
  const isCheckedIn = user?.current_branch && user?.active;

  const onNextHandler = () => {
    navigation.navigate(isCheckedIn ? 'HomeScreen' : 'SeeScheduleScreen');
  };

  return (
    <ContainerComponents>
      <HeaderComponents />
      <View className="flex-1 mt-10">
        <CalenderComponents />
      </View>
      <CustomButton
        disabled={!date}
        className={twMerge(!date && 'opacity-50')}
        onPress={onNextHandler}
        title="Next"
      />
    </ContainerComponents>
  );
};

export default CalenderScreen;
