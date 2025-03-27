import React, {useEffect, useMemo, useState} from 'react';
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
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {twMerge} from 'tailwind-merge';
import {ticketsAPI} from '@/api/tickets';
import {useQuery} from '@tanstack/react-query';
import {departmentsAPI} from '@/api/departments';
import {branchesAPI} from '@/api/branches';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import CustomDropdown from '@/components/custom/CustomDropdown';
import useAuthStore from '@/store/useAuth';
import {userAPI} from '@/api/user';
import useTicketsStore from '@/store/useTickets';
import AttachImageComponents from '@/components/AttachImageComponents';

const AddTicketsScreen = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {isAreaManager, user} = useAuthStore();
  const {defaultTickets, setTickets, tickets, reset} = useTicketsStore();

  const isEditable = useMemo(() => !!params?.ticketId, [params?.ticketId]);

  const {data: ticketData, isLoading: ticketLoading} = useQuery({
    queryFn: () => ticketsAPI.getById(params?.ticketId),
    queryKey: ['ticket' + params?.ticketId],
    subscribed: isFocused,
    enabled: isEditable,
  });

  const {data: branchesData, isLoading: branchesLoading} = useQuery({
    queryFn: () => branchesAPI.get(isAreaManager && {areaManager: user?._id}),
    queryKey: ['branches'],
    subscribed: isFocused,
    enabled: !!user?._id,
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
    if (isEditable) {
      return navigation.goBack();
    }
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

  const onCompleteTicketHandler = async () => {
    try {
      await ticketsAPI.updateStatus(params?.ticketId, 1);
      navigation.goBack();
    } catch (error) {}
  };

  const onUploadImage = async (formData: any) => {
    try {
      const res = await userAPI.postImage(formData);
      setData(prev => ({
        ...prev,
        ticket_images: [...(prev.ticket_images ?? []), res?.data?.url],
      }));
    } catch (error) {
      console.log(error);
      console.error('onUploadImage Error:', error.message || error);
    }
  };

  const onPriorityLevel = element => {
    setData(old => ({
      ...old,
      priority: old.priority === element ? null : element,
    }));
  };

  useEffect(() => {
    if (isEditable) {
      return;
    }
    setTickets(tickets || defaultTickets);
  }, [isEditable]);

  useEffect(() => {
    if (isEditable) {
      return;
    }
    setTickets(data);
  }, [data, isEditable]);

  useEffect(() => {
    if (isEditable && ticketData) {
      setData(ticketData?.ticket);
    }
  }, [ticketData, isEditable]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ContainerComponents>
        <HeaderComponents />
        <CustomLoadingProvider
          loading={
            branchesLoading ||
            departmentsLoading ||
            areaManagersLoading ||
            ticketLoading
          }>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
              {isEditable ? 'Ticket' : 'Add New Ticket'}
            </Text>
            <View className="gap-9">
              {isEditable ? (
                <>
                  <View>
                    <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                      {isEditable ? 'Department' : 'Add Department'}
                    </Text>
                    <CustomDropdown
                      disable={isEditable}
                      data={departmentsData}
                      placeholder={'Not Selected ❌'}
                      value={data.department}
                      onChange={value =>
                        setData(old => ({...old, department: value}))
                      }
                    />
                  </View>

                  <View>
                    <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                      {isEditable ? 'Branch' : 'Pickup Branch'}
                    </Text>
                    <CustomDropdown
                      disable={isEditable}
                      data={branchesData}
                      placeholder={'Not Selected ❌'}
                      value={data.branch}
                      onChange={value =>
                        setData(old => ({...old, branch: value}))
                      }
                    />
                  </View>

                  <View>
                    <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                      {isEditable ? 'Area manager' : 'Add area manager'}
                    </Text>
                    <CustomDropdown
                      disable={isEditable}
                      data={areaManagersData}
                      placeholder={'Not Selected ❌'}
                      value={data.area_manager}
                      onChange={value =>
                        setData(old => ({...old, area_manager: value}))
                      }
                    />
                  </View>
                </>
              ) : isAreaManager ? (
                <>
                  <View>
                    <Text className="mb-3 font-poppins font-normal leading-6 text-left">
                      {isEditable ? 'Department' : 'Add Department'}
                    </Text>
                    <CustomDropdown
                      disable={isEditable}
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
                      {isEditable ? 'Branch' : 'Pickup Branch'}
                    </Text>
                    <CustomDropdown
                      disable={isEditable}
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
                    {isEditable ? 'Area manager' : 'Add area manager'}
                  </Text>
                  <CustomDropdown
                    disable={isEditable}
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
                  editable={!isEditable}
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
                  editable={!isEditable}
                  value={data.ticket_description}
                  onChangeText={text =>
                    setData(old => ({...old, ticket_description: text}))
                  }
                  className={twMerge(
                    'border-[1px] rounded-3xl',
                    !isEditable && 'h-32',
                  )}
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
                      style={
                        isEditable && data.priority !== 0 && {display: 'none'}
                      }
                      disabled={isEditable}
                      onPress={() => onPriorityLevel(0)}
                      className={twMerge(
                        'py-2 px-10 bg-[#CBFFD8] rounded-3xl',
                        data.priority === 0 && 'border-black border-[1px]',
                      )}>
                      <Text className="font-poppins text-xl font-normal leading-6 text-left">
                        Low
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        isEditable && data.priority !== 1 && {display: 'none'}
                      }
                      disabled={isEditable}
                      onPress={() => onPriorityLevel(1)}
                      className={twMerge(
                        'py-2 px-10 bg-[#FFFACB] rounded-3xl',
                        data.priority === 1 && 'border-black border-[1px]',
                      )}>
                      <Text className="font-poppins text-xl font-normal leading-6 text-left">
                        Medium
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        isEditable && data.priority !== 2 && {display: 'none'}
                      }
                      disabled={isEditable}
                      onPress={() => onPriorityLevel(2)}
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

              <AttachImageComponents
                isEditable={isEditable}
                images={data?.ticket_images}
                onUploadImage={onUploadImage}
                setImages={data => {
                  // console.log(data);
                  setData(prev => ({
                    ...prev,
                    ticket_images: data,
                  }));
                }}
              />

              <View className="flex-row gap-4">
                <CustomButton
                  className="flex-1"
                  title={isEditable ? 'Back' : 'Add Tickets'}
                  onPress={onAddTicket}
                />
                {isAreaManager &&
                  isEditable &&
                  ticketData?.ticket?.user !== user?._id && (
                    <CustomButton
                      title="Completed"
                      className="flex-1 bg-[#00BF29]"
                      onPress={onCompleteTicketHandler}
                    />
                  )}
              </View>
            </View>
          </ScrollView>
        </CustomLoadingProvider>
      </ContainerComponents>
    </TouchableWithoutFeedback>
  );
};

export default AddTicketsScreen;
