// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  FluentProvider,
  Tooltip,
  webDarkTheme,
  Slider,
  sliderCSSVars,
  SliderOnChangeData,
  SliderProps,
  PositioningImperativeRef,
  mergeClasses,
} from "@fluentui/react-components";

//   import { IObservableProperty, PlayState } from '@msstream/components-oneplayer-typings';
import { formatString, throttle } from "@msstream/shared-services";

import React from "react";
import {
  convertTimeInSecondsToTimeString,
  getPercent,
  timestampWidthBreakpoint,
  formatAriaTime,
  bulletPointIcon,
} from "../shared.utils";

import { commonMtcStyles } from "../mtcComponents.classNames";

import { useSeekBarContext } from "../MtcContextProvider";
import { CssVarNames, getStyles } from "./SeekBar.classNames";

// import { useObservable } from '@msstream/utilities-hooks';

export interface ISeekBarProperties {
  pluginsDiv: React.RefObject<HTMLDivElement>;
  volumeSliderShown: boolean;
  seekBarRailShown: boolean;
  tooltipExtraText: string | undefined;
  isSeekBarHovering: boolean;
  relativeMousePointerPosition: number | undefined;
}

/**
 * Seek bar subscribes to player current time update and buffer ranges and
 * updates view based on player state. User can interact with the seek bar to
 * change current time by clicking or seeking.
 *
 * Performance: Current time updates more than 5 times a second and on some
 * browsers this be as much as frame rate. Depending slider to update on every
 * time update is very costly since this triggers react rerenders and on slower
 * CPUs this can mean upto 200ms. This is very costly in performance
 * perspective. To avoid this we set slider css properties directly instead of
 * state update. This gets time taken to perform visual update down to less than
 * 10ms in slower CPU cases and less than a second in normal cases.
 *
 * User action: On clicking on seekbar slider sends update to onSliderChange
 * function. On receiving the update we update css properties to reflect user
 * selection on update then update player current time.
 *
 * User seeking: On seeking slider updates the values on every mouse move. These
 * are captured and css is updated and player current time is updated. But since
 * this can trigger multiple values on one seek, we set slider to seeking state
 * on mouse down and seeking false on mouse up and logs the value on mouse up.
 * When seeking we take time from mouse hover point to update player since the
 * time update from input does not match tooltip time due to minute calculation
 * discrepancies on longer videos. In other cases value from input is used and logged.
 *
 * Accessibility: When using seek bar with screen reader, we use aria-valuetext
 * to update screen reader of current time. But as current time updates more
 * than 5 times every second, this triggers multiple messages and is a nusense
 * to user. To avoid this we update aria-valuetext only once every 8 seconds. 8
 * seconds based on Azure Media player settings and since this has already
 * passed accessibility testing. On first focus in we set full aria-valuetext to
 * 'current time of to total duration'. If user keeps focus on seek bar, value
 * is updated on 8 second intervals. When setting full text on first focus, we
 * skip interval update since last update might trigger right after full message
 * and can confuse user.
 */

class Player {
  private _player: HTMLMediaElement | null;
  private _mediaController: HTMLElement | null;

  constructor() {
    this._mediaController = document.querySelector("media-controller");
    this._player = this._mediaController?.querySelector(
      "#video"
    ) as HTMLMediaElement;
  }

  get currentTimeInSeconds() {
    const currentTime =
      +this._mediaController?.getAttribute("media-current-time")!;
    return {
      value: currentTime,
    };
  }

  public setCurrentTime(timeInSeconds: number) {
    const evt = new CustomEvent("mediaseekrequest", {
      composed: true,
      bubbles: true,
      detail: timeInSeconds,
    });
    this._mediaController?.dispatchEvent(evt);
  }

  get mediaDurationInSeconds() {
    const duration = +this._mediaController?.getAttribute("media-duration")!;
    // TODO: convert duration to seconds
    return Math.round(duration);
  }

  get playState() {
    const isPaused = this._mediaController?.getAttribute("media-paused")!;

    return { value: isPaused ? "Paused" : "Playing" };
  }
}

