import React, {forwardRef, useCallback} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {normalize} from '@/utils';
import CustomButton from '@/components/custom/CustomButton';

const AddTicketNoteSheetComponents = forwardRef<BottomSheet, {}>(
  (props, ref) => {
    const {
      selectedNote,
      setSelectedNote,
      type = 'Transfer',
      onTransferTicketHandler,
    } = props;

    // Handle bottom sheet state changes
    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        setSelectedNote(null);
        Keyboard.dismiss();
      }
    }, []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={['50%']}
        enableDynamicSizing
        enablePanDownToClose
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <View className="flex-1 mb-4">
            <Text className="mb-3 font-poppins font-normal leading-6 text-left">
              Note
            </Text>
            <TextInput
              value={selectedNote}
              className="border-[1px] rounded-3xl"
              placeholder="Write transfer reason here!!"
              multiline
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                fontSize: normalize(16),
                backgroundColor: '#0000000F',
              }}
              onChangeText={setSelectedNote}
            />
          </View>
          <CustomButton
            title={type}
            className="bg-[#bf6f00]"
            onPress={onTransferTicketHandler}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

export default AddTicketNoteSheetComponents;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    marginBottom: 30,
  },
});
