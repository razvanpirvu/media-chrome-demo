// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { makeStyles, shorthands } from '@fluentui/react-components';
import { NamedColors } from './VolumeButtonAndSlider.classNames';

export const mtcComponentsStyles = makeStyles({
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

export const commonMtcStyles = makeStyles({
  tooltipMountNode: {
    height: 0,
    width: 0
  }
});
