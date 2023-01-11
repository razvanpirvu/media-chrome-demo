// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { makeStyles, shorthands } from '@fluentui/react-components';
import { NamedColors } from './VolumeButtonAndSlider.classNames';

export const menuWithOverflowStyles = makeStyles({
  overflowPopover: {
    '&::-webkit-scrollbar': {
      width: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: NamedColors.Gray70
    },
    backgroundColor: NamedColors.Gray170WithOpacity,
    boxShadow: 'none',
    bottom: '20px !important', // Since fluent UI menu sets inline styles to set inset and we need to override that we are adding important
    ...shorthands.borderRadius('2px'),
    ...shorthands.padding(0)
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 4,
    justifyContent: 'flex-end'
  },
  menuItem: {
    backgroundColor: 'transparent'
  },
  tooltip: {
    zIndex: 100000
  }
});
