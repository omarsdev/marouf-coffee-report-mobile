import React, {forwardRef, useCallback} from 'react';
import {Text, StyleSheet, View, TextInput, Keyboard} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {normalize} from '@/utils';
import {userAPI} from '@/api/user';
import CustomButton from '@/components/custom/CustomButton';
import AttachImageComponents from '@/components/AttachImageComponents';

const AddNoteComponent = forwardRef<BottomSheet, {}>((props, ref) => {
  const {selectedNote, setSelectedNote, body, onCreate, onCreateImage} = props;
  const {bottom} = useSafeAreaInsets();

  // Handle bottom sheet state changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedNote(null);
    }
  }, []);

  const onUploadImage = async formData => {
    try {
      const res = await userAPI.postImage(formData);
      onCreateImage(res?.data?.url, selectedNote);
    } catch (error) {
      console.error('onUploadImage Error:', error.message || error);
    } finally {
    }
  };

  const onSubmitHandler = () => {
    ref.current?.close();
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['90%']}
      enablePanDownToClose
      onClose={Keyboard.dismiss}
      onChange={handleSheetChanges}>
      <BottomSheetView style={styles.contentContainer}>
        <Text
          className="font-poppins text-center font-poppinsBold"
          style={{fontSize: normalize(20)}}>
          {selectedNote?.text}
        </Text>
        <BottomSheetScrollView className="mt-4">
          <View className="mb-4">
            <Text className="mb-3 font-poppins font-normal leading-6 text-left">
              Note
            </Text>
            <TextInput
              value={body?.[selectedNote?._id]?.note?.note}
              onChangeText={text =>
                onCreate(
                  {note: text, image: body?.[selectedNote?._id]?.note?.image},
                  selectedNote,
                )
              }
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

          <AttachImageComponents
            isEditable={false}
            images={body?.[selectedNote?._id]?.note?.image}
            onUploadImage={onUploadImage}
            setImages={data => {
              onCreate(
                {
                  note: body?.[selectedNote?._id]?.note?.note,
                  image: data,
                },
                selectedNote,
              );
            }}
          />
        </BottomSheetScrollView>
        <CustomButton
          style={{marginBottom: 20 + bottom, marginTop: 20}}
          title="Save"
          onPress={onSubmitHandler}
          disabled={!body?.[selectedNote?._id]?.note}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

export default AddNoteComponent;

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
