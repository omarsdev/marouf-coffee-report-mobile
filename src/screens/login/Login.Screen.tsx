import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import ContainerComponents from '@/components/container/ContainerComponents';
import LoginIcon from '@/assets/svg/LoginIcon';
import LoginBackgroundIcon from '@/assets/svg/LoginBackgroundIcon';
import {normalize} from '@/utils';
import {CommonActions, useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const onSign = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'CalenderScreen'}],
      }),
    );
  };

  return (
    <ContainerComponents>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, justifyContent: 'space-between'}}>
        <View className="flex-1 items-center justify-center">
          <LoginIcon height="100%" />
        </View>
        <View className="flex-1 items-center justify-center relative">
          <LoginBackgroundIcon />
          <View className="absolute top-0 right-0 left-0 bottom-0">
            <View className="flex-1 justify-around">
              <Text
                className="text-center font-poppins"
                style={{fontSize: normalize(32)}}>
                Login To Your Account
              </Text>
              <Text
                className="text-center font-poppins font-light"
                style={{fontSize: normalize(20)}}>
                Sign in and continue to Maarouf Area Manager {'\n'} System to
                submit daily reports!
              </Text>
              <View className="gap-[18px]">
                <TextInput
                  className="border-[1px]"
                  placeholder="Email"
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: normalize(16),
                    borderRadius: 8,
                  }}
                />
                <TextInput
                  className="border-[1px]"
                  placeholder="Password"
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: normalize(16),
                    borderRadius: 8,
                  }}
                />
                <TouchableOpacity
                  onPress={onSign}
                  className="py-4 bg-[#171717] rounded-3xl">
                  <Text className="text-white text-center">Sign In</Text>
                </TouchableOpacity>
              </View>
              <View />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ContainerComponents>
  );
};

export default LoginScreen;
