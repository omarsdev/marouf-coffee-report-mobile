import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import HeaderComponents from '@/components/HeaderComponents';
import ContainerComponents from '@/components/container/ContainerComponents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {twMerge} from 'tailwind-merge';
import CustomButton from '@/components/custom/CustomButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import useDateStore from '@/store/useDateStore';
import {useQuery} from '@tanstack/react-query';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {assignmentsAPI} from '@/api/assignments';
import _ from 'lodash';
import useAuthStore from '@/store/useAuth';

const TASKS_COLORS = [
  {bg: 'bg-[#FFF5D5]', btn: 'bg-[#F9E5A3]'},
  {bg: 'bg-[#A8D0E680]', btn: 'bg-[#A8D0E6]'},
  {bg: 'bg-[#D3A9E380]', btn: 'bg-[#D3A9E3]'},
  {bg: 'bg-[#B9E0D480]', btn: 'bg-[#B9E0D4]'},
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const {selectedBranch, date} = useDateStore();
  const {isAreaManager} = useAuthStore();
  const isFocused = useIsFocused();

  const {data, isLoading} = useQuery({
    queryFn: () =>
      assignmentsAPI.get({
        branch: selectedBranch?._id,
        date: date,
      }),
    queryKey: ['reports' + String(date) + String(selectedBranch?._id)],
    subscribed: isFocused,
  });

  const onNextNavigate = () => navigation.navigate('PreviousReportsScreen');

  return (
    <ContainerComponents>
      <HeaderComponents />

      <CustomLoadingProvider loading={isLoading}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedBranch?.name && (
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
          )}
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
              {data?.assignments?.map((assignment, assignmentIndex) => {
                const {bg} = TASKS_COLORS[assignmentIndex % 2];
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ReportScreen', {
                        assignmentId: assignment?._id,
                      });
                    }}
                    className={twMerge(
                      'py-4 px-2 flex-row items-center rounded-xl gap-5',
                      bg,
                    )}
                    key={assignment?.reportId?._id}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      color="#303030"
                      size={29}
                    />
                    {/*  */}
                    <Text className="font-poppins text-lg font-normal leading-6 text-left">
                      {assignment?.reportId?.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <CustomButton
            className="mt-7"
            title="Next"
            disabled={!isAreaManager ? false : data?.assignments?.length > 0}
            onPress={onNextNavigate}
          />
        </ScrollView>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default HomeScreen;
