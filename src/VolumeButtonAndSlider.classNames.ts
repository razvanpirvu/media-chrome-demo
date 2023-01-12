// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

export const ProductBrandColor: string = '#C30052';
export const ProductBackgroundColor: string = '#FAF9F8';
export const ProductBorderColor: string = '#E1DFDD';
export const ProductPrimaryThemeColor: string = '#BC1948';
export const ProductThemeDarkAltColor: string = '#AA1640';
export const ProductPrimaryThemeColorDark: string = '#E8467C';

import { makeStyles, shorthands } from '@fluentui/react-components';
export const NamedColors = {
  Black: 'black',
  BlackReddishBackground: 'rgba(27, 26, 25, 0.75)',
  BlackReddishBackgroundHover: 'rgba(50, 49, 48, 0.75)',
  DarkTransparent: '#000000CC',
  DarkGray: '#414141',
  DimGray: '#666666',
  LightBlue: '#E3ECFA',
  LightGray: '#C8C8C8',
  Link: ProductBrandColor,
  MedGray1: '#BEBBB8',
  MedGray2: '#A19F9D',
  OffGray: '#D2D0CE',
  White: 'white',
  WhiteCurrent: 'rgba(255, 255, 255, 0.15)',
  WhiteHover: 'rgba(255, 255, 255, 0.30)',
  Gray200: '#1B1A19',
  Gray190: '#201F1E',
  Gray170: '#292827',
  Gray170WithOpacity: 'rgba(41, 40, 39, 0.8)',
  Gray130: '#605E5C',
  Gray150: '#3B3A39',
  Gray160: '#323130',
  Gray120: '#797775',
  Gray110: '#8a8886',
  Gray100: '#979593',
  Gray90: '#A19F9D',
  Gray80: '#B3B0AD',
  Gray70: '#BFBFBF',
  Gray60: '#C8C6C4',
  Gray50: '#d2d0ce',
  Gray40: '#E1DFDD',
  Gray30: '#EDEBE9',
  Gray20: '#F3F2F1',
  Green10: '#498205',
  Orange20: '#CA5010',
  Gray100Transparent: '#97959380',
  Orange30: '#8E562E',
  VeryDarkGray: '#4a4a4a',
  VeryLightGray: '#EAEAEA',
  EvenLighterGray: '#F4F3F2',
  EvenDarkerGray: '#212121',
  Disabled: '#C2C2C2',
  linkColorDarkBg: '#D2D0CE',
  linkColorDarkBgHover: '#BEBBB8',
  linkColorDarkBgActive: '#A19F9D',
  linkHoverColor: ProductPrimaryThemeColor,
  slate: 'rgba(31, 26, 26, 0.85)',
  transparentBlack: 'rgba(0, 0, 0, 0.6)',
  transparent: 'rgba(255, 255, 255, 0)',
  LightGrayBackground: 'rgba(255, 255, 255, 0.5)',
  Background: ProductBackgroundColor,
  Border: ProductBorderColor,
  OverlayPanelBackground: 'rgba(37, 36, 35, 0.95)',
  OverlayPanelBackgroundOpaque: 'rgb(37, 36, 35)',
  DarkModeShimmerBase: 'rgb(50, 49, 48)',
  DarkModeShimmerWave: 'rgb(41, 40, 39)',
  DarkModeDisabledText: 'rgb(121, 119, 117)',
  LightModeDisabledText: 'rgb(161, 159, 157)',
  themeLight: '#eda6c3',
  themeDarkAlt: ProductThemeDarkAltColor,
  BluePrimary: '#0078D4',
  BlueShade10: '#106EBE',
  BlueTint30: '#DEECF9',
  BlueTint100: '#005A9E',
  BlackOpaque: '#252423',
  Purple: '#320022',
  Gray160Hover: 'rgba(50, 49, 48, 0.8)',
  Gray150Active: 'rgba(59, 58, 57, 0.8)',
  GrayDisabled: '#5C5C5C'
};

