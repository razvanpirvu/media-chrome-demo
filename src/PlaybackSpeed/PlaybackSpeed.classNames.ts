// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { makeStyles, shorthands } from '@fluentui/react-components';
import { NamedColors } from '@msstream/shared-ui';

export const playbackSpeedStyles = makeStyles({
  container: {
    display: 'flex'
  },
  iconContainer: {
    width: '20px'
  },
  labelText: {
    marginLeft: '6px'
  },
  menuItemHighContrastFix: {
    ':hover': {
      '@media screen and (-ms-high-contrast: active)': {
        forcedColorAdjust: 'none',
        color: 'HighlightText',
        backgroundColor: 'Highlight'
      }
    }
  },
  menuItem: {
    backgroundColor: NamedColors.transparent,
    height: '32px',
    minHeight: '32px',
    color: NamedColors.White,
    ...shorthands.borderRadius(0),
    ...shorthands.margin('2px')
  }
});
