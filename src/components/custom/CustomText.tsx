import React from 'react';
import {StyleSheet, Text} from 'react-native';
import fonts from '../../assets/fonts';
import colors from '../../assets/colors';
import i18n from '../../locales';

const CustomText = ({title, style, children, font, ...rest}) => {
  if (title.text === null || title.text === undefined) {
    throw new Error('Forgot to use CustomText.t in title', title);
  }

  return (
    <Text
      style={[styles.container, style ?? {}, font && {fontFamily: font}]}
      {...rest}>
      {title && title.text}
      {children}
    </Text>
  );
};

export default CustomText;
CustomText.t = t => ({text: i18n.t(t)});
CustomText.ct = t => ({text: t});
CustomText.tLang = t => {
  if (!t) {
    return {text: ''};
  }
  return i18n.language === 'ar'
    ? {text: t.arName || t.ar || ''}
    : {text: t.enName || t.en || ''};
};

const styles = StyleSheet.create({
  container: {
    fontFamily: fonts.inter.regular,
    color: colors.black,
  },
});
