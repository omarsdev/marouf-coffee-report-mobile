import React, {forwardRef, useCallback, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {normalize} from '@/utils';
import {launchImageLibrary} from 'react-native-image-picker';
import {userAPI} from '@/api/user';
import CustomButton from '@/components/custom/CustomButton';
import FullScreenImageModal from '@/components/FullScreenImageModal';

const AddNoteComponent = forwardRef<BottomSheet, {}>((props, ref) => {
  const {selectedNote, setSelectedNote, body, onCreate} = props;
  const {bottom} = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  // Handle bottom sheet state changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedNote(null);
    }
  }, []);

  const onUploadImage = async () => {
    try {
      setLoading(true);
      // Step 1: Select an image
      const result = await launchImageLibrary({
        mediaType: 'photo', // Ensure we only pick images
        selectionLimit: 1,
      });

      if (result.didCancel) {
        console.error('User cancelled image selection');
        return;
      }

      if (result.errorCode) {
        throw new Error(`Image picker error: ${result.errorMessage}`);
      }

      const image = result.assets?.[0];
      if (!image) {
        throw new Error('No image selected');
      }

      let formData = new FormData();
      formData.append('image', {
        uri: image?.uri,
        name: image?.fileName || `upload_${Date.now()}.jpg`,
        type: image?.type || 'image/jpeg',
      });

      const res = await userAPI.postImage(formData);
      onCreate(
        {note: body?.[selectedNote?._id]?.note?.note, image: res?.data?.url},
        selectedNote,
      );
    } catch (error) {
      console.error('onUploadImage Error:', error.message || error);
    } finally {
      setLoading(false);
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
          <TouchableOpacity
            onPress={onUploadImage}
            className="bg-[#0000000F] h-24 border-[1px] border-black rounded-3xl justify-center items-center">
            <View className="flex-row items-center gap-3">
              {loading ? (
                <ActivityIndicator />
              ) : body?.[selectedNote?._id]?.note?.image ? (
                <FullScreenImageModal
                  uri={body?.[selectedNote?._id]?.note?.image}
                  className="flex-1 h-28 rounded-3xl"
                />
              ) : (
                <>
                  <Entypo name="attachment" size={normalize(17)} />
                  <Text className="text-lg font-normal leading-6 text-left underline">
                    Attach Image
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </BottomSheetScrollView>
        <CustomButton
          style={{marginBottom: 20 + bottom, marginTop: 20}}
          title="Save"
          onPress={onSubmitHandler}
          disabled={!body?.[selectedNote?._id]?.note || loading}
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
