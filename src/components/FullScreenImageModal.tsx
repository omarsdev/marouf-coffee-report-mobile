import React, {useState} from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Update props type to accept string or string[]
interface FullScreenImageModalProps {
  uri: string | string[];
  className: string;
  isEditable: boolean;
  setImages?: () => {};
}

const FullScreenImageModal = ({
  uri,
  className,
  setImages,
  isEditable,
}: FullScreenImageModalProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Convert single uri to array for consistent handling
  const images = Array.isArray(uri) ? uri : [uri];

  const removeImage = (item: string) => {
    if (setImages) {
      if (Array.isArray(uri)) {
        setImages(images.filter(e => e !== item));
      } else {
        setImages([]);
      }
    }
  };

  const renderGridItem = ({item, index}) => (
    <TouchableOpacity
      className={`${className} flex-1 m-1 relative`}
      onPress={() => {
        setSelectedImageIndex(index);
        setVisible(true);
      }}>
      {!isEditable && (
        <TouchableOpacity
          onPress={() => removeImage(item)}
          className="absolute top-0 -right-2 bg-red-600 w-7 h-7 z-10 rounded-full justify-center items-center">
          <FontAwesome name="remove" size={14} color="white" />
        </TouchableOpacity>
      )}
      <Image source={{uri: item}} className={className} />
    </TouchableOpacity>
  );

  return (
    <>
      {/* Grid View */}
      <FlatList
        data={images}
        renderItem={renderGridItem}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 4}}
        scrollEnabled={false}
      />

      {/* Full-Screen Modal */}
      <Modal visible={visible} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* Close Button in Top-Right */}
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
              padding: 8,
            }}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* Full-Screen Image */}
          <Image
            source={{uri: images[selectedImageIndex]}}
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </View>
      </Modal>
    </>
  );
};

export default FullScreenImageModal;