export const SeekBar: React.FunctionComponent<any> = () => {
  const player = new Player();

  const seekBarPadding: number = 16;
  // const { log } = useSeekBarContext();
  // const isFluentMtcSeekBarAriaTextFixEnabled = useBooleanSetting(
  //   "isFluentMtcSeekBarAriaTextFixEnabled"
  // );
  const isFluentMtcSeekBarAriaTextFixEnabled = true;
  const currentValue = player.currentTimeInSeconds.value || 0;
  const resolvedCSSVars = {};
  const [toolTipContent, setToolTipContent] = React.useState("0:00");
  const [dimension, setDimensions] = React.useState<DOMRect>();
  const positioningRef = React.useRef<PositioningImperativeRef>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const sliderInputRef = React.useRef<HTMLInputElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const [tooltipMountNode, setTooltipMountNode] =
    React.useState<HTMLElement | null>();
  const [thumbMountNode, setThumbMountNode] =
    React.useState<HTMLElement | null>();
  const [sliderMountNode, setSliderMountNode] =
    React.useState<HTMLElement | null>();
  const [hoverTime, setHoverTime] = React.useState<number>(-1);
  const [scrubbing, setScrubbing] = React.useState<boolean>(false);
  const [initialFocus, setInitialFocus] = React.useState<boolean>(false);
  const [skipNextUpdate, setSkipNextUpdate] = React.useState<boolean>(false);
  const [ariaUpdateTimer, setAriaUpdateTimer] = React.useState<
    number | undefined
  >(undefined);
  const [isTimestampShown, setIsTimestampShown] =
    React.useState<boolean>(false);
  const [isHovering, setIsHovering] = React.useState(false);
  // const [isRailShown] = React.useState(props.seekBarRailShown);
  const [isRailShown] = React.useState(true);
  const [playerContainer, setPlayerContainer] = React.useState(
    document.querySelector("media-controller")?.parentElement
  );
  // const [tooltipExtraText] = React.useState(props.tooltipExtraText);
  const [tooltipExtraText] = React.useState("props.tooltipExtraText");
  // const [customRelativeMousePointerPosition] = React.useState(
  //   props.relativeMousePointerPosition
  // );

  const [sliderWidth, setSliderWidth] = React.useState("200px");
  const styles = getStyles();

  const resizeContainer: HTMLDivElement = React.useMemo(() => {
    const container = document.querySelector("media-controller")?.parentElement;
    // const resizeContainerQuery = playerContainer.getElementsByClassName(
    //   "fluent-critical-ui-container"
    // );
    // return resizeContainerQuery!.length
    //   ? (resizeContainerQuery[0] as HTMLDivElement)
    //   : playerContainer;
    return playerContainer as HTMLDivElement;
  }, [playerContainer]);

  let railStyle = styles.rail;
  let tooltipStyle = styles.tooltip;
  let isTooltipVisible: boolean | undefined = undefined;
  const isRangeMarkerFeatureEnabled = false;
  if (isRangeMarkerFeatureEnabled) {
    railStyle = isRailShown ? styles.rail : styles.hiddenRail;
    tooltipStyle = styles.newTooltip;
    isTooltipVisible = isHovering; //|| customRelativeMousePointerPosition !== undefined;
  }
  const isSafariFluentMtcTooltipMountModeBugFixEnabled = true;
  const tooltipMountNodeStyle = isSafariFluentMtcTooltipMountModeBugFixEnabled
    ? commonMtcStyles().tooltipMountNode
    : "";

  /**
   * On average screen readers take about 2 to 4 seconds to complete reading
   * video duration information. To avoid updating time on every time update and
   * trigger multiple messages in a second a limit of 8 seconds have been set in
   * AMP. This is same implementation from AMP.
   */
  const ariaUpdateIntervalLength: number = 8000;

  const arrowKeyStepValue = 5;

  const updateSlider = (time: number | undefined) => {
    if (
      typeof time === "number" &&
      sliderRef.current &&
      sliderInputRef.current
    ) {
      const percent = getPercent(time, 0, player.mediaDurationInSeconds);
      sliderRef.current.style.setProperty(
        sliderCSSVars.sliderProgressVar,
        `${percent}%`
      );
      sliderRef.current.style.setProperty(
        `${CssVarNames.playProgressVar}`,
        `${percent}%`
      );
      sliderInputRef.current.setAttribute("value", time.toString());
    }
  };

  const updateTooltipContent = (time: number) => {
    let tooltipCont = isTimestampShown
      ? `${convertTimeInSecondsToTimeString(
          time
        )} / ${convertTimeInSecondsToTimeString(player.mediaDurationInSeconds)}`
      : convertTimeInSecondsToTimeString(time);
    if (isRangeMarkerFeatureEnabled && tooltipExtraText) {
      tooltipCont = `${tooltipCont} ${bulletPointIcon} ${tooltipExtraText}`;
    }
    setToolTipContent(tooltipCont);
  };

  const updateTooltipMountNode = (onFocus: boolean) => {
    if (onFocus) {
      setTooltipMountNode(thumbMountNode);
    } else {
      setTooltipMountNode(sliderMountNode);
    }
  };

  /**
   * Set scrubbing to true so while seek bar updates value while moving mouse,
   * we do not log it until action is complete.
   */
  const onSeekBarMouseDown = () => {
    setScrubbing(true);
    // log.userAction("SeekbarAction", {
    //   name: "ChangePlaybackTimeStart",
    //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
    //   actionType: "LeftClick",
    // });
  };

  /** On mouse up we log message only once with final value. */
  const onSeekBarMouseUp = () => {
    setScrubbing(false);
    // log.userAction("SeekbarAction", {
    //   name: "ChangePlaybackTimeEnd",
    //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
    //   actionType: "LeftClick",
    // });
  };

  /**
   * On first focus on seek bar,we will read full information about the current
   * duration 10 seconds of 2 minutes 34 seconds etc. If focus stays on seek bar
   * we will not read complete message but just current time.
   *
   * If focus leaves seek bar and returns later, we will read full message
   * again. If there is a timer already running to update message, upon setting
   * full message we will skip next update so it does not happen just right
   * after first full message update.
   */
  const onSeekBarFocus = () => {
    updateTooltipMountNode(true);
    if (!initialFocus) {
      // First update attributes on focus and set full message as "00:00:23 of 00:12:34"
      // so screen reader reads this as 23 seconds of 12 minutes 34 seconds
      updateAriaAttributes(true);
      // Then set skip. This skips next update to avoid message right after setting full message if timer is already running
      setSkipNextUpdate(true);
      // Set initial focus to true so we will not update focus is in seek bar while in scan mode.
      // We set this to false of blur so when focus returns we can set full message again
      setInitialFocus(true);

      updateTooltipContent(player.currentTimeInSeconds.value || 0);
      if (thumbRef.current) {
        positioningRef.current?.setTarget(thumbRef.current);
      }
    }
  };

  const onSeekBarBlur = () => {
    // Set initial to false so we can set full aria value test on next focus.
    setInitialFocus(false);
    updateTooltipMountNode(false);
  };

  const setAriaInterval = () => {
    if (!ariaUpdateTimer) {
      setAriaUpdateTimer(
        setInterval(updateAriaAttributes, ariaUpdateIntervalLength)
      );
    }
  };

  /**
   * Clear interval on pause and on component unmount. Set it to undefined so we
   * can set new one on play start.
   */
  const clearAriaInterval = () => {
    if (ariaUpdateTimer) {
      clearInterval(ariaUpdateTimer);
      setAriaUpdateTimer(undefined);
    }
  };

  /**
   * Returns screen reader recognizable string in two formats. 00:12:34 of
   * 00:34:45 or just current time as 00:12:24.
   */
  const getAriaValueText = (fullStringUpdate: boolean = false): string => {
    if (fullStringUpdate) {
      return formatString(
        "SeekBar.AriaValueFormat",
        isFluentMtcSeekBarAriaTextFixEnabled
          ? formatAriaTime(
              convertTimeInSecondsToTimeString(
                player.currentTimeInSeconds.value || 0,
                true
              )
            )
          : convertTimeInSecondsToTimeString(
              player.currentTimeInSeconds.value || 0,
              true
            ),
        isFluentMtcSeekBarAriaTextFixEnabled
          ? formatAriaTime(
              convertTimeInSecondsToTimeString(
                player.mediaDurationInSeconds,
                true
              )
            )
          : convertTimeInSecondsToTimeString(
              player.mediaDurationInSeconds,
              true
            )
      );
    } else {
      return isFluentMtcSeekBarAriaTextFixEnabled
        ? formatAriaTime(
            convertTimeInSecondsToTimeString(
              player.currentTimeInSeconds.value || 0,
              true
            )
          )
        : convertTimeInSecondsToTimeString(
            player.currentTimeInSeconds.value || 0,
            true
          );
    }
  };

  /**
   * Updates aria value text attribute on input element. Updates to just current
   * time if video is playing. Should skip if scrubbing, if skip attribute is
   * set. Sets full message ignoring other conditions if force is set.
   */
  const updateAriaAttributes = (force: boolean = false) => {
    if (
      sliderInputRef.current &&
      !skipNextUpdate &&
      player.playState.value === "Playing" &&
      !scrubbing &&
      !force
    ) {
      sliderInputRef.current.setAttribute("aria-valuetext", getAriaValueText());
    } else if (sliderInputRef.current && force) {
      sliderInputRef.current.setAttribute(
        "aria-valuetext",
        getAriaValueText(true)
      );
    } else if (skipNextUpdate) {
      setSkipNextUpdate(false);
    }
  };

  /* istanbul ignore next */
  const onSliderChange: SliderProps["onChange"] = (
    _: React.ChangeEvent<HTMLInputElement>,
    _data: SliderOnChangeData
  ) => {
    if (scrubbing) {
      // Don't log here since mouse is still down. We will log on mouse up.
      // when mouse down use hover time to set current time so it matches tooltip and set time.
      console.log("Scrubbing...");
      console.log(hoverTime);
      updateSlider(hoverTime);
      player.currentTimeInSeconds.value = hoverTime;
      player.setCurrentTime(hoverTime);
    }
  };

  const getRect = (x: number = 0, y: number = 0): (() => DOMRect) => {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
      x: 0,
      y: 0,
      toJSON: () => {
        // Do nothing
      },
    });
  };

  /**
   * This hook callback will get called whenever customMousePointerPosition is
   * changed, or hover state of SeekBar is changed. It will make mouse hover
   * pointer visible, and will update it's position as well as tooltip position
   * to match customMousePointerPosition.
   */

  // React.useEffect(() => {
  //   if (
  //     isRangeMarkerFeatureEnabled &&
  //     sliderRef.current &&
  //     customRelativeMousePointerPosition !== undefined &&
  //     dimension
  //   ) {
  //     const mouseHoverDisplay = isTooltipVisible ? "inline-block" : "none";
  //     sliderRef.current.style.setProperty(
  //       `${CssVarNames.mouseHoverDisplay}`,
  //       mouseHoverDisplay
  //     );
  //     const xPosition =
  //       dimension.left + customRelativeMousePointerPosition * dimension.width;
  //     updateSliderPosition(xPosition); // Update mouse hover pointer and tooltip positions
  //   }
  // }, [customRelativeMousePointerPosition, isHovering]);

  React.useEffect(() => {
    setPlayerContainer(
      document.querySelector("media-controller")?.parentElement
    );
    const updateSliderRef = () => {
      if (sliderRef.current) {
        console.log("slider ref");
        console.log(sliderRef.current.getBoundingClientRect());
        console.log(
          "player container, ",
          document.querySelector("media-controller")?.parentElement?.clientWidth
        );
        setDimensions(sliderRef.current.getBoundingClientRect());
        sliderRef.current.style.width = `${
          document.querySelector("media-controller")?.clientWidth! - 10
        }px`;
        if (
          sliderRef.current.getBoundingClientRect().width + seekBarPadding <
          timestampWidthBreakpoint
        ) {
          setIsTimestampShown(true);
        } else {
          setIsTimestampShown(false);
        }
      }
    };

    document.addEventListener("fullscreenchange", updateSliderRef);

    const throttledUpdateSliderRef = throttle(updateSliderRef, 200);
    const sliderResizeObserver = new ResizeObserver(throttledUpdateSliderRef);
    updateSliderRef();
    sliderResizeObserver.observe(
      document.querySelector("media-controller")?.parentElement!
    );

    // const unsubscribeCurrentTime =
    //   player.currentTimeInSeconds.subscribe(updateSlider);

    const updateTimeObserver = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "media-current-time"
        ) {
          const el = mutation.target as HTMLElement;
          const currentTime = +el.getAttribute("media-current-time")!;
          updateSlider(currentTime);
        }
      });
    };
    const updateTimeObserverThrottled = throttle(updateTimeObserver, 1000);
    const timeObserver = new MutationObserver(updateTimeObserverThrottled);
    const el = document.querySelector("media-controller");
    timeObserver.observe(el!, {
      attributeFilter: ["media-current-time"],
    });

    // const unsubscribeBuffer = player.bufferedTimeRanges.subscribe(

    // const unsubscribeBuffer =
    // (ranges: TimeRanges | undefined) => {
    //     if (ranges && ranges.length > 0 && sliderRef.current) {
    //       const currentPlayPosition = player.currentTimeInSeconds.value || 0;
    //       for (let i = 0; ranges.length > 0; i++) {
    //         if (
    //           currentPlayPosition >= ranges.start(i) &&
    //           currentPlayPosition < ranges.end(i)
    //         ) {
    //           sliderRef.current.style.setProperty(
    //             `${CssVarNames.buffStartVar}`,
    //             `${getPercent(
    //               ranges.start(i),
    //               0,
    //               player.mediaDurationInSeconds
    //             )}%`
    //           );
    //           sliderRef.current.style.setProperty(
    //             `${CssVarNames.buffEndVar}`,
    //             `${getPercent(
    //               ranges.end(i),
    //               0,
    //               player.mediaDurationInSeconds
    //             )}%`
    //           );
    //           break;
    //         }
    //       }
    //     }
    //   }
    // );

    // const unsubscribePlayState = player.playState.subscribe(
    //   (newPlayState: PlayState | undefined) => {
    //     if (newPlayState === "Playing") {
    //       updateAriaAttributes();
    //       setAriaInterval();
    //     } else {
    //       clearAriaInterval();
    //     }
    //   }
    // );

    // const unsubscribeVolumeSliderState = props.volumeSliderShown.subscribe(
    //   (value: boolean) => {
    //     if (sliderRef.current) {
    //       if (value) {
    //         sliderRef.current.style.setProperty(
    //           `${CssVarNames.sliderOpacityVar}`,
    //           "0.2"
    //         );
    //       } else {
    //         sliderRef.current.style.setProperty(
    //           `${CssVarNames.sliderOpacityVar}`,
    //           "1"
    //         );
    //       }
    //     }
    //   }
    // );

    return () => {
      sliderResizeObserver.disconnect();
      timeObserver.disconnect();
      //   unsubscribeCurrentTime();
      // unsubscribeBuffer();
      //   unsubscribePlayState();
      //   unsubscribeVolumeSliderState();
      //   document.removeEventListener("fullscreenchange", updateSliderRef);
    };
  }, [sliderRef.current, sliderInputRef.current]);

  // React.useEffect(() => {
  //   let unsubscribeCurrTime: () => void;
  //   if (tooltipMountNode === thumbMountNode) {
  //     unsubscribeCurrTime = player.currentTimeInSeconds.subscribe(
  //       (time: number | undefined) => {
  //         updateTooltipContent(time || 0);
  //       }
  //     );
  //   }

  //   return () => {
  //     if (unsubscribeCurrTime) {
  //       unsubscribeCurrTime();
  //     }
  //   };
  // }, [tooltipMountNode]);

  React.useEffect(() => {
    return () => {
      clearAriaInterval();
    };
  }, []);

  const getHoverValue = (currentPos: number): number => {
    return Math.max(
      0,
      Math.min(
        player.mediaDurationInSeconds * (currentPos / 100),
        player.mediaDurationInSeconds
      )
    );
  };

  /**
   * On mouse/touch move calculate position relative to seek bar and set time to
   * state. This time is used for tooltip and if mouse click happens use the
   * same time to set current time.
   */
  const updateSliderPosition = (xPosition: number) => {
    if (dimension) {
      const distanceFromOrigin = xPosition - dimension.left;
      const mousePos = (distanceFromOrigin / dimension.width) * 100;
      const hoverValue = getHoverValue(mousePos);
      const scrollOffSet = window.pageYOffset || document.body.scrollTop;
      setHoverTime(hoverValue);
      const clientTop =
        document.documentElement.clientTop || document.body.clientTop || 0;
      updateTooltipContent(hoverValue);
      if (sliderRef.current) {
        sliderRef.current.style.setProperty(
          `${CssVarNames.mouseHoverTipVar}`,
          `${mousePos}%`
        );
      }
      positioningRef.current?.setTarget({
        getBoundingClientRect: getRect(
          xPosition,
          dimension.top + scrollOffSet - clientTop
        ),
      } as HTMLElement);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    updateTooltipMountNode(false);
    if (dimension) {
      const xPosition = Math.min(
        Math.max(e.clientX, dimension.left),
        dimension.right
      );
      console.log("Updating slider...");
      console.log(dimension);
      updateSliderPosition(xPosition);
    }
  };

  const onMouseEnter = () => {
    setIsHovering(true);

    // if (isRangeMarkerFeatureEnabled) {
    //   props.isSeekBarHovering.value = true;
    // }
  };

  const onMouseLeave = () => {
    setIsHovering(false);

    // if (isRangeMarkerFeatureEnabled) {
    //   props.isSeekBarHovering.value = false;
    // }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    updateTooltipMountNode(false);
    if (dimension) {
      const xPosition = Math.min(
        Math.max(e.touches[0].clientX, dimension.left),
        dimension.right
      );
      updateSliderPosition(xPosition);
    }
  };

  /** On touch end we log message only once with final value. */
  const onSeekBarTouchEnd = () => {
    setScrubbing(false);
    // log.userAction("SeekbarAction", {
    //   name: "ChangePlaybackTimeEnd",
    //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
    //   actionType: "Touch",
    // });
  };

  /**
   * Set scrubbing to true so while seek bar updates value while moving mouse,
   * we do not log it until action is complete.
   */
  const onSeekBarTouchStart = (e: React.TouchEvent) => {
    setScrubbing(true);
    // log.userAction("SeekbarAction", {
    //   name: "ChangePlaybackTimeStart",
    //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
    //   actionType: "Touch",
    // });
    if (dimension) {
      // We must update the current time on touch start because onSliderChange is not consistently fired for touch devices (such as Android)
      const xPosition = Math.min(
        Math.max(e.touches[0].clientX, dimension.left),
        dimension.right
      );
      const distanceFromOrigin = xPosition - dimension.left;
      const touchPos = (distanceFromOrigin / dimension.width) * 100;
      const newHoverValue = getHoverValue(touchPos);
      player.currentTimeInSeconds.value = newHoverValue;
    }
  };

  React.useEffect(() => {
    if (sliderRef.current && dimension) {
      sliderRef.current.style.width = `${dimension!.width}`;
      console.log("Updating slider width...");
      setSliderWidth(dimension.width.toString());

      setPlayerContainer(
        document.querySelector("media-controller")?.parentElement
      );
      const updateSliderRef = () => {
        if (sliderRef.current) {
          console.log("slider ref");
          console.log(sliderRef.current.getBoundingClientRect());
          // setDimensions(sliderRef.current.getBoundingClientRect());
          if (
            sliderRef.current.getBoundingClientRect().width + seekBarPadding <
            timestampWidthBreakpoint
          ) {
            setIsTimestampShown(true);
          } else {
            setIsTimestampShown(false);
          }
        }
      };
      updateSliderRef();
    }
  }, [dimension]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        if (
          player.currentTimeInSeconds.value !== undefined &&
          player.currentTimeInSeconds.value !== 0
        ) {
          const updatedValue = Math.max(
            player.currentTimeInSeconds.value - arrowKeyStepValue,
            0
          );
          player.currentTimeInSeconds.value = updatedValue;
        }
        break;
      case "ArrowRight":
        if (
          player.currentTimeInSeconds.value !== undefined //&&
          // player.currentTimeInSeconds.value !==
          //   player.mediaDurationInSecondsV2.value
        ) {
          const updatedValue = Math.min(
            player.currentTimeInSeconds.value + arrowKeyStepValue
            // player.mediaDurationInSecondsV2.value
          );
          player.currentTimeInSeconds.value = updatedValue;
        }
        break;
      default:
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight":
        // log.userAction("SeekbarAction", {
        //   name: "ChangePlaybackTimeEnd",
        //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
        //   actionType: "KeyDown",
        // });
        break;
      default:
    }
  };

  return (
    <FluentProvider theme={webDarkTheme} className={styles.container}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Tooltip
          visible={isTooltipVisible}
          positioning={{ positioningRef }}
          content={{ children: toolTipContent, className: tooltipStyle }}
          relationship="inaccessible"
          mountNode={tooltipMountNode}
          hideDelay={0}
        >
          <Slider
            value={currentValue}
            min={0}
            max={player.mediaDurationInSeconds}
            className={styles.root}
            root={{ ref: sliderRef }}
            step={0.01}
            input={{
              ref: sliderInputRef,
              className: styles.input,
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-label": "SeekBar.AriaLabel",
              "aria-live": "polite",
              role: "slider",
            }}
            // tslint:disable-next-line: jsx-ban-props
            style={
              {
                ...resolvedCSSVars,
                "--fui-Slider__thumb--size": "12px",
                width: sliderWidth,
              } as React.CSSProperties
            }
            rail={{
              className: railStyle,
              children: (
                <SeekBarOverRail pluginsDiv={undefined} styles={styles} />
              ),
            }}
            thumb={{
              className: isHovering
                ? mergeClasses(styles.thumb, styles.thumbHover)
                : styles.thumb,
              ref: thumbRef,
              children: (
                <div
                  className={tooltipMountNodeStyle}
                  ref={setThumbMountNode}
                />
              ),
            }}
            onMouseMove={onMouseMove}
            onChange={onSliderChange}
            onMouseDown={onSeekBarMouseDown}
            onMouseUp={onSeekBarMouseUp}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchMove={onTouchMove}
            onTouchStart={onSeekBarTouchStart}
            onTouchEnd={onSeekBarTouchEnd}
            onFocusCapture={onSeekBarFocus}
            onBlur={onSeekBarBlur}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
          />
        </Tooltip>
        <div className={tooltipMountNodeStyle} ref={setSliderMountNode} />
      </div>
    </FluentProvider>
  );
};

interface ISeekBarOverRailProps {
  pluginsDiv?: React.RefObject<HTMLDivElement>;
  styles: ReturnType<typeof getStyles>;
}

const SeekBarOverRail = (props: ISeekBarOverRailProps) => {
  return (
    <div>
      <div
        ref={props.pluginsDiv}
        className={`${props.styles.markersContainer} mtc-markers-container`}
      />
      <span className={`${props.styles.mouseHoverPoint} mouse-tip-point`} />
    </div>
  );
};

// export default SeekBar;
import reactToWebComponent from "react-to-webcomponent";
import ReactDom from "react-dom";
const webComponent = reactToWebComponent(
  SeekBar,
  React as any,
  ReactDom as any
);

export default () =>
  customElements.define("react-seek-bar", webComponent as any);
