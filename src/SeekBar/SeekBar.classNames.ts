// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { makeStyles, shorthands } from '@fluentui/react-components';
import { NamedColors } from '../VolumeButtonAndSlider.classNames';

export const SeekBarColors = {
  SeekBarBackGround: 'rgba(256, 256, 256, 0.5)',
  SeekBarBufferBackground: 'rgba(256, 256, 256, 0.6)'
};

export const CssVarNames = {
  playProgressVar: '--oneplayer-play-progress-percent',
  buffStartVar: '--oneplayer-buff-start-percent',
  buffEndVar: '--oneplayer-buff-end-percent',
  mouseHoverTipVar: '--oneplayer-mouse-hover-tip',
  sliderOpacityVar: '--oneplayer-slider-opacity',
  mouseHoverDisplay: '--oneplayer-mouse-hover-tip-display'
};

export const getStyles = makeStyles({
  root: {
    width: 'calc(100%)',
    cursor: 'pointer',
    minHeight: '12px',
    minWidth: '100px',
    opacity: `var(${CssVarNames.sliderOpacityVar}, 1)`,
    ':hover': {
      '& .mouse-tip-point': {
        display: 'inline-block'
      },
      '& .mtc-markers-container:hover + .mouse-tip-point': {
        display: `var(${CssVarNames.mouseHoverDisplay}, none)`
      }
    }
  },
  input: {
    cursor: 'pointer'
  },
  rail: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundImage: `linear-gradient(
        to right,
        Highlight 0% var(${CssVarNames.playProgressVar}, 0%),
        CanvasText var(${CssVarNames.playProgressVar}, 0%) var(${CssVarNames.buffStartVar}, 0%),
        GrayText var(${CssVarNames.buffStartVar}, 0%) var(${CssVarNames.buffEndVar}, 0%),
        CanvasText 0 100%)`,
      ':before': {
        backgroundImage: 'none'
      }
    },
    backgroundImage: `linear-gradient(
      to right,
      ${NamedColors.White} 0% var(${CssVarNames.playProgressVar}, 0%),
      ${SeekBarColors.SeekBarBackGround} var(${CssVarNames.playProgressVar}, 0%) var(${CssVarNames.buffStartVar}, 0%),
      ${SeekBarColors.SeekBarBufferBackground} var(${CssVarNames.buffStartVar}, 0%) var(${CssVarNames.buffEndVar}, 0%),
      ${SeekBarColors.SeekBarBackGround} 0 100%)
    `,
    ':before': {
      backgroundImage: 'none'
    }
  },
  hiddenRail: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundImage: 'none',
      ':before': {
        backgroundImage: 'none'
      }
    },
    backgroundImage: 'none',
    ':before': {
      backgroundImage: 'none'
    }
  },
  thumb: {
    backgroundColor: NamedColors.White,
    boxShadow: 'none',
    width: '12px',
    height: '12px',
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
  container: {
    backgroundColor: NamedColors.transparent,
    display: 'flex',
    justifyContent: 'center'
  },
  markersContainer: {
    position: 'relative',
    top: '-5px'
  },
  mouseHoverPoint: {
    display: 'none',
    position: 'absolute',
    width: '1px',
    height: '12px',
    bottom: '-4px',
    backgroundColor: NamedColors.White,
    ...shorthands.borderWidth('0px'),
    left: `var(${CssVarNames.mouseHoverTipVar})`
  },
  tooltip: {
    zIndex: 100000,
    pointerEvents: 'none'
  },
  newTooltip: {
    zIndex: 100000,
    pointerEvents: 'none',
    ...shorthands.borderRadius('2px'),
    ...shorthands.padding('8px'),
    maxWidth: '160px',
    maxHeight: '40px',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    backgroundColor: NamedColors.Gray170
  }
});
