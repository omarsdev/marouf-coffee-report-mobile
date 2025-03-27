import {View, Text} from 'react-native';
import React from 'react';
import useDateStore from '@/store/useDateStore';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const SelectedBranchComponents = () => {
  const {selectedBranch} = useDateStore();
  return (
    selectedBranch?.name && (
      <View className="mt-7 gap-3">
        <Text className="font-poppins text-lg font-normal leading-6 text-left">
          Branch Name
        </Text>
        <View className="p-5 flex-row gap-4 bg-[#F3F3F3] rounded-2xl">
          <EvilIcons name="location" size={22} color={'#000'} />
          <Text className="font-poppins text-lg font-normal leading-6 text-left">
            {selectedBranch?.name?.en}
          </Text>
        </View>
      </View>
    )
  );
};

export default SelectedBranchComponents;
