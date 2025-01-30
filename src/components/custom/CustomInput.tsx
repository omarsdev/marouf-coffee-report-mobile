// import React, {forwardRef} from 'react';
// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   TextInputProps,
//   ViewStyle,
//   TextStyle,
// } from 'react-native';
// import {useController, useFormContext} from 'react-hook-form';
// import {twMerge} from 'tailwind-merge';

// // Define input props
// interface CustomInputProps extends TextInputProps {
//   name: string;
//   label?: string;
//   placeHolder?: string;
//   style?: ViewStyle;
//   labelStyle?: TextStyle;
//   inputStyle?: TextStyle;
//   secureTextEntry?: boolean;
//   rules?: any;
//   defaultValue?: string;
//   error?: boolean;
// }

// const ControlledInput = forwardRef((props, ref) => {
//   const {
//     name,
//     label,
//     placeHolder,
//     style,
//     labelStyle,
//     inputStyle,
//     secureTextEntry,
//     rules,
//     defaultValue,
//     error,
//     ...rest
//   } = props;

//   const {formState} = useFormContext();
//   const {field} = useController({name, rules, defaultValue});

//   return (
//     <View style={[styles.container, style]}>
//       {label && (
//         <Text className="font-poppins" style={[styles.text, labelStyle]}>
//           {label}
//         </Text>
//       )}

//       <View style={styles.inputSection}>
//         <TextInput
//           ref={ref}
//           style={inputStyle && (inputStyle as any)}
//           className={twMerge(
//             'border-[1px] rounded-md px-4 py-3 text-base',
//             error || formState.errors?.[name] ? 'border-red-600' : '',
//           )}
//           placeholder={placeHolder}
//           placeholderTextColor="#46A24966"
//           secureTextEntry={secureTextEntry}
//           underlineColorAndroid="transparent"
//           autoComplete="off"
//           autoCapitalize="none"
//           onChangeText={field.onChange}
//           onBlur={field.onBlur}
//           value={field.value}
//           {...rest}
//         />
//       </View>

//       {formState.errors?.[name] && (
//         <Text className="text-red-600 mt-1 ml-2 text-left">
//           {formState.errors?.[name]?.message as string}
//         </Text>
//       )}
//     </View>
//   );
// });

// // Wrapper Component for `ControlledInput`
// const CustomInput = forwardRef<TextInput, CustomInputProps>(
//   ({name, ...props}, ref) => {
//     const formContext = useFormContext();

//     if (!formContext || !name) {
//       console.error(
//         !formContext
//           ? 'TextInput must be wrapped by FormProvider'
//           : 'Name must be defined',
//       );
//       return null;
//     }

//     return <ControlledInput ref={ref} name={name} {...props} />;
//   },
// );

// export default CustomInput;

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'column',
//   },
//   text: {
//     fontSize: 14,
//     fontWeight: '500',
//     lineHeight: 16.94,
//     textAlign: 'left',
//     marginBottom: 14,
//   },
//   inputSection: {
//     position: 'relative',
//   },
//   leftIcon: {
//     position: 'absolute',
//     zIndex: 1,
//     height: '100%',
//     left: 20,
//     justifyContent: 'center',
//   },
//   rightIcon: {
//     position: 'absolute',
//     zIndex: 1,
//     height: '100%',
//     right: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     justifyContent: 'center',
//   },
// });

import React, {forwardRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useController, useFormContext} from 'react-hook-form';

const ControlledInput = forwardRef((props, ref) => {
  const {
    name,
    label,
    placeHolder,
    style,
    labelStyle,
    inputStyle,
    secureTextEntry,
    leftIcon,
    rightIcon,
    rules,
    defaultValue,
    error,
    onPressRightIcon,
    ...rest
  } = props;

  const {formState} = useFormContext();
  const {field} = useController({name, rules, defaultValue});

  return (
    <View style={[styles.container, style ?? {}]}>
      {label && <Text style={[styles.text, labelStyle ?? {}]}>{label}</Text>}
      <View style={styles.inputSection}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            <View style={styles.center}>{leftIcon}</View>
          </View>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.textInput,
            leftIcon && styles.paddingLeftIcon,
            rightIcon && styles.paddingRightIcon,
            inputStyle ?? {},
          ]}
          placeholder={placeHolder?.text || placeHolder}
          placeholderTextColor="#46A24966"
          secureTextEntry={secureTextEntry}
          underlineColorAndroid="transparent"
          autoComplete="off"
          autoCapitalize="none"
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          className={(error || formState?.errors?.[name]) && 'border-red-600'}
          {...rest}
        />
        {rightIcon &&
          (onPressRightIcon ? (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onPressRightIcon}>
              <View style={styles.center}>{rightIcon}</View>
            </TouchableOpacity>
          ) : (
            <View style={styles.rightIcon}>
              <View style={styles.center}>{rightIcon}</View>
            </View>
          ))}
      </View>
      {formState?.errors?.[name] && (
        <Text className="text-red-600 mt-1 ml-2 text-left">
          {formState?.errors?.[name].message}
        </Text>
      )}
    </View>
  );
});

const CustomInput = forwardRef((props, ref) => {
  const {name, setFormError, ...inputProps} = props;

  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? 'TextInput must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    setFormError(true);
    return null;
  }

  return <ControlledInput ref={ref} {...props} {...inputProps} />;
});

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  text: {
    // fontFamily: fonts.inter.regular,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16.94,
    textAlign: 'left',
    marginBottom: 14,
  },
  inputSection: {
    position: 'relative',
  },
  textInput: {
    width: '100%',
    height: 50,
    // borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 39,
    color: '#46A249',
    paddingHorizontal: 20,
    textAlign: 'left',
  },
  textInputRight: {
    textAlign: 'right',
  },
  leftIcon: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    left: 20,
  },
  rightIcon: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  paddingLeftIcon: {
    paddingLeft: 45,
  },
  paddingRightIcon: {
    paddingRight: 45,
  },
});
