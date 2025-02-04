import React, {useState} from 'react';
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
import {authAPI} from '@/api/auth';
import CustomButton from '@/components/custom/CustomButton';
import {userAPI} from '@/api/user';
import {showMessage} from 'react-native-flash-message';
import useAuthStore from '@/store/useAuth';

const LoginScreen = () => {
  const navigation = useNavigation();
  const {setToken, setUser} = useAuthStore();

  const [info, setInfo] = useState({email: '', password: ''});

  const onSign = async () => {
    try {
      const {token} = (await authAPI.login(info)) as any;
      const res = (await userAPI.me(token)) as any;
      setToken(token);
      setUser(res);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'CalenderScreen'}],
        }),
      );
    } catch (error) {
      // showMessage({
      //   message: error?.message || error,
      //   type: 'danger',
      // });
    }
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
                  onChangeText={email => setInfo(old => ({...old, email}))}
                  value={info.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
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
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={password =>
                    setInfo(old => ({...old, password}))
                  }
                  value={info.password}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: normalize(16),
                    borderRadius: 8,
                  }}
                />
                {/* <TouchableOpacity
                  onPress={onSign}
                  className="py-4 bg-[#171717] rounded-3xl">
                  <Text className="text-white text-center">Sign In</Text>
                </TouchableOpacity> */}
                <CustomButton title="Sign In" onPress={onSign} />
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
