import {ticketsAPI} from '@/api/tickets';
import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import useAuthStore from '@/store/useAuth';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';

const TasksScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const {user, isAreaManager} = useAuthStore();

  const {data, isLoading} = useQuery({
    queryFn: () =>
      ticketsAPI.get(
        user.role === 3 && user.branch_access
          ? {branches: user?.branch_access}
          : {area_manager: user?._id},
      ),
    queryKey: [
      'tickets',
      JSON.stringify(
        user.role === 3 && user.branch_access
          ? {branches: user?.branch_access}
          : {area_manager: user?._id},
      ),
    ],
    subscribed: isFocused,
  });

  const onTicketNavigation = ticketId => {
    return navigation.navigate('AddTicketsScreen', {
      ticketId,
      isUpdateDept: isAreaManager,
    });
  };

  return (
    <ContainerComponents>
      <HeaderComponents />
      <CustomLoadingProvider loading={isLoading}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data?.tickets?.map((ticket, i) => (
            <TouchableOpacity
              onPress={() => onTicketNavigation(ticket?._id)}
              className="py-3 px-5 border-black border-[1px] rounded-2xl my-3"
              key={i}>
              <View className="flex-row gap-6 items-center">
                <View className="w-16 h-16 bg-[#F9E5A3] rounded-full justify-center items-center">
                  <Text>asd</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold leading-5 text-left text-[#1D1B20]">
                    {ticket?.ticket_title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <EvilIcons name="location" size={16} color={'#000'} />
                    <Text className="font-poppins text-sm font-normal leading-6 text-left">
                      {ticket?.branch?.name?.en}
                    </Text>
                    {ticket?.status === 0 ? (
                      <View className="bg-[#BF7C00] px-2 rounded-3xl justify-center items-center ml-2">
                        <Text className="text-xs font-normal leading-6 text-left font-poppins text-white">
                          In Progress
                        </Text>
                      </View>
                    ) : (
                      <View className="bg-[#00BF29] px-2 rounded-3xl justify-center items-center ml-2">
                        <Text className="text-xs font-normal leading-6 text-left font-poppins text-white">
                          Completed
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm font-semibold leading-5 text-left text-[#1D1B20]">
                    From: {ticket?.user?.name?.en}
                  </Text>
                </View>
              </View>
              <View className="mt-5">
                <Text className="text-lg font-medium leading-5 text-left text-[#49454F]">
                  {ticket?.ticket_description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default TasksScreen;
