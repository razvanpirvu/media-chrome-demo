// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Button, mergeClasses, Tooltip,
    shorthands,
    makeStyles } from '@fluentui/react-components';
import { Pause20Regular, Play20Regular } from '@fluentui/react-icons';
// import { useObservable } from '@msstream/utilities-hooks';
import React from 'react';
// import { mtcComponentsStyles } from '../../mtcComponents.classNames';
// import { IButtonUiElementInfo } from '../../sharedMtcUi.types';
// import { usePlaybackControlsContext } from '../../MtcContextProvider';
// import { formatString } from '@msstream/shared-services';
// import { altKeyName } from '@msstream/shared-ui';

import { CssVarNames, NamedColors, volumeStyles } from './VolumeButtonAndSlider.classNames';


export interface IPlayPauseToggleProps {
  tooltipMountNode: HTMLDivElement;
}

export const altKeyName = "Alt"


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

interface PlayerState {
    playState: string
}

const player: PlayerState = {
    playState: 'Playing'
}

export const PlayPauseToggle: React.FunctionComponent<IPlayPauseToggleProps> = (
  props: IPlayPauseToggleProps
) => {
  const styles = mtcComponentsStyles();
//   const { handlers, player, loc, useBooleanSetting } = usePlaybackControlsContext();
  
  const [ playState, setPlayState ] = React.useState(player.playState);
  const isHighContrastChangesEnabled = React.useState(false);
  
  const elementInfo = React.useMemo<any>(() => {
    if (
      playState === 'Paused'
    ) {
      return {
        tooltipLabel: 'PlayTooltip',
        buttonAriaLabel: 'Play',
        buttonAriaDescLabel: 'PlayPauseDescription',
        buttonIcon: <Play20Regular className={styles.buttonIconStyle} />
      };
    } else {
      return {
        tooltipLabel: 'PauseTooltip',
        buttonAriaLabel: 'Pause',
        buttonAriaDescLabel: 'PlayPauseDescription',
        buttonIcon: <Pause20Regular className={styles.buttonIconStyle} />
      };
    }
  }, [playState]);
  
  const buttonStyle = isHighContrastChangesEnabled
    ? mergeClasses(styles.buttonStyle, styles.buttonStyleHighContrastFix)
    : styles.buttonStyle;

  const handleClick = (): void => {
    // handlers.togglePlayPause('LeftClick');
    if (playState === "Playing") {
        setPlayState("Paused");
        document.querySelector("azure-video-player")?.shadowRoot?.querySelector("react-play-pause")?.dispatchEvent(
            new Event("mediapauserequest", {composed: true, bubbles: true})
        )
    } else {
        setPlayState("Playing");
        document.querySelector("azure-video-player")?.shadowRoot?.querySelector("react-play-pause")?.dispatchEvent(
            new Event("mediaplayrequest", {composed: true, bubbles: true})
        )  
    }
  };

  return (
    <Tooltip
      content={{ className: styles.tooltip, children: elementInfo.tooltipLabel }}
      relationship='label'
      withArrow
      mountNode={props.tooltipMountNode}
    >
      <Button
        role='menuitem'
        icon={elementInfo.buttonIcon}
        onClick={handleClick}
        className={buttonStyle}
        appearance='transparent'
        aria-description={elementInfo.buttonAriaDescLabel}
        aria-label={elementInfo.buttonAriaLabel}
      />
    </Tooltip>
  );
};


import reactToWebComponent from "react-to-webcomponent";
import ReactDom from "react-dom"

const webComponent = reactToWebComponent(PlayPauseToggle, React as any, ReactDom as any);
export default () => customElements.define("react-play-pause", webComponent as any);