import React from 'react';
import {View, Text, ScrollView} from 'react-native';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {assignmentsAPI} from '@/api/assignments';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {format} from 'date-fns';

const PreviousReportsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {data, isLoading} = useQuery({
    queryFn: () =>
      assignmentsAPI.get({
        completed: true,
      }),
    queryKey: ['reportscompleted'],
    subscribed: isFocused,
  });

  const onNextNavigation = () => navigation.navigate('TicketsScreen');

  return (
    <ContainerComponents>
      <HeaderComponents />
      <CustomLoadingProvider loading={isLoading}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
            Previous reports
          </Text>
          <View>
            {data?.assignments?.map((assignment, i) => (
              <View
                className="py-3 px-5 border-black border-[1px] rounded-2xl my-3"
                key={i}>
                <View className="flex-row gap-6 items-center">
                  <View className="w-16 h-16 bg-[#F9E5A3] rounded-full justify-center items-center">
                    <Text>
                      {assignment?.branch?.name?.en[0]?.toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm font-semibold leading-5 text-left text-[#1D1B20]">
                      {assignment?.reportId?.title}
                    </Text>
                    <Text className="font-poppins text-lg font-medium leading-6 text-left text-[#4F4F4F]">
                      {format(new Date(assignment?.created_at), 'dd/MM/yyyy')}
                    </Text>
                  </View>
                </View>
                <View className="mt-5">
                  <Text className="text-lg font-medium leading-5 text-left text-[#49454F]">
                    {assignment?.reportId?.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <CustomButton title="Next" onPress={onNextNavigation} />
        </ScrollView>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default PreviousReportsScreen;
