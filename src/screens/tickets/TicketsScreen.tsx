import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Platform} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {twMerge} from 'tailwind-merge';

import ContainerComponents from '@/components/container/ContainerComponents';
import CustomButton from '@/components/custom/CustomButton';
import HeaderComponents from '@/components/HeaderComponents';
import {ticketsAPI} from '@/api/tickets';
import {useQuery} from '@tanstack/react-query';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {departmentsAPI} from '@/api/departments';
import CustomDropdown from '@/components/custom/CustomDropdown';
import {checkAPI} from '@/api/check';
import {request} from 'react-native-permissions';
import {getCurrentLocation} from '@/utils/location';
import useDateStore from '@/store/useDateStore';
import useAuthStore from '@/store/useAuth';
import {branchesAPI} from '@/api/branches';

const TicketsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {selectedBranch} = useDateStore();
  const {user, refetchUser, isAreaManager} = useAuthStore();

  const isCheckedIn = isAreaManager && user?.current_branch && user?.active;

  const [query, setQuery] = useState({
    status: null,
    department: null,
    branch: null,
  });

  const {data, isLoading} = useQuery({
    queryFn: () => ticketsAPI.get(query),
    queryKey: ['tickets', JSON.stringify(query)],
    subscribed: isFocused,
  });
  const {data: departmentsData, isLoading: departmentsLoading} = useQuery({
    queryFn: departmentsAPI.get,
    queryKey: ['departments'],
    select: data => {
      return data?.departments?.map(e => ({
        label: e?.department_name?.en,
        value: e?._id,
      }));
    },
    subscribed: isFocused,
  });
  const {data: branchesData, isLoading: branchesLoading} = useQuery({
    queryFn: branchesAPI.get,
    subscribed: isFocused,
    queryKey: ['branches'],
    select: data => {
      return data?.branches?.map(e => ({
        label: e?.name?.en,
        value: e?._id,
      }));
    },
  });

  const onCheckoutHandler = async () => {
    try {
      await request(
        Platform.OS === 'ios'
          ? 'ios.permission.LOCATION_WHEN_IN_USE'
          : 'android.permission.ACCESS_FINE_LOCATION',
      ).then(async () => {
        const {latitude, longitude} = await getCurrentLocation();
        const res = await checkAPI.out({
          branch: selectedBranch?._id,
          lat: latitude,
          lng: longitude,
        });
        await refetchUser();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'CalenderScreen'}],
          }),
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onCreateTicketNavigation = () => {
    return navigation.navigate('AddTicketsScreen');
  };
  const onTicketNavigation = ticketId => {
    return navigation.navigate('AddTicketsScreen', {
      ticketId,
    });
  };

  const numberOfInProgress =
    data?.tickets?.filter(e => e?.status === 0)?.length || 0;
  const numberOfCompleted =
    data?.tickets?.filter(e => e?.status !== 0)?.length || 0;

  return (
    <ContainerComponents className="relative">
      <HeaderComponents />
      <CustomLoadingProvider loading={departmentsLoading || branchesLoading}>
        <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
          Tickets list
        </Text>
        <View className="flex-row gap-5 mb-4">
          <View className="flex-1">
            <Text className="font-poppins font-normal leading-6 text-left text-lg">
              Department
            </Text>
            <CustomDropdown
              data={departmentsData}
              placeholder="All"
              value={query.department}
              onChange={value =>
                setQuery(old => ({
                  ...old,
                  department: old.department === value ? null : value,
                }))
              }
            />
          </View>
          <View className="flex-1">
            <Text className="font-poppins font-normal leading-6 text-left text-lg">
              Branch
            </Text>
            <CustomDropdown
              data={branchesData}
              placeholder="All"
              value={query.branch}
              onChange={value =>
                setQuery(old => ({
                  ...old,
                  branch: old.branch === value ? null : value,
                }))
              }
            />
          </View>
        </View>
        <View className="self-end">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className={twMerge(
                'flex-row rounded-3xl border-[1px] border-black px-3 py-2 gap-3',
                query.status === 1 && 'bg-slate-300',
              )}
              onPress={() =>
                setQuery(old => ({
                  ...old,
                  status: old?.status === 1 ? null : 1,
                }))
              }>
              <Text className="font-poppins font-normal leading-6 text-left">
                Complete
              </Text>
              <View className="bg-[#00BF29] px-2 rounded-3xl justify-center items-center">
                <Text className="text-xs font-normal leading-6 text-left font-poppins text-white">
                  {numberOfCompleted}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={twMerge(
                'flex-row rounded-3xl border-[1px] border-black px-3 py-2 gap-3',
                query.status === 0 && 'bg-slate-300',
              )}
              onPress={() =>
                setQuery(old => ({
                  ...old,
                  status: old?.status === 0 ? null : 0,
                }))
              }>
              <Text className="font-poppins font-normal leading-6 text-left">
                To DO
              </Text>
              <View className="bg-[#BF7C00] px-2 rounded-3xl justify-center items-center">
                <Text className="text-xs font-normal leading-6 text-left font-poppins text-white">
                  {numberOfInProgress}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
        {user?.current_branch && user?.active && (
          <CustomButton title="Checkout" onPress={onCheckoutHandler} />
        )}
        <TouchableOpacity
          className={twMerge(
            'h-24 w-24 rounded-full bg-black justify-center items-center absolute right-0',
            isCheckedIn ? 'bottom-20' : 'bottom-0',
          )}
          onPress={onCreateTicketNavigation}>
          <Ionicons name="add" color="white" size={48} />
        </TouchableOpacity>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default TicketsScreen;