export const CssVarNames = {
  volumePercentVar: '--oneplayer-volume-percent'
};

export const volumeStyles = makeStyles({
  container: {
    backgroundColor: NamedColors.transparent,
  },
  volumeContainer: {
    position: 'relative'
  },
  sliderContainerStyleHighContrastFix: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundColor: 'Canvas',
      ...shorthands.outline('1px', 'solid', 'ButtonText')
    }
  },
  sliderContainerStyle: {
    height: '0px',
    position: 'absolute',
    bottom: '100%',
    marginBottom: '4px',
    '@media screen and (-ms-high-contrast: active)': {
      backgroundColor: 'GrayText'
    },
    backgroundColor: NamedColors.Gray160,
    ...shorthands.padding('14px', '8px', '14px'),
    ...shorthands.borderRadius('2px'),
    boxShadow: 'none',
    opacity: '0',
    transitionProperty: 'height, opacity',
    transitionDuration: '0.25s, 0.25s',
    transitionTimingFunction: 'linear, linear',
    overflowY: 'hidden',
    pointerEvents: 'none'
  },
  rail: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundImage: `linear-gradient(
        to top,
        Highlight 0% var(${CssVarNames.volumePercentVar}),
        CanvasText var(${CssVarNames.volumePercentVar}) 100%)`
    },
    backgroundImage: `linear-gradient(
      to top,
      ${NamedColors.White} 0% var(${CssVarNames.volumePercentVar}),
      ${NamedColors.LightGrayBackground} var(${CssVarNames.volumePercentVar}) 100%)`
  },
  thumb: {
    width: '12px',
    height: '12px',
    backgroundColor: NamedColors.White,
    boxShadow: 'none',
    ':before': {
      ...shorthands.borderColor(NamedColors.White)
    },
    '@media screen and (-ms-high-contrast: active)': {
      backgroundColor: 'Highlight',
      ':before': {
        ...shorthands.borderColor('Highlight')
      }
    }
  },
  thumbHover: {
    width: '14px',
    height: '14px'
  },
  input: {
    cursor: 'pointer'
  },
  tooltip: {
    zIndex: 100000
  },
  containerStyle: {
    display: 'flex',
    backgroundColor: NamedColors.transparent
  },
  buttonStyleHighContrastFix: {
    '@media screen and (-ms-high-contrast: active)': {
      color: 'CanvasText',
      backgroundColor: 'Canvas',
      outlineColor: 'ButtonText'
    },
    ':hover': {
      '@media screen and (-ms-high-contrast: active)': {
        color: 'HighlightText',
        backgroundColor: 'Highlight',
        outlineColor: 'ButtonText'
      }
    }
  },
  // Common button styling, often merged with more scenario specific styles, e.g. buttonInOverflow
  buttonStyle: {
    display: 'flex',
    ...shorthands.borderRadius('0'),
    color: NamedColors.White,
    '@media screen and (-ms-high-contrast: active)': {
      color: 'HighlightText',
      backgroundColor: 'GrayText'
    },
    ':hover': {
      color: NamedColors.White,
      backgroundColor: NamedColors.Gray160Hover,
      ...shorthands.borderRadius('2px')
    },
    ':active': {
      color: NamedColors.White,
      backgroundColor: NamedColors.Gray150Active,
      ...shorthands.borderRadius('2px')
    },
    ':hover:active': {
      color: NamedColors.White,
      backgroundColor: NamedColors.Gray150Active,
      ...shorthands.borderRadius('2px')
    },
    ':focus-visible': {
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.28), 0 0 0 2px white !important'
    }
  },
  disabledButtonStyle: {
    display: 'flex',
    ...shorthands.borderRadius('0'),
    color: NamedColors.GrayDisabled,
    '@media screen and (-ms-high-contrast: active)': {
      color: 'ButtonText',
      backgroundColor: 'GrayText',
      outlineColor: 'ButtonText'
    }
  },
  buttonIconStyle: {
    width: '20px',
    height: '20px'
  }
});