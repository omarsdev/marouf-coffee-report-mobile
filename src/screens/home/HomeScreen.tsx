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
import useDateStore from '@/store/useDateStore';
import {useQuery} from '@tanstack/react-query';
import {ticketsAPI} from '@/api/tickets';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {reportsAPI} from '@/api/reports';
import useAuthStore from '@/store/useAuth';
import {assignmentsAPI} from '@/api/assignments';
import {redux} from 'zustand/middleware';
import {submissionsAPI} from '@/api/submissions';

const TASKS_COLORS = [
  {bg: 'bg-[#FFF5D5]', btn: 'bg-[#F9E5A3]'},
  {bg: 'bg-[#A8D0E680]', btn: 'bg-[#A8D0E6]'},
  {bg: 'bg-[#D3A9E380]', btn: 'bg-[#D3A9E3]'},
  {bg: 'bg-[#B9E0D480]', btn: 'bg-[#B9E0D4]'},
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const {selectedBranch, date} = useDateStore();

  const {data, isLoading, refetch} = useQuery({
    queryFn: () =>
      assignmentsAPI.get({
        branch: selectedBranch?._id,
        date: date,
      }),
    queryKey: ['reports' + String(date) + String(selectedBranch?._id)],
  });

  const onNextNavigate = () => navigation.navigate('PreviousReportsScreen');

  const onCreate = async (type, assignment, question) => {
    const body = {
      reportId: assignment?.reportId?._id,
      answers: [
        {
          questionId: question?._id,
          answer: type,
        },
      ],
      assignmentId: assignment?._id,
    };

    try {
      const res = await submissionsAPI.create(body);
      await refetch();
    } catch (error) {}
  };

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
              {data?.assignments?.map(assignment => {
                return assignment?.reportId?.questions?.map(
                  (question, questionIndex) => {
                    const {bg, btn} = TASKS_COLORS[questionIndex % 2];
                    return (
                      <View
                        className={twMerge(
                          'py-4 px-2 flex-col justify-between rounded-xl ',
                          bg,
                        )}
                        key={questionIndex}>
                        <Text className="font-poppins text-lg font-normal leading-6 text-left">
                          {question?.text}
                        </Text>
                        <View className="flex-row gap-5 justify-end mt-3">
                          <TouchableOpacity
                            onPress={() =>
                              onCreate('Yes', assignment, question)
                            }
                            className={twMerge(
                              'px-3 py-[6px] rounded-3xl',
                              btn,
                            )}>
                            <Text
                              className="font-poppins font-normal"
                              style={{fontSize: normalize(16)}}>
                              Yes
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => onCreate('No', assignment, question)}
                            className="bg-[#F9A3A3] px-3 py-[6px] rounded-3xl">
                            <Text
                              className="font-poppins font-normal"
                              style={{fontSize: normalize(16)}}>
                              No
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              onCreate('Note', assignment, question)
                            }
                            className={twMerge(
                              'px-3 py-[6px] rounded-3xl',
                              btn,
                            )}>
                            <Text
                              className="font-poppins font-normal"
                              style={{fontSize: normalize(16)}}>
                              Add Note
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  },
                );
              })}
            </View>
          </View>

          <CustomButton
            className="mt-7"
            title="Next"
            disabled={data?.assignments?.length > 0}
            onPress={onNextNavigate}
          />
        </ScrollView>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default HomeScreen;
