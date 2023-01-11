// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { makeStyles, shorthands } from '@fluentui/react-components';
import { NamedColors } from '@msstream/shared-ui';

export const CssVarNames = {
  playerContainerHeight: '--oneplayer-container-height'
};

export const submenuStyles = makeStyles({
  container: {
    '&::-webkit-scrollbar': {
      width: '4px',
      ...shorthands.borderRadius('10px')
    },
    '&::-webkit-scrollbar-thumb': {
      ...shorthands.borderRadius('10px'),
      backgroundColor: NamedColors.Gray110,
      '@media screen and (-ms-high-contrast: active)': {
        backgroundColor: 'Highlight'
      }
    },
    backgroundColor: NamedColors.transparent,
    color: NamedColors.Gray20,
    zIndex: 5,
    overflowY: 'auto',
    maxHeight: `var(${CssVarNames.playerContainerHeight})`
  },
  wideContainer: {
    '&::-webkit-scrollbar': {
      width: '4px',
      ...shorthands.borderRadius('10px')
    },
    '&::-webkit-scrollbar-thumb': {
      ...shorthands.borderRadius('10px'),
      backgroundColor: NamedColors.Gray110,
      '@media screen and (-ms-high-contrast: active)': {
        backgroundColor: 'Highlight'
      }
    },
    backgroundColor: NamedColors.transparent,
    width: '100%',
    color: NamedColors.Gray20,
    zIndex: 5,
    overflowY: 'auto',
    maxHeight: `var(${CssVarNames.playerContainerHeight})`
  },
  settingButtonHighContrastFix: {
    height: '32px',
    minHeight: '32px',
    ':hover': {
      '@media screen and (-ms-high-contrast: active)': {
        forcedColorAdjust: 'none',
        color: 'HighlightText',
        backgroundColor: 'Highlight'
      }
    }
  },
  settingButton: {
    width: '100%',
    backgroundColor: NamedColors.transparent,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.border('none'),
    ...shorthands.padding(0)
  },
  settingMenuItemHighContrastFix: {
    ':hover': {
      '@media screen and (-ms-high-contrast: active)': {
        forcedColorAdjust: 'none',
        color: 'HighlightText',
        backgroundColor: 'Highlight'
      }
    }
  },
  settingMenuItem: {
    height: '32px',
    minHeight: '32px',
    backgroundColor: NamedColors.transparent,
    color: NamedColors.White,
    ...shorthands.padding(0),
    ...shorthands.borderRadius(0),
    ...shorthands.margin('2px'),
    paddingRight: '6px',
    paddingLeft: '6px'
  },
  captionsMenuItem: {
    height: 'auto',
    minHeight: '36px',
    backgroundColor: NamedColors.transparent,
    color: NamedColors.White,
    ...shorthands.padding('4px'),
    ...shorthands.borderRadius(0),
    ...shorthands.margin('2px'),
    boxSizing: 'border-box'
  },
  itemTooltip: {
    ...shorthands.padding(0),
    ':hover': {
      '@media screen and (-ms-high-contrast: active)': {
        forcedColorAdjust: 'none',
        color: 'HighlightText',
        backgroundColor: 'Highlight'
      }
    }
  },
  colorItemContainer: {
    display: 'flex'
  },
  colorItemExternalDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    ...shorthands.borderRadius('10px'),
    marginRight: '8px'
  },
  colorItemInternalDiv: {
    width: '10px',
    height: '10px',
    ...shorthands.borderRadius('5px')
  }
});
