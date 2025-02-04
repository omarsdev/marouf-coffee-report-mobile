import React, {useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {twMerge} from 'tailwind-merge';

const CustomButton = ({onPress, title, className = '', disabled = false}) => {
  const [loading, setLoading] = useState(false);

  const onPressHandler = async () => {
    if (!onPress) return;
    try {
      setLoading(true);
      (await onPress()) as any;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPressHandler}
      className={twMerge(
        'py-4 bg-[#171717] rounded-3xl flex-row justify-center items-center gap-3',
        className,
        (disabled || loading) && 'opacity-50',
      )}>
      <Text className="text-white text-center font-poppins">{title}</Text>
      {loading && <ActivityIndicator />}
    </TouchableOpacity>
  );
};

export default CustomButton;
