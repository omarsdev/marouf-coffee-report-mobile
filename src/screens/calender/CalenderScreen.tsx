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
  const {user, isAreaManager} = useAuthStore();
  const isCheckedIn = user?.current_branch && user?.active;

  return (
    <ContainerComponents>
      <HeaderComponents />
      <View className="flex-1 mt-10">
        <CalenderComponents />
      </View>
      <CustomButton
        disabled={!date}
        className={twMerge(!date && 'opacity-50')}
        onPress={() =>
          navigation.navigate(
            isCheckedIn
              ? 'HomeScreen'
              : isAreaManager
              ? 'SeeScheduleScreen'
              : 'HomeScreen',
          )
        }
        title="Next"
      />
    </ContainerComponents>
  );
};

export default CalenderScreen;
