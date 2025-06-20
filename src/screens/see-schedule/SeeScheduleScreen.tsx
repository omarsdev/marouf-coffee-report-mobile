import React, {useEffect, useMemo, useState} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {format, parse} from 'date-fns';
import {twMerge} from 'tailwind-merge';
import Feather from 'react-native-vector-icons/Feather';
import Geolocation from 'react-native-geolocation-service';
import Permission, {requestLocationAccuracy} from 'react-native-permissions';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import useDateStore from '@/store/useDateStore';
import {normalize} from '@/utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CustomButton from '@/components/custom/CustomButton';
import {useQuery} from '@tanstack/react-query';
import {branchesAPI} from '@/api/branches';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {checkAPI} from '@/api/check';
import useAuthStore from '@/store/useAuth';
import {assignmentsAPI} from '@/api/assignments';
import _ from 'lodash';
import {getCurrentLocation} from '@/utils/location';

const colors = ['bg-[#F3DFF6]', 'bg-[#E5F2FE]', 'bg-[#DFEBE3]'];
const borderColor1 = [
  'border-[#820A8F]',
  'border-[#204782]',
  'border-[#2E7042]',
];
const bgColor1 = ['bg-[#820A8F]', 'bg-[#204782]', 'bg-[#2E7042]'];

const SeeScheduleScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {date, selectedBranch, setSelectedBranchBranch} = useDateStore();
  const {user, isAreaManager, refetchUser} = useAuthStore();
  const isCheckedIn = user?.current_branch && user?.active;

  const [branches, setBranches] = useState([]);

  const chosenBranches = useMemo(
    () => branches.find(e => e?.selected),
    [branches],
  );

  const {data, isLoading} = useQuery({
    queryFn: () =>
      assignmentsAPI.get({
        date: date
          ? `${format(
              parse(date, 'yyyy-MM-dd', new Date()), // Use the correct format for parsing
              'yyyy/MM/dd',
            )}Z`
          : undefined,
      }),
    queryKey: ['reports' + String(date)],
    subscribed: isFocused,
    select: data => {
      return _.uniqBy(
        data?.assignments?.map(assignment => assignment?.branch),
        '_id',
      );
    },
  });

  const onCheckBranch = id => {
    setBranches(old => {
      return old.map(branch => {
        if (branch.index === id) {
          return {...branch, selected: true};
        } else {
          return {...branch, selected: false};
        }
      });
    });
  };

  const onBranchesNavigation = () => {
    navigation.navigate('ChooseBranchScreen');
  };
  const onCheckInHandler = async () => {
    const branchInfo = data?.find(e => e?._id === chosenBranches?.index);
    try {
      await Permission.request(
        Platform.OS === 'ios'
          ? 'ios.permission.LOCATION_WHEN_IN_USE'
          : 'android.permission.ACCESS_FINE_LOCATION',
      ).then(async () => {
        const {latitude, longitude} = await getCurrentLocation();
        setSelectedBranchBranch(branchInfo);
        const res = await checkAPI.in({
          branch: branchInfo?._id,
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

  useEffect(() => {
    if (!data) return;
    setBranches(
      data?.map(e => ({
        name: e?.name?.en,
        index: e?._id,
        selected: false,
      })),
    );
  }, [data]);

  const isDisabled = useMemo(
    () => (!isAreaManager ? false : !chosenBranches ? true : false),
    [isAreaManager, chosenBranches],
  );

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
            {isAreaManager && (
              <Text
                className="font-poppinsLight"
                style={{fontSize: normalize(30)}}>
                This is your schedule for today
              </Text>
            )}
            {isAreaManager && (
              <TouchableOpacity onPress={onBranchesNavigation}>
                <Text
                  className="font-poppinsLight underline"
                  style={{fontSize: normalize(25)}}>
                  See All Branches
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {isAreaManager && (
            <View className="gap-8 pt-6">
              {branches?.map((branch, i) => (
                <TouchableOpacity
                  className="relative"
                  key={branch?.index}
                  onPress={() => onCheckBranch(branch?.index)}>
                  <View className="absolute w-[3px] h-full left-0 z-10 py-[10px]">
                    <View
                      className={twMerge(
                        'flex-1 rounded-r-xl',
                        bgColor1[i % 3],
                      )}
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
                    <View>
                      <View
                        className={twMerge(
                          'h-6 w-6 border-2 justify-center items-center',
                          borderColor1[i % 3],
                          chosenBranches?.index === branch?.index &&
                            bgColor1[i % 3],
                        )}>
                        {chosenBranches?.index === branch?.index && (
                          <Feather name="check" size={13} color="white" />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
        <CustomButton
          disabled={isDisabled}
          title={isDisabled || !isCheckedIn ? 'Check In' : 'Check out'}
          onPress={!isCheckedIn ? onCheckInHandler : onCheckoutHandler}
          className="mt-5"
        />
      </CustomLoadingProvider>
    </ContainerComponents>
  );
};

export default SeeScheduleScreen;
