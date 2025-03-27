import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {assignmentsAPI} from '@/api/assignments';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {format} from 'date-fns';
import useDateStore from '@/store/useDateStore';
import useAuthStore from '@/store/useAuth';
import SelectedBranchComponents from '@/components/SelectedBranchComponents';

const PreviousReportsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {user} = useAuthStore();
  const isCheckedIn = user?.current_branch && user?.active;
  const {selectedBranch} = useDateStore();

  const {data, isLoading} = useQuery({
    queryFn: () =>
      assignmentsAPI.get({
        completed: true,
        ...(isCheckedIn &&
          selectedBranch?._id && {
            branch: selectedBranch?._id,
          }),
      }),
    queryKey: ['reportscompleted' + selectedBranch?._id + isCheckedIn],
    subscribed: isFocused,
  });

  const onNextNavigation = () => navigation.navigate('TicketsScreen');

  const onViewHandler = id => {
    navigation.navigate('PreviousReportsInfoScreen', {
      assignmentId: id,
    });
  };

  return (
    <ContainerComponents>
      <HeaderComponents />
      <CustomLoadingProvider loading={isLoading}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SelectedBranchComponents />
          <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
            Previous reports
          </Text>
          <View>
            {data?.assignments?.map((assignment, i) => (
              <TouchableOpacity
                onPress={() => onViewHandler(assignment?._id)}
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
                      {format(
                        new Date(assignment?.submission?.submittedAt),
                        'dd/MM/yyyy',
                      )}
                    </Text>
                  </View>
                </View>
                <View className="mt-5">
                  <Text className="text-lg font-medium leading-5 text-left text-[#49454F]">
                    {assignment?.reportId?.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <CustomButton title="Next" onPress={onNextNavigation} />
        </ScrollView>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default PreviousReportsScreen;
