import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {format} from 'date-fns';
import {twMerge} from 'tailwind-merge';
import Feather from 'react-native-vector-icons/Feather';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import useDateStore from '@/store/useDateStore';
import {normalize} from '@/utils';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '@/components/custom/CustomButton';

const Branches = [
  'Abdali',
  'Al Yasmeen',
  'Khalda',
  'Abdali',
  'Al Yasmeen',
  'Khalda',
];

const SeeScheduleScreen = () => {
  const navigation = useNavigation();
  const {date} = useDateStore();

  const [branches, setBranches] = useState(
    Branches.map((branch, i) => ({name: branch, index: i, selected: false})),
  );

  const colors = ['bg-[#F3DFF6]', 'bg-[#E5F2FE]', 'bg-[#DFEBE3]'];
  const borderColor = ['#820A8F', '#204782', '#2E7042'];
  const borderColor1 = [
    'border-[#820A8F]',
    'border-[#204782]',
    'border-[#2E7042]',
  ];

  const onCheckBranch = index => {
    setBranches(old => {
      return old.map(branch => {
        if (branch.index === index) {
          return {...branch, selected: !branch.selected};
        }
        return branch;
      });
    });
  };

  const onBranchesNavigation = () => {
    navigation.navigate('ChooseBranchScreen');
  };
  const onBranchTaskNavigation = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <ContainerComponents>
      <HeaderComponents />
      <ScrollView className="pb-20" showsVerticalScrollIndicator={false}>
        <View className="gap-10">
          <Text className="font-poppins" style={{fontSize: normalize(60)}}>
            {format(new Date(date), 'EEEE')}
            {'\n'}
            {format(new Date(date), 'd LLL yyyy')}
          </Text>
          <Text className="font-poppinsLight" style={{fontSize: normalize(30)}}>
            This is your schedule for today
          </Text>
          <TouchableOpacity onPress={onBranchesNavigation}>
            <Text
              className="font-poppinsLight underline"
              style={{fontSize: normalize(25)}}>
              See All Branches
            </Text>
          </TouchableOpacity>
        </View>
        <View className="gap-8 pt-6">
          {branches.map((branch, i) => (
            <View className="relative" key={i}>
              <View className="absolute w-[3px] h-full left-0 z-10 py-[10px]">
                <View
                  className={twMerge(
                    'flex-1 rounded-r-xl',
                    `bg-[${borderColor[i % 3]}]`,
                  )}
                />
              </View>
              <View
                className={twMerge(
                  'p-4 rounded-xl flex-row justify-between',
                  colors[i % 3],
                )}
                key={i}>
                <Text
                  className="font-poppins"
                  style={{fontSize: normalize(18)}}>
                  {branch.name}
                </Text>
                <TouchableOpacity onPress={() => onCheckBranch(i)}>
                  <View
                    className={twMerge(
                      'h-6 w-6 border-2 justify-center items-center',
                      borderColor1[i % 3],
                      branch.selected && `bg-[${borderColor[i % 3]}]`,
                    )}>
                    {branch.selected && (
                      <Feather name="check" size={13} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <CustomButton
          title="Next"
          onPress={onBranchTaskNavigation}
          className="mt-5"
        />
      </ScrollView>
    </ContainerComponents>
  );
};

export default SeeScheduleScreen;
