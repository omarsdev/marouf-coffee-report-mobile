import React, {forwardRef, useCallback} from 'react';
import {Text, StyleSheet, View, TextInput, Image} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {normalize} from '@/utils';
import FullScreenImageModal from '@/components/FullScreenImageModal';

const ViewNoteComponent = forwardRef<BottomSheet, {}>((props, ref) => {
  const {selectedNote, setSelectedNote} = props;

  // Handle bottom sheet state changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedNote(null);
    }
  }, []);

  const getNoteValue = props => {
    if (props === 'Empty') {
      return {note: '', image: ''};
    } else {
      try {
        const data = JSON.parse(props);
        return data;
      } catch (error) {
        return {note: '', image: ''};
      }
    }
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['50%']}
      enableDynamicSizing
      enablePanDownToClose
      onChange={handleSheetChanges}>
      <BottomSheetView style={styles.contentContainer}>
        <Text
          className="font-poppins text-center font-poppinsBold"
          style={{fontSize: normalize(20)}}>
          {selectedNote?.question?.text}
        </Text>
        <BottomSheetScrollView className="mt-4">
          <View className="mb-4">
            <Text className="mb-3 font-poppins font-normal leading-6 text-left">
              Note
            </Text>
            <TextInput
              value={getNoteValue(selectedNote?.questionAnswer?.note)?.note}
              className="border-[1px] rounded-3xl"
              placeholder="Write description here"
              numberOfLines={3}
              multiline
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                fontSize: normalize(16),
                backgroundColor: '#0000000F',
              }}
            />
          </View>
          <View className="bg-[#0000000F] min-h-24 border-[1px] border-black rounded-3xl justify-center items-center">
            <View className="flex-row items-center">
              {getNoteValue(selectedNote?.questionAnswer?.note)?.image ? (
                <FullScreenImageModal
                  uri={getNoteValue(selectedNote?.questionAnswer?.note)?.image}
                  className="flex-1 h-28 rounded-3xl"
                  isEditable={true}
                />
              ) : (
                <>
                  <Text className="text-lg font-normal leading-6 text-left underline">
                    No Image
                  </Text>
                </>
              )}
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ViewNoteComponent;

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
