// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { makeStyles, shorthands } from '@fluentui/react-components';
import { NamedColors } from './VolumeButtonAndSlider.classNames';

export const playbackExperienceStyles = makeStyles({
  popoverHighContrastFix: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundColor: 'Canvas',
      ...shorthands.border('1px', 'solid', 'buttontext')
    }
  },
  menuTriggerHighContrastFix: {
    '@media screen and (-ms-high-contrast: active)': {
      color: 'CanvasText',
      backgroundColor: 'Canvas',
      ...shorthands.border('1px', 'solid', 'transparent'),
      ...shorthands.borderRadius('0'),
      outlineColor: 'ButtonText'
    },
    ':hover': {
      '@media screen and (-ms-high-contrast: active)': {
        color: 'HighlightText',
        backgroundColor: 'Highlight',
        forcedColorAdjust: 'none'
      }
    },
    ':active': {
      '@media screen and (-ms-high-contrast: active)': {
        color: 'HighlightText',
        backgroundColor: 'Highlight',
        ...shorthands.border('1px', 'solid', 'buttontext'),
        ...shorthands.borderRadius('0')
      }
    },
    '&[aria-expanded="true"]': {
      '@media screen and (-ms-high-contrast: active)': {
        color: 'HighlightText',
        backgroundColor: 'Highlight',
        forcedColorAdjust: 'none'
      }
    },
    '&[aria-checked="true"]': {
      '@media screen and (-ms-high-contrast: active)': {
        color: 'HighlightText',
        backgroundColor: 'Highlight',
        forcedColorAdjust: 'none'
      }
    },
    '&[aria-expanded="true"]:after': {
      '@media screen and (-ms-high-contrast: active)': {
        display: 'none'
      }
    },
    '&[aria-checked="true"]:after': {
      '@media screen and (-ms-high-contrast: active)': {
        display: 'none'
      }
    }
  },
  captionsPopover: {
    '&::-webkit-scrollbar': {
      width: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: NamedColors.Gray70
    },
    backgroundColor: NamedColors.Gray170WithOpacity,
    width: '243px',
    maxWidth: '243px',
    boxShadow: 'none',
    bottom: '20px !important', // Since fluent UI menu sets inline styles to set inset and we need to override that we are adding important
    ...shorthands.borderRadius('2px'),
    ...shorthands.padding(0)
  },
  playbackSpeedPopover: {
    width: '90px',
    maxWidth: '90px',
    minWidth: '90px',
    backgroundColor: NamedColors.Gray170WithOpacity,
    bottom: '20px !important', // Since fluent UI menu sets inline styles to set inset and we need to override that we are adding important
    '&::-webkit-scrollbar': {
      width: '3px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#BFBFBF'
    },
    ...shorthands.padding(0),
    ...shorthands.borderRadius('2px')
  },
  settingsPopover: {
    '&::-webkit-scrollbar': {
      width: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: NamedColors.Gray70
    },
    backgroundColor: NamedColors.Gray170WithOpacity,
    width: '275px',
    maxWidth: '275px',
    boxShadow: 'none',
    ...shorthands.overflow('hidden'),
    bottom: '20px !important', // Since fluent UI menu sets inline styles to set inset and we need to override that we are adding important
    ...shorthands.borderRadius('2px'),
    ...shorthands.padding('3px'),
    ...shorthands.border(0)
  },
  menuItem: {
    backgroundColor: 'transparent'
  },
  // Buttons used to trigger menus in the playback experience region
  menuTrigger: {
    backgroundColor: NamedColors.transparent,
    width: '32px',
    height: '32px',
    minWidth: '32px',
    color: NamedColors.White,
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
    '&[aria-expanded="true"]:after': {
      content: "''",
      display: 'block',
      height: '2px',
      width: '32px',
      position: 'absolute',
      bottom: '0px',
      backgroundColor: NamedColors.White,
      boxSizing: 'inherit'
    },
    '&[aria-checked="true"]:after': {
      content: "''",
      display: 'block',
      height: '2px',
      width: '32px',
      position: 'absolute',
      bottom: '0px',
      backgroundColor: NamedColors.White,
      boxSizing: 'inherit'
    },
    ':focus-visible': {
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.28), 0 0 0 2px white !important'
    },
    ...shorthands.borderStyle('none'),
    ...shorthands.padding('0px')
  },
  iconMenuTrigger: {
    '@media screen and (-ms-high-contrast: active)': {
      color: 'HighlightText',
      backgroundColor: 'GrayText'
    }
  },
  textMenuTrigger: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundColor: 'GrayText'
    }
  },
  // Merged with menuTrigger to style it for the overflow menu
  menuTriggerInOverflow: {
    width: '100%',
    justifyContent: 'left',
    ...shorthands.padding('0px'),
    '&[aria-expanded="true"]:after': {
      marginTop: '34px',
      width: '20px',
      bottom: 'unset'
    },
    '&[aria-checked="true"]:after': {
      marginTop: '34px',
      width: '20px',
      bottom: 'unset'
    }
  },
  // Merged with buttonStyle to style it for the overflow menu
  buttonInOverflow: {
    width: 'calc(100% - 4px)',
    height: '32px',
    fontWeight: 'unset',
    justifyContent: 'left',
    ...shorthands.borderStyle('none'),
    ...shorthands.padding('0px'),
    ...shorthands.margin('2px'),
    paddingRight: '6px',
    paddingLeft: '6px'
  },
  buttonInOverflowRtlFix: {
    justifyContent: 'inherit'
  },

  tooltip: {
    zIndex: 100000
  }
});
