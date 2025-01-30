import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import HeaderComponents from '@/components/HeaderComponents';
import ContainerComponents from '@/components/container/ContainerComponents';
import {normalize} from '@/utils';
import {twMerge} from 'tailwind-merge';
import CustomButton from '@/components/custom/CustomButton';
import {useNavigation} from '@react-navigation/native';

const TASKS = [
  'Cleanliness',
  'Staff',
  'Food Quality',
  'Service',
  'Ambiance',
  'Safety',
  'Others',
];

const TASKS_COLORS = [
  {bg: 'bg-[#FFF5D5]', btn: 'bg-[#F9E5A3]'},
  {bg: 'bg-[#A8D0E680]', btn: 'bg-[#A8D0E6]'},
  {bg: 'bg-[#D3A9E380]', btn: 'bg-[#D3A9E3]'},
  {bg: 'bg-[#B9E0D480]', btn: 'bg-[#B9E0D4]'},
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const onNextNavigate = () => navigation.navigate('PreviousReportsScreen');

  return (
    <ContainerComponents>
      <HeaderComponents />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-7 gap-3">
          <Text className="font-poppins text-lg font-normal leading-6 text-left">
            Branch Name
          </Text>
          <View className="p-5 flex-row gap-4 bg-[#F3F3F3] rounded-2xl">
            <EvilIcons name="location" size={22} color={'#000'} />
            <Text className="font-poppins text-lg font-normal leading-6 text-left">
              Branch Name
            </Text>
          </View>
        </View>
        <View className="mt-7">
          <Text className="font-poppins text-xl font-normal leading-7 text-left">
            Keep the branches running smoothly, start with detailed checklist
            directly from here!
          </Text>
        </View>

        <View className="mt-7">
          <View className="flex-row gap-3 items-center">
            <Fontisto name="fire" size={20} />
            <Text className="font-poppins text-lg font-normal leading-6 text-left">
              Checklist
            </Text>
          </View>
          <View className="mt-3 h-[5px] bg-[#AEAEAE] w-full relative rounded-3xl">
            <View className="absolute z-10 left-0 top-0 bottom-0 w-1/2 bg-black rounded-3xl" />
          </View>
          <View className="gap-4 pt-7">
            {TASKS.map((task, i) => {
              const {bg, btn} = TASKS_COLORS[i % TASKS_COLORS.length];
              return (
                <View
                  className={twMerge(
                    'py-4 px-2 flex-row justify-between rounded-xl items-center',
                    bg,
                  )}
                  key={i}>
                  <Text className="font-poppins text-lg font-normal leading-6 text-left">
                    {task}
                  </Text>
                  <View className="flex-row gap-5">
                    <TouchableOpacity
                      className={twMerge('px-3 py-[6px] rounded-3xl', btn)}>
                      <Text
                        className="font-poppins font-normal"
                        style={{fontSize: normalize(16)}}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#F9A3A3] px-3 py-[6px] rounded-3xl">
                      <Text
                        className="font-poppins font-normal"
                        style={{fontSize: normalize(16)}}>
                        No
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={twMerge('px-3 py-[6px] rounded-3xl', btn)}>
                      <Text
                        className="font-poppins font-normal"
                        style={{fontSize: normalize(16)}}>
                        Add Note
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <CustomButton className="mt-7" title="Next" onPress={onNextNavigate} />
      </ScrollView>
    </ContainerComponents>
  );
};

export default HomeScreen;
