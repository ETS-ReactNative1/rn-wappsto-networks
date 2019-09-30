import React from 'react';
import color from 'color';
import {StyleSheet} from 'react-native';
import {Platform, Dimensions} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
let variables = require('./../variables/generic').default;

let styles = {};

export function generateStyles(c = {}) {
  Object.assign(
    styles,
    StyleSheet.create({
      container: {
        flex: 1,
        paddingVertical: 5,
        backgroundColor: variables.containerBgColor,
      },
      SplashScreenContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: variables.modalBgColor
      },
      safeAreaView: {
        flex: 1,
        backgroundColor: variables.appBgColor,
      },
      warning: {
        backgroundColor: variables.warning,
        paddingHorizontal: 10,
        paddingVertical: 20,
        textAlign: 'center',
        width: '100%',
      },
      centeredContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: variables.white,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      listItem: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 8,
        borderRadius: variables.borderRadiusBase,
        backgroundColor: color(variables.white).fade(0.1),
      },
      listItemTitleArea: {
        flex: 1,
      },
      listItemArrow: {
        padding: 15,
        //backgroundColor:"yellow"
      },
      listItemHeader: {
        fontSize: variables.defaultFontSize + 4,
        color: variables.primary,
      },
      listItemSubheader: {
        fontSize: variables.defaultFontSize - 1,
        color: variables.textSecondary,
      },
      infoPanel: {
        flex: 1,
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 8,
        borderRadius: variables.borderRadiusBase,
        //  backgroundColor: variables.containerBgColor
      },
      header: {
        padding: 20,
        alignItems: 'center',
      },
      footer: {
        alignItems: 'center',
        padding: 10,
      },
      formElements: {
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      label: {
        fontSize: variables.inputTextSize - 2,
        color: variables.inputBorderColor,
      },
      input: {
        fontSize: variables.inputTextSize,
        height: variables.inputHeight,
        backgroundColor: variables.inputBg,
        borderColor: variables.inputBorderColor,
        borderWidth: variables.borderWidth,
        borderRadius: variables.borderRadiusBase,
        paddingHorizontal: 10,
        marginBottom: 12,
      },
      button: {
        backgroundColor: variables.buttonBg,
        marginVertical: 20,
        borderRadius: variables.borderRadiusBase,
        alignItems: 'center',
        height: variables.inputHeightBase,
        padding: 15,
      },
      roundOutline: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: color(variables.primary).lighten(4),
      },
      btnText: {
        fontSize: variables.buttonTextSize,
        color: variables.buttonColor,
      },
      disabled: {
        backgroundColor: variables.disabled,
      },
      modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: variables.modalBgColor,
      },
      passwordVisibilityButton: {
        position: 'absolute',
        right: 0,
        padding: 18,
      },
      itemPanel: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: color(variables.white).fade(0.1),
      },
      itemContent: {
        flex: 1,
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 30,
        borderRadius: variables.borderRadiusBase,
      },
      itemFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopColor: variables.inputBorderColor,
        borderTopWidth: variables.borderWidth,
      },
      itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomColor: variables.inputBorderColor,
        borderBottomWidth: variables.borderWidth,
      },
      barItem: {
        padding: 8,
      },
      barItemSeparator: {
        borderRightColor: variables.inputBorderColor,
        borderRightWidth: variables.borderWidth,
      },
      ...c,
    }),
  );
  return styles;
}

generateStyles();

export default styles;
