import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {normalize} from '@/utils';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {twMerge} from 'tailwind-merge';
import {ticketsAPI} from '@/api/tickets';
import {useQuery} from '@tanstack/react-query';
import {departmentsAPI} from '@/api/departments';
import {branchesAPI} from '@/api/branches';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import CustomDropdown from '@/components/custom/CustomDropdown';
import {checkAPI} from '@/api/check';
import useDateStore from '@/store/useDateStore';
import {request, requestLocationAccuracy} from 'react-native-permissions';
import GeoLocation from 'react-native-geolocation-service';
import useAuthStore from '@/store/useAuth';

const AddTicketsScreen = () => {
  const navigation = useNavigation();
  const {selectedBranch} = useDateStore();
  const {user} = useAuthStore();

  const {data: branchesData, isLoading: branchesLoading} = useQuery({
    queryFn: branchesAPI.get,
    queryKey: ['branches'],
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
    select: data => {
      return data?.departments?.map(e => ({
        label: e?.department_name?.en,
        value: e?._id,
      }));
    },
  });

  const [data, setData] = useState({
    ticket_title: '',
    ticket_description: '',
    priority: null,
    status: 0,
    department: '',
    branch: '',
  });

  const onAddTicket = async () => {
    try {
      const res = await ticketsAPI.create(data);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };
  const onCheckoutHandler = async () => {
    try {
      await request(
        Platform.OS === 'ios'
          ? 'ios.permission.LOCATION_WHEN_IN_USE'
          : 'android.permission.ACCESS_FINE_LOCATION',
      ).then(async () => {
        await requestLocationAccuracy({
          purposeKey: 'Need an access to the app',
        }).then(() => {
          GeoLocation.getCurrentPosition(
            async position => {
              const {coords} = position;
              const {latitude, longitude} = coords;
              const res = await checkAPI.out({
                branch: selectedBranch?._id,
                lat: latitude,
                lng: longitude,
              });
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'CalenderScreen'}],
                }),
              );
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ContainerComponents>
        <HeaderComponents />
        <CustomLoadingProvider loading={branchesLoading || departmentsLoading}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
              Add New Ticket
            </Text>
            <View className="gap-9">
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
                  onChange={value => setData(old => ({...old, branch: value}))}
                />
              </View>

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

            {user?.current_branch && (
              <CustomButton
                className="mt-8"
                title="Checkout"
                onPress={onCheckoutHandler}
              />
            )}
          </ScrollView>
        </CustomLoadingProvider>
      </ContainerComponents>
    </TouchableWithoutFeedback>
  );
};

export default AddTicketsScreen;
