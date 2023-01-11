// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { makeStyles, shorthands } from '@fluentui/react-components';
import { NamedColors } from '../VolumeButtonAndSlider.classNames';

export const submenuButtonStyles = makeStyles({
  container: {
    backgroundColor: NamedColors.transparent,
    width: '275px',
    color: NamedColors.Gray20,
    zIndex: 5
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: NamedColors.transparent,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.border('none'),
    ...shorthands.padding(0)
  },
  backButtonHighContrastFix: {
    ':hover': {
      '@media screen and (-ms-high-contrast: active)': {
        forcedColorAdjust: 'none',
        color: 'HighlightText',
        backgroundColor: 'Highlight'
      }
    }
  },
  backButtonStyle: {
    width: 'calc(100% - 4px)',
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: NamedColors.transparent,
    ...shorthands.borderStyle('none'),
    ...shorthands.padding(0),
    ...shorthands.borderRadius(0),
    ...shorthands.margin('2px'),
    paddingRight: '6px',
    ':focus-visible': {
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.28), 0 0 0 2px white !important'
    }
  },
  itemStyle: {
    backgroundColor: NamedColors.transparent,
    color: NamedColors.White,
    ...shorthands.padding(0),
    ...shorthands.borderRadius(0),
    paddingRight: '8px',
    paddingLeft: '8px'
  },
  itemTooltip: {
    color: NamedColors.White,
    ...shorthands.padding(0)
  },
  dividerStyle: {
    backgroundColor: NamedColors.Gray130,
    ...shorthands.margin(0),
    marginTop: '-2px',
    marginBottom: '-2px'
  }
});
