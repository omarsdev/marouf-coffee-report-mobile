import React, {useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface DropdownComponentProps {
  data: DropdownItem[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disable?: boolean;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  data,
  value,
  onChange,
  placeholder = 'Select an option',
  disable = false,
}) => {
  // Memoized Render Item for Performance Optimization
  const renderItem = useCallback(
    (item: DropdownItem) => (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="checkcircle"
            size={20}
          />
        )}
      </View>
    ),
    [value],
  );

  return (
    <Dropdown
      disable={disable}
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      searchPlaceholder="Search..."
      value={value}
      onChange={(item: DropdownItem) => onChange(item.value)}
      renderItem={renderItem}
      renderRightIcon={disable ? () => null : undefined}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
