import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import FullScreenImageModal from './FullScreenImageModal';
import {normalize} from '@/utils';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const AttachImageComponents = ({
  isEditable = true,
  images = [],
  onUploadImage = (formData: FormData) => {},
  setImages,
}) => {
  const [loading, setLoading] = useState(false);

  const onImageHandler = async (type = 'image') => {
    try {
      setLoading(true);
      let result;

      if (type === 'image') {
        result = await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 0,
        });
      } else {
        result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'back',
          saveToPhotos: true,
        });
      }

      if (result.didCancel) {
        console.error('User cancelled image selection');
        return;
      }

      if (result.errorCode) {
        throw new Error(`Image picker error: ${result.errorMessage}`);
      }

      const selectedImages = result.assets || [];

      for (const image of selectedImages) {
        let formData = new FormData();
        formData.append('image', {
          uri: image.uri,
          name: image.fileName || `upload_${Date.now()}.jpg`,
          type: image.type || 'image/jpeg',
        });

        await onUploadImage(formData);
      }
    } catch (error) {
      console.log(error);
      console.error('onUploadImage Error:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View className="bg-[#0000000F] min-h-24 border-[1px] border-black rounded-3xl justify-center items-center">
        <View className="flex-row items-center gap-3">
          {loading ? (
            <ActivityIndicator />
          ) : images ? (
            <FullScreenImageModal
              uri={images}
              className="flex-1 h-24 rounded-3xl"
              setImages={setImages}
              isEditable={isEditable}
            />
          ) : (
            <>
              {!isEditable && <Entypo name="attachment" size={normalize(17)} />}
              <Text className="text-lg font-normal leading-6 text-left underline">
                {isEditable ? 'No Image' : 'Attach Image'}
              </Text>
            </>
          )}
        </View>
      </View>
      {!isEditable && (
        <View className="flex-row gap-5 mt-5">
          <TouchableOpacity
            disabled={isEditable}
            className="flex-1 bg-[#0000000F] border-[1px] rounded-lg py-3 justify-center items-center gap-2"
            onPress={() => onImageHandler('image')}>
            <Entypo name="image" size={normalize(25)} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isEditable}
            className="flex-1 bg-[#0000000F] border-[1px] rounded-lg py-3 justify-center items-center gap-2"
            onPress={() => onImageHandler('camera')}>
            <Entypo name="camera" size={normalize(25)} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AttachImageComponents;

const styles = StyleSheet.create({});
