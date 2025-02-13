import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import {normalize} from '@/utils';
import CustomButton from '@/components/custom/CustomButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {twMerge} from 'tailwind-merge';
import {useQuery} from '@tanstack/react-query';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {branchesAPI} from '@/api/branches';
import useDateStore from '@/store/useDateStore';
import {checkAPI} from '@/api/check';
import Permission from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import useAuthStore from '@/store/useAuth';
import {getCurrentLocation} from '@/utils/location';

const ChooseBranchScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {selectedBranch, setSelectedBranchBranch} = useDateStore();
  const {user, refetchUser} = useAuthStore();
  const isCheckedIn = user?.current_branch && user?.active;

  const [filterBranch, setFilterBranch] = useState('');

  const {data, isLoading} = useQuery({
    queryFn: branchesAPI.get,
    subscribed: isFocused,
    queryKey: ['branches'],
  });

  const onCheckInHandler = async () => {
    try {
      await Permission.request(
        Platform.OS === 'ios'
          ? 'ios.permission.LOCATION_WHEN_IN_USE'
          : 'android.permission.ACCESS_FINE_LOCATION',
      ).then(async () => {
        const {latitude, longitude} = await getCurrentLocation();
        const res = await checkAPI.in({
          branch: selectedBranch?._id,
          lat: latitude,
          lng: longitude,
        });
        await refetchUser();
        navigation.navigate('HomeScreen');
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onCheckoutHandler = async () => {
    try {
      await Permission.request(
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
        setSelectedBranchBranch('');
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ContainerComponents>
      <HeaderComponents />
      <CustomLoadingProvider loading={isLoading}>
        <View className="flex-1 gap-8 mt-8">
          <Text
            className="font-poppins text-2xl font-light leading-9 text-left right-0 flex justify-between items-center"
            style={{fontSize: normalize(25)}}>
            Kindly choose the branch that you are located in now:
          </Text>
          <View className="relative">
            <View className="absolute left-0 bottom-0 top-0 h-full z-10">
              <View className="h-full w-10 justify-center items-center">
                <EvilIcons name="search" color="#000000" size={16} />
              </View>
            </View>
            <TextInput
              onChangeText={setFilterBranch}
              value={filterBranch}
              className="relative bg-[#00000012] py-4 pl-10 pr-5 font-poppins text-base font-normal leading-6 text-left right-0 flex justify-between items-center rounded-[28px]"
              placeholder="Enter Branch Name"
            />
          </View>
          <Text
            className="font-poppins text-2xl font-light leading-9 text-left right-0 flex justify-between items-center"
            style={{fontSize: normalize(25)}}>
            Or Choose Manually
          </Text>
          <ScrollView className="flex-grow">
            <View className="gap-3">
              {data?.branches
                ?.filter(branch => branch?.name?.en.includes(filterBranch))
                ?.map((branch, i) => (
                  <TouchableOpacity
                    onPress={() => setSelectedBranchBranch(branch)}
                    className="px-4 py-2 bg-[#B9B9B91A] rounded-2xl justify-between flex-row items-center"
                    key={i}>
                    <View className="flex-row gap-4 items-center">
                      <View className="w-10 h-10 rounded-full bg-[#FFF0D573] justify-center items-center">
                        <Text className="font-poppins text-base font-medium leading-6 text-center">
                          {branch?.name?.en?.[0]}
                        </Text>
                      </View>
                      <Text className="font-poppins text-base font-normal leading-6 text-left">
                        {branch?.name?.en}
                      </Text>
                    </View>
                    <View>
                      <View
                        className={twMerge(
                          'w-5 h-5 rounded-full border-black border-2',
                          branch?._id === selectedBranch?._id && 'bg-black',
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
          <CustomButton
            title={
              isCheckedIn
                ? `Check Out from "${selectedBranch?.name?.en}"`
                : 'Check In'
            }
            // disabled={!selectedBranch}
            className={twMerge(!selectedBranch && 'opacity-50')}
            onPress={isCheckedIn ? onCheckoutHandler : onCheckInHandler}
          />
        </View>
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default ChooseBranchScreen;
