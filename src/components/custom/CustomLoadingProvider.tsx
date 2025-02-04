import React, {ReactNode} from 'react';
import {View, ActivityIndicator, ViewStyle} from 'react-native';

interface CustomLoadingProviderProps {
  loading: boolean;
  children: ReactNode;
  loaderSize?: 'small' | 'large';
  loaderColor?: string;
  containerStyle?: ViewStyle;
  className?: string;
}

const CustomLoadingProvider: React.FC<CustomLoadingProviderProps> = ({
  loading,
  children,
  loaderSize = 'large',
  loaderColor = '#000', // Default to black
  containerStyle,
  className = '',
}) => {
  if (loading) {
    return (
      <View
        style={[
          {flex: 1, justifyContent: 'center', alignItems: 'center'},
          containerStyle,
        ]}
        className={className}
        accessibilityLabel="Loading...">
        <ActivityIndicator size={loaderSize} color={loaderColor} />
      </View>
    );
  }

  return <>{children}</>;
};

export default React.memo(CustomLoadingProvider);
