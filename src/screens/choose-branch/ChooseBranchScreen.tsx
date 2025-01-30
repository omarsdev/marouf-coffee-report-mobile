import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import {normalize} from '@/utils';
import CustomButton from '@/components/custom/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {twMerge} from 'tailwind-merge';

const BRANCHES = [
  'Abdali',
  'Al Yasmeen',
  'Khalda',
  'Abdali',
  'Al Yasmeen',
  'Khalda',
];

const ChooseBranchScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);

  return (
    <ContainerComponents>
      <HeaderComponents />
      <View className="gap-8 mt-8">
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
            className="relative bg-[#00000012] py-4 pl-10 pr-5 font-poppins text-base font-normal leading-6 text-left right-0 flex justify-between items-center rounded-[28px]"
            placeholder="Enter Branch Name"
          />
        </View>
        <Text
          className="font-poppins text-2xl font-light leading-9 text-left right-0 flex justify-between items-center"
          style={{fontSize: normalize(25)}}>
          Or Choose Manually
        </Text>
        <ScrollView>
          <View className="gap-3">
            {BRANCHES.map((branch, i) => (
              <TouchableOpacity
                onPress={() => setSelected(old => (old === i ? null : i))}
                className="px-4 py-2 bg-[#B9B9B91A] rounded-2xl justify-between flex-row items-center"
                key={i}>
                <View className="flex-row gap-4 items-center">
                  <View className="w-10 h-10 rounded-full bg-[#FFF0D573] justify-center items-center">
                    <Text className="font-poppins text-base font-medium leading-6 text-center">
                      {branch[0]}
                    </Text>
                  </View>
                  <Text className="font-poppins text-base font-normal leading-6 text-left">
                    {branch}
                  </Text>
                </View>
                <View>
                  <View
                    className={twMerge(
                      'w-5 h-5 rounded-full border-black border-2',
                      selected === i && 'bg-black',
                    )}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <CustomButton
          title="Check In"
          disabled={selected === null}
          className={twMerge(selected === null && 'opacity-50')}
          onPress={() => navigation.navigate('HomeScreen')}
        />
      </View>
    </ContainerComponents>
  );
};

export default ChooseBranchScreen;
