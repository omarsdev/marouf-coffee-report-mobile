import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {ticketsAPI} from '@/api/tickets';
import {useQuery} from '@tanstack/react-query';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {departmentsAPI} from '@/api/departments';
import {twMerge} from 'tailwind-merge';

const TicketsScreen = () => {
  const navigation = useNavigation();

  const [query, setQuery] = useState({
    status: null,
    department: null,
  });

  const {data, isLoading} = useQuery({
    queryFn: () => ticketsAPI.get(query),
    queryKey: ['tickets', JSON.stringify(query)],
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
  });

  const numberOfInProgress =
    data?.tickets?.filter(e => e?.status === 0)?.length || 0;
  const numberOfCompleted =
    data?.tickets?.filter(e => e?.status !== 0)?.length || 0;

  return (
    <ContainerComponents>
      <HeaderComponents />
      <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
        Tickets list
      </Text>
      <View className="flex-row justify-between">
        <View className="flex-row px-3 py-2 border-[1px] border-black rounded-2xl items-center gap-5">
          <Text className="font-poppins font-normal leading-6 text-left">
            All
          </Text>
          <AntDesign name="down" size={13} />
        </View>
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
      <CustomLoadingProvider loading={isLoading || departmentsLoading}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data?.tickets?.map((ticket, i) => (
            <View
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
                  {/* <Text className="font-poppins text-lg font-medium leading-6 text-left text-[#4F4F4F]">
                      {format(new Date(ticket?.created_at), 'dd/MM/yyyy')}
                    </Text> */}
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
            </View>
          ))}
        </ScrollView>
      </CustomLoadingProvider>
      <CustomButton
        title="Next"
        onPress={() => navigation.navigate('AddTicketsScreen')}
      />
    </ContainerComponents>
  );
};

export default TicketsScreen;
