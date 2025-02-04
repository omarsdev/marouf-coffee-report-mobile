import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native';
import {twMerge} from 'tailwind-merge';

type ContainerComponentsProps = {
  children: ReactNode;
  className?: string;
};

const ContainerComponents: React.FC<ContainerComponentsProps> = ({
  children,
  className,
}) => {
  return (
    <SafeAreaView className={twMerge('flex-1 mx-10 my-5', className)}>
      {children}
    </SafeAreaView>
  );
};

export default ContainerComponents;
