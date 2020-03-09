import React, { useState, useCallback } from 'react';
import {TouchableOpacity} from 'react-native';
import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

const PopupButton = React.memo(({ icon, buttonStyle, color, children }) => {
  const [ modalVisible, setModalVisible ] = useState(false);

  const showPopup = useCallback(() => {
    setModalVisible(true);
  }, []);

  const hidePopup = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={showPopup}
        style={theme.common.iconButton}>
        <Icon
          name={icon}
          size={20}
          style={buttonStyle}
          color={color || theme.variables.primary}
        />
      </TouchableOpacity>
      {children(
        modalVisible,
        hidePopup,
        showPopup,
      )}
    </>
  );
});

export default PopupButton;
