import React from 'react';
import {View, Text, ScrollView} from 'react-native';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {useNavigation} from '@react-navigation/native';

const CURRENT_REPORTS = {
  branch: 'Branch Name',
  date: '12/12/2021',
  tasks: [
    {task: 'Cleanliness', note: 'Cleanliness is good'},
    {task: 'Staff', note: 'Cleanliness is good'},
    {task: 'Food Quality', note: 'Cleanliness is good'},
    {task: 'Service', note: 'Cleanliness is good'},
    {task: 'Ambiance', note: 'Cleanliness is good'},
    {task: 'Safety', note: 'Cleanliness is good'},
    {task: 'Others', note: 'Cleanliness is good'},
  ],
};

const PreviousReportsScreen = () => {
  const navigation = useNavigation();

  const onNextNavigation = () => navigation.navigate('TicketsScreen');

  return (
    <ContainerComponents>
      <HeaderComponents />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
          Previous reports
        </Text>
        <View>
          {CURRENT_REPORTS.tasks.map((task, i) => (
            <View
              className="py-3 px-5 border-black border-[1px] rounded-2xl my-3"
              key={i}>
              <View className="flex-row gap-6 items-center">
                <View className="w-16 h-16 bg-[#F9E5A3] rounded-full justify-center items-center">
                  <Text>asd</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold leading-5 text-left text-[#1D1B20]">
                    Cleanliness Note
                  </Text>
                  <Text className="font-poppins text-lg font-medium leading-6 text-left text-[#4F4F4F]">
                    25/01/2025
                  </Text>
                </View>
              </View>
              <View className="mt-5">
                <Text className="text-lg font-medium leading-5 text-left text-[#49454F]">
                  The floor in the branch was not properly cleaned, with visible
                  dirt and debris in several areas.
                </Text>
              </View>
            </View>
          ))}
        </View>
        <CustomButton title="Next" onPress={onNextNavigation} />
      </ScrollView>
    </ContainerComponents>
  );
};

export default PreviousReportsScreen;
