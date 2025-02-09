import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {normalize} from '@/utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {twMerge} from 'tailwind-merge';
import {ticketsAPI} from '@/api/tickets';
import {useQuery} from '@tanstack/react-query';
import {departmentsAPI} from '@/api/departments';
import {branchesAPI} from '@/api/branches';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import CustomDropdown from '@/components/custom/CustomDropdown';
import useAuthStore from '@/store/useAuth';
import {userAPI} from '@/api/user';
import {ActivityIndicator} from 'react-native';
import useTicketsStore from '@/store/useTickets';

const AddTicketsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {isAreaManager, user} = useAuthStore();
  const {defaultTickets, setTickets, tickets, reset} = useTicketsStore();

  const [loading, setLoading] = useState(false);

  const {data: branchesData, isLoading: branchesLoading} = useQuery({
    queryFn: branchesAPI.get,
    queryKey: ['branches'],
    subscribed: isFocused,
    select: data => {
      return data?.branches?.map(e => ({
        label: e?.name?.en,
        value: e?._id,
      }));
    },
  });

  const {data: departmentsData, isLoading: departmentsLoading} = useQuery({
    queryFn: departmentsAPI.get,
    queryKey: ['departments'],
    subscribed: isFocused,
    select: data => {
      return data?.departments?.map(e => ({
        label: e?.department_name?.en,
        value: e?._id,
      }));
    },
  });

  const {data: areaManagersData, isLoading: areaManagersLoading} = useQuery({
    queryFn: userAPI.areaManagers,
    queryKey: ['areaManagers'],
    subscribed: isFocused,
    select: data => {
      return data?.users?.map(e => ({
        label: e?.name?.en,
        value: e?._id,
      }));
    },
  });

  const [data, setData] = useState(tickets || defaultTickets);

  const onAddTicket = async () => {
    try {
      const res = await ticketsAPI.create({
        ...data,
        ...(!isAreaManager
          ? {
              branch: user?.branch_access,
              department: undefined,
            }
          : {
              area_manager: undefined,
            }),
      });
      reset();
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const onUploadImage = async () => {
    try {
      setLoading(true);
      // Step 1: Select an image
      const result = await launchImageLibrary({
        mediaType: 'photo', // Ensure we only pick images
        selectionLimit: 1,
      });

      if (result.didCancel) {
        console.log('User cancelled image selection');
        return;
      }

      if (result.errorCode) {
        throw new Error(`Image picker error: ${result.errorMessage}`);
      }

      const image = result.assets?.[0];
      if (!image) {
        throw new Error('No image selected');
      }

      let formData = new FormData();
      formData.append('image', {
        uri: image?.uri,
        name: image?.fileName || `upload_${Date.now()}.jpg`,
        type: image?.type || 'image/jpeg',
      });

      const res = await userAPI.postImage(formData);
      setData(old => ({...old, ticket_images: [res?.data?.url]}));
    } catch (error) {
      console.error('onUploadImage Error:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTickets(tickets || defaultTickets);
  }, []);

  useEffect(() => {
    setTickets(data);
  }, [data]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ContainerComponents>
        <HeaderComponents />
        <CustomLoadingProvider
          loading={
            branchesLoading || departmentsLoading || areaManagersLoading
          }>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
              Add New Ticket
            </Text>
            <View className="gap-9">
              {isAreaManager ? (
                <>
                  <View>
                    <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                      Add Department
                    </Text>
                    <CustomDropdown
                      data={departmentsData}
                      placeholder="Choose an option"
                      value={data.department}
                      onChange={value =>
                        setData(old => ({...old, department: value}))
                      }
                    />
                  </View>

                  <View>
                    <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                      Pickup branches
                    </Text>
                    <CustomDropdown
                      data={branchesData}
                      placeholder="Choose an option"
                      value={data.branch}
                      onChange={value =>
                        setData(old => ({...old, branch: value}))
                      }
                    />
                  </View>
                </>
              ) : (
                <View>
                  <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                    Add area manager
                  </Text>
                  <CustomDropdown
                    data={areaManagersData}
                    placeholder="Choose an option"
                    value={data.area_manager}
                    onChange={value =>
                      setData(old => ({...old, area_manager: value}))
                    }
                  />
                </View>
              )}

              <View>
                <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                  Ticket Title
                </Text>
                <TextInput
                  className="border-[1px] rounded-[50px]"
                  placeholder="Write Name of Ticket here"
                  value={data.ticket_title}
                  onChangeText={text =>
                    setData(old => ({...old, ticket_title: text}))
                  }
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
                  value={data.ticket_description}
                  onChangeText={text =>
                    setData(old => ({...old, ticket_description: text}))
                  }
                  className="border-[1px] rounded-3xl h-32"
                  placeholder="Write description here"
                  numberOfLines={3}
                  multiline
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
                    <TouchableOpacity
                      onPress={() =>
                        setData(old => ({
                          ...old,
                          priority: old.priority === 0 ? null : 0,
                        }))
                      }
                      className={twMerge(
                        'py-2 px-10 bg-[#CBFFD8] rounded-3xl',
                        data.priority === 0 && 'border-black border-[1px]',
                      )}>
                      <Text className="font-poppins text-xl font-normal leading-6 text-left">
                        Low
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setData(old => ({
                          ...old,
                          priority: old.priority === 1 ? null : 1,
                        }))
                      }
                      className={twMerge(
                        'py-2 px-10 bg-[#FFFACB] rounded-3xl',
                        data.priority === 1 && 'border-black border-[1px]',
                      )}>
                      <Text className="font-poppins text-xl font-normal leading-6 text-left">
                        Medium
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setData(old => ({
                          ...old,
                          priority: old.priority === 2 ? null : 2,
                        }))
                      }
                      className={twMerge(
                        'py-2 px-10 bg-[#FFCBCB] rounded-3xl',
                        data.priority === 2 && 'border-black border-[1px]',
                      )}>
                      <Text className="font-poppins text-xl font-normal leading-6 text-left">
                        High
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>

              <TouchableOpacity
                onPress={onUploadImage}
                className="bg-[#0000000F] h-24 border-[1px] border-black rounded-3xl justify-center items-center">
                <View className="flex-row items-center gap-3">
                  {loading ? (
                    <ActivityIndicator />
                  ) : data?.ticket_images?.[0] ? (
                    <Image
                      source={{
                        uri: data?.ticket_images?.[0],
                      }}
                      className="flex-1 h-24 rounded-3xl"
                    />
                  ) : (
                    <>
                      <Entypo name="attachment" size={normalize(17)} />
                      <Text className="text-lg font-normal leading-6 text-left underline">
                        Attach Image
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
              <CustomButton
                className="flex-1"
                title="Add Tickets"
                onPress={onAddTicket}
              />
            </View>
          </ScrollView>
        </CustomLoadingProvider>
      </ContainerComponents>
    </TouchableWithoutFeedback>
  );
};

export default AddTicketsScreen;
