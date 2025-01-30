import React from 'react';
import {View, Text, ScrollView, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {normalize} from '@/utils';
import {useNavigation} from '@react-navigation/native';

const AddTicketsScreen = () => {
  const navigation = useNavigation();

  const onAddTicket = () => {};
  const onCheckoutHandler = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <ContainerComponents>
      <HeaderComponents />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
          Add New Ticket
        </Text>
        <View className="gap-9">
          <View>
            <Text className="mb-3 font-poppins font-normal leading-6 text-left">
              Add Department
            </Text>
            <View className="flex-row justify-between">
              <View className="flex-row px-3 py-2 border-[1px] border-black rounded-2xl items-center gap-5">
                <Text className="font-poppins font-normal leading-6 text-left">
                  Finance
                </Text>
                <AntDesign name="down" size={13} />
              </View>
            </View>
          </View>

          <View>
            <Text className="mb-3 font-poppins font-normal leading-6 text-left">
              Ticket Title
            </Text>
            <TextInput
              className="border-[1px] rounded-[50px]"
              placeholder="Write Name of Ticket here"
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                fontSize: normalize(16),
                backgroundColor: '#0000000F',
              }}
            />
          </View>

          <View>
            <Text className="mb-3 font-poppins font-normal leading-6 text-left">
              Description
            </Text>
            <TextInput
              className="border-[1px] rounded-3xl h-32"
              placeholder="Write description here"
              numberOfLines={3}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                fontSize: normalize(16),
                backgroundColor: '#0000000F',
              }}
            />
          </View>

          <View>
            <Text className="mb-3 font-poppins font-normal leading-6 text-left">
              Priority
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                <View className="py-2 px-10 bg-[#CBFFD8] rounded-3xl">
                  <Text className="font-poppins text-xl font-normal leading-6 text-left">
                    Low
                  </Text>
                </View>
                <View className="py-2 px-10 bg-[#FFFACB] rounded-3xl">
                  <Text className="font-poppins text-xl font-normal leading-6 text-left">
                    Medium
                  </Text>
                </View>
                <View className="py-2 px-10 bg-[#FFCBCB] rounded-3xl">
                  <Text className="font-poppins text-xl font-normal leading-6 text-left">
                    High
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>

          <View className="bg-[#0000000F] h-24 border-[1px] border-black rounded-3xl justify-center items-center">
            <View className="flex-row items-center gap-3">
              <Entypo name="attachment" size={normalize(17)} />
              <Text className="text-lg font-normal leading-6 text-left underline">
                Attach Image
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <View className="flex-1" />
            <CustomButton
              className="flex-1"
              title="Add Tickets"
              onPress={onAddTicket}
            />
            <View className="flex-1" />
          </View>
        </View>

        <CustomButton
          className="mt-8"
          title="Checkout"
          onPress={onCheckoutHandler}
        />
      </ScrollView>
    </ContainerComponents>
  );
};

export default AddTicketsScreen;
