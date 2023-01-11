// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import React from "react";
import {
  createScreenReaderAlert,
  formatString,
  isIOS,
} from "@msstream/shared-services";
import { ActionType } from "@msstream/utilities-telemetry";
// import { isSettingTrue, safeToLog } from '../../common';
import {
  IMtcContextData,
  IMtcContextProps,
  IExtendedDivElement,
  IMtcPlaybackExperienceData,
  IMtcPlaybackControlsData,
  IMtcSeekBarData,
  IExtendedVideoElement,
} from "./MtcContextProvider.types";

// import { OnePlayerFeatureFlags } from '../FeatureManagement';

const isSettingTrue = (val: any) => false;

declare const document: Document & {
  mozFullScreenElement?: unknown;
  webkitFullscreenElement?: unknown;
  msFullscreenElement?: unknown;

  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};

const MtcContext = React.createContext({} as IMtcContextData);
export const mtcKeyboardShortcuts = [
  "Enter",
  "Space",
  "KeyG",
  "KeyK",
  "KeyM",
  "KeyC",
  "KeyL",
  "KeyJ",
  "KeyS",
  "KeyX",
  "KeyZ",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
  "Digit0",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "KeyO",
  "KeyT",
  "Slash",
];

export const MtcContextProvider = ({
  children,
  player,
  log,
  loc,
  settingsStore,
  playerContainer,
  showPlaybackSpeed,
  showPopOutButton,
  themeData,
  getHostTheme,
  overflowButtons,
  reportUserActivity,
  pluginsKeyboardShortcuts,
  criticalPlaybackContainer,
  playerRegionContainer,
  isNextGenEngineEnabled,
  popOutButtonItemUrlQueryStringProperties,
  mediaType,
  getItemUrl,
}: IMtcContextProps) => {
  const [isKeyboardShortcutsModalOpen, setIsKeyboardShortcutsModalOpen] =
    React.useState(false);
  const isNextGenEngineReaderAlertEnabled = false;

  const isPipEnabled = React.useMemo<boolean>(() => {
    return false && document.pictureInPictureEnabled;
  }, [player, settingsStore]);

  React.useEffect(() => {
    document.addEventListener("keydown", handleDocumentContainerKeyPress);
    if (playerRegionContainer) {
      playerRegionContainer.addEventListener(
        "dblclick",
        handlePlayerContainerDoubleClick
      );
    }

    return () => {
      document.removeEventListener("keydown", handleDocumentContainerKeyPress);
      playerContainer.removeEventListener(
        "dblclick",
        handlePlayerContainerDoubleClick
      );
    };
  }, []);

  const useBooleanSetting = React.useCallback((settingName: any) => {
    return isSettingTrue(
      settingsStore.getSettingObject(settingName, "boolean")
    );
  }, []);

  const handlePlayerContainerDoubleClick = () => {
    const isFullscreen = getFullscreenState();
    isFullscreen
      ? exitFullscreen("LeftClick")
      : requestFullscreen(playerContainer, "LeftClick");
  };

  const handleDocumentContainerKeyPress = (event: KeyboardEvent) => {
    if (
      isSettingTrue(
        settingsStore.getSettingObject(
          "isFluentMtcShortcutChangeInPreRollEnabled",
          "boolean"
        )
      ) &&
      player.isPreRoll.value
    ) {
      switch (event.code) {
        case "Enter":
          if (
            isSettingTrue(
              settingsStore.getSettingObject(
                "isFluentMtcPlayButtonFocusFixEnabled",
                "boolean"
              )
            )
          ) {
            const videoElementWhenEnterPressed: IExtendedVideoElement | null =
              playerContainer.querySelector("video");
            if (
              videoElementWhenEnterPressed &&
              document.activeElement === videoElementWhenEnterPressed
            ) {
              togglePlayPause("KeyDown");
            }
          }
          break;
        case "KeyK":
          if (event.altKey) {
            togglePlayPause("KeyDown");
          }
          break;
        case "KeyO":
          if (event.altKey && showPopOutButton.value) {
            handlePopOutClick("KeyDown");
          }
          break;
        default:
      }
    } else {
      switch (event.code) {
        case "Enter":
          if (event.altKey) {
            const isFullscreen = getFullscreenState();
            isFullscreen
              ? exitFullscreen("KeyDown")
              : requestFullscreen(playerContainer, "KeyDown");
          } else {
            const videoElementWhenEnterPressed: IExtendedVideoElement | null =
              playerContainer.querySelector("video");
            if (
              videoElementWhenEnterPressed &&
              document.activeElement === videoElementWhenEnterPressed
            ) {
              togglePlayPause("KeyDown");
            }
          }
          break;
        case "Space":
          const videoElementWhenSpacePressed: IExtendedVideoElement | null =
            playerContainer.querySelector("video");
          if (
            videoElementWhenSpacePressed &&
            document.activeElement === videoElementWhenSpacePressed
          ) {
            togglePlayPause("KeyDown");
          }
          break;
        case "KeyK":
          if (event.altKey) {
            togglePlayPause("KeyDown");
          }
          break;
        case "KeyM":
          if (event.altKey) {
            toggleMute("KeyDown");
          }
          break;
        case "KeyC":
          if (event.altKey) {
            toggleCaptionTracks();
          }
          break;
        case "KeyX":
          if (event.altKey && showPlaybackSpeed) {
            togglePlaybackSpeed("increase");
          }
          break;
        case "KeyZ":
          if (event.altKey && showPlaybackSpeed) {
            togglePlaybackSpeed("decrease");
          }
          break;
        case "KeyL":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            skipXs("forward", 10, "KeyDown");
          }
          break;
        case "KeyJ":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            skipXs("backward", 10, "KeyDown");
          }
          break;
        case "KeyS":
          if (
            event.altKey &&
            isSettingTrue(
              settingsStore.getSettingObject(
                "isFluentKeyboardShortcutsModalShortcutFixEnabled",
                "boolean"
              )
            ) &&
            !isSettingTrue(
              settingsStore.getSettingObject(
                "isFluentKeyboardShortcutsModalShortcutUpdatedFixEnabled",
                "boolean"
              )
            )
          ) {
            openKeyboardShortcutModal("KeyDown");
          }
          break;
        case "KeyG":
          if (
            event.altKey &&
            isSettingTrue(
              settingsStore.getSettingObject(
                "isFluentKeyboardShortcutsModalShortcutUpdatedFixEnabled",
                "boolean"
              )
            )
          ) {
            openKeyboardShortcutModal("KeyDown");
          }
          break;
        case "ArrowRight":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            // Alt + ArrowRight is used by most browsers so we have to prevent
            // the default behavior and stop the propagation
            event.preventDefault();
            event.stopPropagation();
            skipXs("forward", 15, "KeyDown");
          }
          break;
        case "ArrowLeft":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            // Alt + ArrowLeft is used by most browsers so we have to prevent
            // the default behavior and stop the propagation
            event.preventDefault();
            event.stopPropagation();
            skipXs("backward", 15, "KeyDown");
          }
          break;
        case "ArrowUp":
          if (event.altKey) {
            toggleVolume("increase");
          }
          break;
        case "ArrowDown":
          if (event.altKey) {
            toggleVolume("decrease");
          }
          break;
        case "Digit0":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            player.currentTimeInSeconds.value = 0;
          }
          break;
        case "Digit1":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.1);
          }
          break;
        case "Digit2":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.2);
          }
          break;
        case "Digit3":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.3);
          }
          break;
        case "Digit4":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.4);
          }
          break;
        case "Digit5":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.5);
          }
          break;
        case "Digit6":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.6);
          }
          break;
        case "Digit7":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.7);
          }
          break;
        case "Digit8":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.8);
          }
          break;
        case "Digit9":
          if (event.altKey && player.currentTimeInSeconds.value !== undefined) {
            handleMoveToNPercentOfVideo(0.9);
          }
          break;
        case "KeyO":
          if (event.altKey && showPopOutButton.value) {
            handlePopOutClick("KeyDown");
          }
          break;
        case "KeyP":
          if (isPipEnabled && event.altKey) {
            // tslint:disable-next-line: no-floating-promises
            handlePictureInPicture(
              player.getVideoElement() as HTMLVideoElement,
              false,
              "KeyDown"
            );
          }
          break;
        case "Slash":
          if (
            event.altKey &&
            !isSettingTrue(
              settingsStore.getSettingObject(
                "isFluentKeyboardShortcutsModalShortcutFixEnabled",
                "boolean"
              )
            ) &&
            !isSettingTrue(
              settingsStore.getSettingObject(
                "isFluentKeyboardShortcutsModalShortcutUpdatedFixEnabled",
                "boolean"
              )
            )
          ) {
            openKeyboardShortcutModal("KeyDown");
          }
          break;
        default:
          if (event.altKey) {
            const pluginKeyboardShortcut = pluginsKeyboardShortcuts.value.get(
              event.code
            );
            pluginKeyboardShortcut && pluginKeyboardShortcut.callback();
          }
      }
    }

    reportUserActivity();
  };

  const toggleVolume = (type: "increase" | "decrease") => {
    const currentVolume = player.volume.value;
    let newVolume = 0;
    if (type === "increase") {
      newVolume =
        player.volume.value + 0.1 >= 1 ? 1 : player.volume.value + 0.1;
    } else {
      newVolume =
        player.volume.value - 0.1 <= 0 ? 0 : player.volume.value - 0.1;
    }
    player.volume.value = newVolume;
    log.userAction("PlayerChangeSettingAction", {
      actionType: "KeyDown",
      name: "ChangeVolume",
      oldSetting: currentVolume.toString(),
      newSetting: newVolume.toString(),
      playbackTimeSec: player.currentTimeInSeconds.value || -1,
    });
  };

  const togglePlaybackSpeed = (type: "increase" | "decrease") => {
    if (type === "increase") {
      const currentSpeedIndex = player.playbackRates.findIndex(
        (rate: number) => rate === player.playbackRate.value
      );
      if (
        currentSpeedIndex !== -1 &&
        currentSpeedIndex < player.playbackRates.length - 1
      ) {
        player.playbackRate.value = player.playbackRates[currentSpeedIndex + 1];
        const screenReaderString = formatString(
          loc.getString("FluentPlaybackSpeedChangedStatusMessage"),
          player.playbackRates[currentSpeedIndex + 1].toString()
        );
        createScreenReaderAlert(screenReaderString, true);
      }
    } else {
      const currentSpeedIndex = player.playbackRates.findIndex(
        (rate: number) => rate === player.playbackRate.value
      );
      if (currentSpeedIndex > 0) {
        player.playbackRate.value = player.playbackRates[currentSpeedIndex - 1];
        const screenReaderString = formatString(
          loc.getString("FluentPlaybackSpeedChangedStatusMessage"),
          player.playbackRates[currentSpeedIndex - 1].toString()
        );
        createScreenReaderAlert(screenReaderString, true);
      }
    }
  };

  const skipXs = (
    direction: "forward" | "backward",
    increment: number,
    actionType: ActionType
  ) => {
    if (player.currentTimeInSeconds.value !== undefined) {
      if (direction === "forward") {
        player.currentTimeInSeconds.value = Math.min(
          player.currentTimeInSeconds.value + increment,
          player.mediaDurationInSeconds
        );
      } else {
        player.currentTimeInSeconds.value = Math.max(
          player.currentTimeInSeconds.value - increment,
          0
        );
      }

      log.userAction("PlayerButtonAction", {
        name: direction === "backward" ? "SkipBackward" : "SkipForward",
        playbackTimeSec: player.currentTimeInSeconds.value || -1,
        actionType,
      });

      if (isNextGenEngineReaderAlertEnabled) {
        const locStrForSpeech =
          direction === "forward"
            ? loc.getString("VideoSkippedForwardMessage")
            : loc.getString("VideoSkippedBackwardMessage");
        createScreenReaderAlert(
          formatString(locStrForSpeech, Math.floor(increment).toString()),
          true
        );
      }
    }
  };

  const togglePlayPause = (actionType: ActionType) => {
    if (player.playState.value === "Playing") {
      player.playState.value = "Paused";
    } else if (
      player.playState.value === "Paused" ||
      (player.playState.value === "Ended" &&
        useBooleanSetting("isAddEndedPlayStateForPlayPauseToggleEnabled"))
    ) {
      player.playState.value = "Playing";
    }
    log.userAction("PlayerPlayPauseAction", {
      name: player.playState.value === "Paused" ? "Play" : "Pause",
      playbackTimeSec: player.currentTimeInSeconds.value || -1,
      actionType,
    });
  };

  const getFullscreenState = () => {
    return !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  };

  const toggleCaptionTracks = () => {
    let newCaptionTrackLabel = "off";
    if (!player.activeTextTrack.value && player.textTracks.value.length > 0) {
      newCaptionTrackLabel = player.textTracks.value[0].label;
      player.activeTextTrack.value = player.textTracks.value[0];
      const screenReaderString = formatString(
        loc.getString("FluentCaptionsChangedStatusMessage"),
        newCaptionTrackLabel
      );
      createScreenReaderAlert(screenReaderString, true);
    } else {
      let currentIndex = -1;
      for (let i = 0; i < player.textTracks.value.length; i++) {
        if (
          player.textTracks.value[i].label ===
          player.activeTextTrack.value?.label
        ) {
          currentIndex = i;
          break;
        }
      }
      if (currentIndex === player.textTracks.value.length - 1) {
        player.disableTextTracks();
        createScreenReaderAlert(
          loc.getString("CaptionsTurnedOffMessage"),
          true
        );
      } else {
        newCaptionTrackLabel = player.textTracks.value[currentIndex + 1].label;
        player.activeTextTrack.value =
          player.textTracks.value[currentIndex + 1];
        const screenReaderString = formatString(
          loc.getString("FluentCaptionsChangedStatusMessage"),
          newCaptionTrackLabel
        );
        createScreenReaderAlert(screenReaderString, true);
      }
    }

    log.userAction("PlayerButtonAction", {
      name: newCaptionTrackLabel === "off" ? "CaptionsOff" : "CaptionsOn",
      playbackTimeSec: player.currentTimeInSeconds.value || -1,
      actionType: "KeyDown",
    });
  };

  const handleMoveToNPercentOfVideo = (percentage: number) => {
    if (player.currentTimeInSeconds.value !== undefined) {
      player.currentTimeInSeconds.value = Math.round(
        player.mediaDurationInSeconds * percentage
      );
    }
  };

  const addNavQsp = (
    itemUrlWithReferral: string,
    itemUrlWithNavQsp: string
  ) => {
    const itemUrlWithNavQspObject = new URL(itemUrlWithNavQsp);
    const navParam = itemUrlWithNavQspObject.searchParams.get("nav");
    const finalUrl = new URL(itemUrlWithReferral);

    if (navParam) {
      finalUrl.searchParams.set("nav", navParam);
    }

    return finalUrl;
  };

  const handlePopOutClick = (
    actionType: ActionType,
    inOverflowMenu?: boolean
  ) => {
    log.userAction("PlayerButtonAction", {
      name: "PopOut",
      actionType,
      playbackTimeSec: player.currentTimeInSeconds.value
        ? player.currentTimeInSeconds.value
        : -1,
      inOverflowMenu,
    });
    const itemUrlWithNavQsp = getItemUrl();

    if (
      isSettingTrue(
        settingsStore.getSettingObject(
          "isPopOutReferralTelemetryEnabled",
          "boolean"
        )
      )
    ) {
      if (popOutButtonItemUrlQueryStringProperties && itemUrlWithNavQsp) {
        let externalLink = popOutButtonItemUrlQueryStringProperties;

        if (
          isSettingTrue(
            settingsStore.getSettingObject(
              "isPopOutNavQosFixEnabled",
              "boolean"
            )
          )
        ) {
          externalLink = addNavQsp(
            popOutButtonItemUrlQueryStringProperties,
            itemUrlWithNavQsp
          ).toString();
        }

        window.open(externalLink, "_blank");
        if (
          isSettingTrue(
            settingsStore.getSettingObject(
              "isPopOutPauseVideoEnabled",
              "boolean"
            )
          )
        ) {
          player.playState.value = "Paused";
        }
      }
    } else {
      let externalLink = player.itemUrl.value;
      if (
        isSettingTrue(
          settingsStore.getSettingObject("isPopOutNavQosFixEnabled", "boolean")
        )
      ) {
        externalLink = itemUrlWithNavQsp;
      }
      if (externalLink) {
        window.open(externalLink, "_blank");
        if (
          isSettingTrue(
            settingsStore.getSettingObject(
              "isPopOutPauseVideoEnabled",
              "boolean"
            )
          )
        ) {
          player.playState.value = "Paused";
        }
      }
    }
  };

  const handlePopOutHover = (
    actionType: ActionType,
    inOverflowMenu?: boolean
  ) => {
    log.userAction("PlayerButtonAction", {
      name: "PopOutTooltipShown",
      actionType,
      playbackTimeSec: player.currentTimeInSeconds.value
        ? player.currentTimeInSeconds.value
        : -1,
      inOverflowMenu,
    });
  };

  const openKeyboardShortcutModal = (actionType: ActionType) => {
    setIsKeyboardShortcutsModalOpen(true);
    log.userAction("PlayerButtonAction", {
      name: "OpenKeyboardShortcuts",
      actionType,
      playbackTimeSec: player.currentTimeInSeconds.value
        ? player.currentTimeInSeconds.value
        : -1,
    });
  };

  const closeKeyboardShortcutModal = () => {
    setIsKeyboardShortcutsModalOpen(false);
    log.userAction("PlayerButtonAction", {
      name: "CloseKeyboardShortcuts",
      actionType: "LeftClick",
      playbackTimeSec: player.currentTimeInSeconds.value
        ? player.currentTimeInSeconds.value
        : -1,
    });
  };

  const requestFullscreen = async (
    fullScreenElement: IExtendedDivElement,
    actionType: ActionType,
    inOverflowMenu?: boolean
  ) => {
    try {
      if (fullScreenElement.requestFullscreen) {
        await fullScreenElement.requestFullscreen();
      } else if (fullScreenElement.msRequestFullscreen) {
        await fullScreenElement.msRequestFullscreen();
      } else if (fullScreenElement.webkitRequestFullscreen) {
        await fullScreenElement.webkitRequestFullscreen();
      } else if (fullScreenElement.mozRequestFullScreen) {
        await fullScreenElement.mozRequestFullScreen();
      } else if (isIOS()) {
        const currentVideoElement: IExtendedVideoElement | null =
          fullScreenElement.querySelector("video");
        if (currentVideoElement && currentVideoElement.webkitEnterFullscreen) {
          await currentVideoElement.webkitEnterFullscreen();

          // Currently webkitpresentationmodechanged is the only reliable iOS event fired when fullscreen changes
          currentVideoElement.addEventListener(
            "webkitpresentationmodechanged",
            async () => {
              // When in iOS, currentVideoElement.webkitEnterFullscreen enters both web fullscreen and native fullscreen.
              // To avoid users having to click exit fullscreen twice, as soon as fullscreen changes, we exit fullscreen
              // once so that when the user exits native fullscreen, fullscreen is completely exited as expected.
              // tslint:disable-next-line: no-floating-promises
              await exitFullscreen("LeftClick", inOverflowMenu);
            }
          );
        }
      } else {
        logFullscreenWarning(
          false,
          new Error("requestFullscreen method not found.")
        );
        return;
      }

      if (
        !isSettingTrue(
          settingsStore.getSettingObject(
            "isFluentMtcFullscreenChangeHandlerTelemetryEventsEnabled",
            "boolean"
          )
        )
      ) {
        logFullScreen(true, actionType, inOverflowMenu);
      }

      if (isNextGenEngineReaderAlertEnabled) {
        createScreenReaderAlert(loc.getString("EnteredFullscreenAria"), true);
      }
    } catch (error) {
      logFullscreenWarning(true, "error");
    }
  };

  const exitFullscreen = async (
    actionType?: ActionType,
    inOverflowMenu?: boolean
  ) => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      } else if (isIOS()) {
        const currentVideoElement: IExtendedVideoElement | null =
          playerContainer.querySelector("video");
        if (currentVideoElement && currentVideoElement.webkitExitFullscreen) {
          await currentVideoElement.webkitExitFullscreen();
        }
      } else {
        logFullscreenWarning(
          false,
          new Error("exitFullscreen method not found.")
        );
        return;
      }

      if (
        !isSettingTrue(
          settingsStore.getSettingObject(
            "isFluentMtcFullscreenChangeHandlerTelemetryEventsEnabled",
            "boolean"
          )
        ) &&
        actionType
      ) {
        logFullScreen(false, actionType, inOverflowMenu);
      }

      if (isNextGenEngineReaderAlertEnabled) {
        createScreenReaderAlert(loc.getString("ExitedFullscreenAria"), true);
      }
    } catch (error) {
      logFullscreenWarning(false, error);
    }
  };

  const logFullScreen = (
    isFullscreenForLog: boolean,
    actionType: ActionType,
    inOverflowMenu?: boolean
  ): void => {
    log.userAction("PlayerButtonAction", {
      name: isFullscreenForLog ? "FullScreen" : "ExitFullScreen",
      playbackTimeSec: player.currentTimeInSeconds.value || -1,
      actionType,
      inOverflowMenu,
    });
  };

  const logFullscreenWarning = (enter: boolean, error: any) => {
    console.error("logFullscreenWarning: error");
  };

  const toggleMute = (actionType: ActionType) => {
    if (player.hasAudio.value !== false) {
      player.muted.value = !player.muted.value;

      log.userAction("PlayerButtonAction", {
        name: player.muted.value ? "Mute" : "Unmute",
        playbackTimeSec: player.currentTimeInSeconds.value || -1,
        actionType,
      });

      if (isNextGenEngineReaderAlertEnabled) {
        const locString = player.muted.value
          ? "VideoMutedMessage"
          : "VideoUnmutedMessage";
        createScreenReaderAlert(loc.getString(locString), true);
      }
    }
  };

  const logPipUserAction = (
    enter: boolean,
    inOverflowMenu: boolean,
    actionType: ActionType
  ) => {
    log.userAction("PlayerButtonAction", {
      name: enter ? "PictureInPicture" : "ExitPictureInPicture",
      actionType,
      playbackTimeSec: player.currentTimeInSeconds.value
        ? player.currentTimeInSeconds.value
        : -1,
      inOverflowMenu,
    });
  };

  const logPipWarning = (enter: boolean, error: Error) => {
    console.error("logPipWarning(): error");
  };

  const handlePictureInPicture = async (
    videoElement: HTMLVideoElement,
    inOverflowMenu: boolean,
    actionType: ActionType
  ) => {
    if (document.pictureInPictureElement) {
      logPipUserAction(false, inOverflowMenu, actionType);
      try {
        await document.exitPictureInPicture();
      } catch (error) {
        console.error("handlePictureInPicture(): exitPictureInPicture()");
      }
    } else {
      if (document.pictureInPictureEnabled) {
        logPipUserAction(true, inOverflowMenu, actionType);
        try {
          await videoElement.requestPictureInPicture();
        } catch (error) {
          console.error("handlePictureInPicture(): requestPictureInPicture()");
        }
      }
    }
  };

  return (
    <MtcContext.Provider
      value={{
        loc,
        log,
        player,
        playerContainer,
        settingsStore,
        rtl: loc.getString("direction") === "rtl",
        showPlaybackSpeed,
        showPopOutButton,
        themeData,
        getHostTheme,
        handlers: {
          isKeyboardShortcutsModalOpen,
          togglePlayPause,
          requestFullscreen,
          exitFullscreen,
          toggleMute,
          handlePopOutClick,
          handlePopOutHover,
          openKeyboardShortcutModal,
          closeKeyboardShortcutModal,
          skipXs,
          handlePictureInPicture,
        },
        overflowButtons,
        criticalPlaybackContainer,
        useBooleanSetting,
        isNextGenEngineEnabled,
        mediaType,
      }}
    >
      {children}
    </MtcContext.Provider>
  );
};

export function usePlaybackExperienceContext(): IMtcPlaybackExperienceData {
  const context = React.useContext(MtcContext);

  if (!context) {
    throw new Error(
      "usePlaybackExperienceContext must be used within the MtcContextProvider"
    );
  }

  return context;
}

export function usePlaybackControlsContext(): IMtcPlaybackControlsData {
  const context = React.useContext(MtcContext);

  if (!context) {
    throw new Error(
      "usePlaybackControlsContext must be used within the MtcContextProvider"
    );
  }

  return context;
}

export function useSeekBarContext(): IMtcSeekBarData {
  const context = React.useContext(MtcContext);

  if (!context) {
    throw new Error(
      "useSeekBarContext must be used within the MtcContextProvider"
    );
  }

  return context;
}
