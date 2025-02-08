import React, {useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {twMerge} from 'tailwind-merge';

const CustomButton = ({
  onPress,
  title,
  className = '',
  disabled = false,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);

  const onPressHandler = async () => {
    if (!onPress || loading) return;

    setLoading(true);
    try {
      const result = onPress();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error('Error in button press:', error);
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
      )}
      {...rest}>
      <Text className="text-white text-center font-poppins">{title}</Text>
      {loading && <ActivityIndicator />}
    </TouchableOpacity>
  );
};

export default CustomButton;
