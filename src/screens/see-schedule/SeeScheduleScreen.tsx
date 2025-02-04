import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {format} from 'date-fns';
import {twMerge} from 'tailwind-merge';
import Feather from 'react-native-vector-icons/Feather';
import Geolocation from 'react-native-geolocation-service';
import Permission, {requestLocationAccuracy} from 'react-native-permissions';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import useDateStore from '@/store/useDateStore';
import {normalize} from '@/utils';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '@/components/custom/CustomButton';
import {useQuery} from '@tanstack/react-query';
import {branchesAPI} from '@/api/branches';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {checkAPI} from '@/api/check';

const colors = ['bg-[#F3DFF6]', 'bg-[#E5F2FE]', 'bg-[#DFEBE3]'];
const borderColor1 = [
  'border-[#820A8F]',
  'border-[#204782]',
  'border-[#2E7042]',
];
const bgColor1 = ['bg-[#820A8F]', 'bg-[#204782]', 'bg-[#2E7042]'];

const SeeScheduleScreen = () => {
  const navigation = useNavigation();
  const {date, selectedBranch, setSelectedBranchBranch} = useDateStore();

  const [branches, setBranches] = useState([]);

  const {data, isLoading} = useQuery({
    queryFn: branchesAPI.get,
    queryKey: ['branches'],
  });

  const onCheckBranch = id => {
    setSelectedBranchBranch(data.branches?.find(e => e?._id === id));
    setBranches(old => {
      return old.map(branch => {
        if (branch.index === id) {
          return {...branch, selected: !branch.selected};
        }
        return branch;
      });
    });
  };

  const onBranchesNavigation = () => {
    navigation.navigate('ChooseBranchScreen');
  };
  const onCheckInHandler = async () => {
    try {
      Permission.request(
        Platform.OS === 'ios'
          ? 'ios.permission.LOCATION_WHEN_IN_USE'
          : 'android.permission.ACCESS_FINE_LOCATION',
      ).then(async () => {
        await requestLocationAccuracy({
          purposeKey: 'Need an access to the app',
        }).then(() => {
          Geolocation.getCurrentPosition(
            async position => {
              const {coords} = position;
              const {latitude, longitude} = coords;
              const res = await checkAPI.in({
                branch: selectedBranch?._id,
                lat: latitude,
                lng: longitude,
              });
              navigation.navigate('HomeScreen');
            },
            error => {
              // See error code charts below.
              console.error(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!data) return;
    setBranches(
      data?.branches?.map(e => ({
        name: e?.name?.en,
        index: e?._id,
        selected: false,
      })),
    );
  }, [data]);

  return (
    <ContainerComponents>
      <HeaderComponents />
      <CustomLoadingProvider loading={isLoading}>
        <ScrollView className="pb-20" showsVerticalScrollIndicator={false}>
          <View className="gap-10">
            <Text className="font-poppins" style={{fontSize: normalize(60)}}>
              {format(new Date(date), 'EEEE')}
              {'\n'}
              {format(new Date(date), 'd LLL yyyy')}
            </Text>
            <Text
              className="font-poppinsLight"
              style={{fontSize: normalize(30)}}>
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
            {branches?.map((branch, i) => (
              <View className="relative" key={branch?.index}>
                <View className="absolute w-[3px] h-full left-0 z-10 py-[10px]">
                  <View
                    className={twMerge('flex-1 rounded-r-xl', bgColor1[i % 3])}
                  />
                </View>
                <View
                  className={twMerge(
                    'p-4 rounded-xl flex-row justify-between',
                    colors[i % 3],
                  )}>
                  <Text
                    className="font-poppins"
                    style={{fontSize: normalize(18)}}>
                    {branch.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onCheckBranch(branch?.index)}>
                    <View
                      className={twMerge(
                        'h-6 w-6 border-2 justify-center items-center',
                        borderColor1[i % 3],
                        selectedBranch?._id === branch?.index &&
                          bgColor1[i % 3],
                      )}>
                      {selectedBranch?._id === branch?.index && (
                        <Feather name="check" size={13} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <CustomButton
            disabled={!selectedBranch}
            title="Check In"
            onPress={onCheckInHandler}
            className="mt-5"
          />
        </ScrollView>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default SeeScheduleScreen;
