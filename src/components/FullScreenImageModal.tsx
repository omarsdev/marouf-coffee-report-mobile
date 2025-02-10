import React, {useState} from 'react';
import {Modal, View, Image, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FullScreenImageModal = ({uri, className}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Thumbnail Image */}
      <TouchableOpacity className={className} onPress={() => setVisible(true)}>
        <Image source={{uri}} className={className} />
      </TouchableOpacity>

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
            source={{uri}}
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </View>
      </Modal>
    </>
  );
};

export default FullScreenImageModal;
