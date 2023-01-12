// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  FullScreenMaximize20Regular,
  FullScreenMinimize20Regular,
} from "@fluentui/react-icons";
// import { formatString, isIOS } from '@msstream/shared-services';
import React from "react";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
// import { isSettingTrue } from '../../../../common';
// import { usePlaybackExperienceContext } from '../../MtcContextProvider';
// import { IExtendedVideoElement } from '../../MtcContextProvider.types';
// import { altKeyName } from '@msstream/shared-ui';
import { OverflowableButton } from "./OverflowableButton";
import {
  CssVarNames,
  NamedColors,
  volumeStyles,
} from "./VolumeButtonAndSlider.classNames";
// import { useObservable } from '@msstream/utilities-hooks';

export interface IFullscreenToggleProps {
  tooltipMountNode: HTMLDivElement;
  inOverflowMenu: boolean;
}

declare const document: Document & {
  mozFullScreenElement?: unknown;
  webkitFullscreenElement?: unknown;
  msFullscreenElement?: unknown;

  webkitFullscreenEnabled?: boolean;
  mozFullScreenEnabled?: boolean;
  msFullscreenEnabled?: boolean;

  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};

export const FullscreenToggle: React.FunctionComponent<IFullscreenToggleProps> =
  React.memo((props: IFullscreenToggleProps) => {
    // const { handlers, loc, playerContainer, settingsStore, log, player, useBooleanSetting } =
    //   usePlaybackExperienceContext();
    const playerContainer = document.querySelector("media-controller");
    const [isFullscreen, setIsFullscreen] = React.useState(() => {
      return !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    });
    const [loadingState, setLoadingState] = React.useState(false);
    const isAllowed = React.useMemo(() => {
      // Yammer iOS does not support browser full screen yet, but does support video full screen so they recommend checking webkitSupportsFullscreen on the video element.

      const videoElement: any | null = playerContainer!.querySelector("#video");
      const isFullscreenAllowed =
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled ||
        (videoElement &&
          videoElement.readyState > 1 &&
          videoElement.webkitSupportsFullscreen);
      return !!isFullscreenAllowed;
    }, [playerContainer, loadingState]);

    const isFullscreenVoiceAccessFixEnabled = false; //useBooleanSetting('isFullscreenVoiceAccessFixEnabled');
    const styles = volumeStyles();
    let handleFullscreenChange: () => void;

    handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement &&
          document.fullscreenElement.id === playerContainer!.id
          ? true
          : false
      );
    };

    const tooltipText = () => {
      if (isAllowed === false) {
        return "FullScreenButtonUnsupportedTooltip";
      } else {
        return isFullscreen
          ? isFullscreenVoiceAccessFixEnabled
            ? "FullScreenButtonExitTooltipV2"
            : "FullScreenButtonExitTooltip"
          : isFullscreenVoiceAccessFixEnabled
          ? "FullScreenButtonTooltipV2"
          : "FullScreenButtonTooltip";
      }
    };

    React.useEffect(() => {
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, []);

    const handleFullScreenClick = () => {
      if (isAllowed === false) {
        return;
      }
      if (isFullscreen) {
        // tslint:disable-next-line: no-floating-promises
        // handlers.exitFullscreen("LeftClick", props.inOverflowMenu);
        setIsFullscreen(false);
      } else {
        // tslint:disable-next-line: no-floating-promises
        // handlers.requestFullscreen(
        //   playerContainer,
        //   "LeftClick",
        //   props.inOverflowMenu
        // );
        // In iOS we use native fullscreen UI so do not need to update the icon
        // if (!isIOS()) {
        setIsFullscreen(true);
        // }
      }
    };

    React.useEffect(() => {
      const el = document.querySelector("media-controller");
      const eventName = isFullscreen
        ? "mediaenterfullscreenrequest"
        : "mediaexitfullscreenrequest";
      const evt = new CustomEvent(eventName, {
        composed: true,
        bubbles: true,
      });
      el?.dispatchEvent(evt);
    }, [isFullscreen]);

    return (
      <FluentProvider theme={webDarkTheme} className={styles.container}>
        <OverflowableButton
          ariaRole="menuitemcheckbox"
          tooltipMountNode={props.tooltipMountNode}
          inOverflowMenu={props.inOverflowMenu}
          ariaLabel={
            isFullscreenVoiceAccessFixEnabled
              ? "FullScreenButtonAriaLabelV2"
              : "FullScreenButtonAriaLabel"
          }
          ariaDescription={"FullScreenButtonDescription"}
          ariaChecked={isFullscreen}
          icon={
            isFullscreen ? (
              <FullScreenMinimize20Regular />
            ) : (
              <FullScreenMaximize20Regular />
            )
          }
          onClick={handleFullScreenClick}
          buttonCaptionWhenInOverflowMenu={"FullScreenButtonButtonLabel"}
          tooltipText={tooltipText()}
          disabled={isAllowed === undefined ? undefined : !isAllowed}
        />
      </FluentProvider>
    );
  });

import ReactDom from "react-dom";
import reactToWebComponent from "react-to-webcomponent";

const webComponent = reactToWebComponent(
  FullscreenToggle,
  React as any,
  ReactDom as any
);

export default () =>
  customElements.define("react-test-fullscreen", webComponent as any);
