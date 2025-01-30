import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {twMerge} from 'tailwind-merge';

const CustomButton = ({onPress, title, className, disabled = false}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress && onPress}
      className={twMerge('py-4 bg-[#171717] rounded-3xl', className)}>
      <Text className="text-white text-center font-poppins">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
