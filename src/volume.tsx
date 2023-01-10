// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  Speaker020Regular,
  Speaker120Regular,
  Speaker220Regular,
  SpeakerOff20Regular,
} from "@fluentui/react-icons";
import { format } from "@uifabric/utilities";
import {
  Button,
  Tooltip,
  Slider,
  SliderProps,
  SliderOnChangeData,
  mergeClasses,
  shorthands,
  makeStyles,
  FluentProvider,
  webDarkTheme,
} from "@fluentui/react-components";
import * as React from "react";
//   import { mtcComponentsStyles } from '../../mtcComponents.classNames';
//   import { IButtonUiElementInfo } from '../../sharedMtcUi.types';
import {
  CssVarNames,
  NamedColors,
  volumeStyles,
} from "./VolumeButtonAndSlider.classNames";
//   import { usePlaybackControlsContext } from '../../MtcContextProvider';
//   import { useReadOnlyObservable, useObservable } from '@msstream/utilities-hooks';
//   import { altKeyName } from '@msstream/shared-ui';
//   import { isHighContrastActivated } from '../../shared.utils';
import reactToWebComponent from "react-to-webcomponent";

export const altKeyName = "Alt";

export const mtcComponentsStyles = makeStyles({
  tooltip: {
    zIndex: 100000,
  },
  containerStyle: {
    display: "flex",
    backgroundColor: NamedColors.transparent,
  },
  buttonStyleHighContrastFix: {
    "@media screen and (-ms-high-contrast: active)": {
      color: "CanvasText",
      backgroundColor: "Canvas",
      outlineColor: "ButtonText",
    },
    ":hover": {
      "@media screen and (-ms-high-contrast: active)": {
        color: "HighlightText",
        backgroundColor: "Highlight",
        outlineColor: "ButtonText",
      },
    },
  },
  // Common button styling, often merged with more scenario specific styles, e.g. buttonInOverflow
  buttonStyle: {
    display: "flex",
    ...shorthands.borderRadius("0"),
    color: NamedColors.White,
    "@media screen and (-ms-high-contrast: active)": {
      color: "HighlightText",
      backgroundColor: "GrayText",
    },
    ":hover": {
      color: NamedColors.White,
      backgroundColor: NamedColors.Gray160Hover,
      ...shorthands.borderRadius("2px"),
    },
    ":active": {
      color: NamedColors.White,
      backgroundColor: NamedColors.Gray150Active,
      ...shorthands.borderRadius("2px"),
    },
    ":hover:active": {
      color: NamedColors.White,
      backgroundColor: NamedColors.Gray150Active,
      ...shorthands.borderRadius("2px"),
    },
    ":focus-visible": {
      boxShadow:
        "0 0 2px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.28), 0 0 0 2px white !important",
    },
  },
  disabledButtonStyle: {
    display: "flex",
    ...shorthands.borderRadius("0"),
    color: NamedColors.GrayDisabled,
    "@media screen and (-ms-high-contrast: active)": {
      color: "ButtonText",
      backgroundColor: "GrayText",
      outlineColor: "ButtonText",
    },
  },
  buttonIconStyle: {
    width: "20px",
    height: "20px",
  },
});

export interface IVolumeButtonAndSliderProps {
  tooltipMountNode: HTMLDivElement;
  // isSliderAllowed: boolean;
  //volumeSliderShown: IObservableProperty<boolean>;
}

export interface IButtonUiElementInfo {
  tooltipLabel: string;
  buttonAriaLabel: string;
  buttonAriaDescLabel: string;
  buttonIcon: React.ReactElement;
}

interface ISliderPercentageInfo {
  currentPercentage: number;
  ariaLabel: string;
}

export const VolumeButtonAndSlider: React.FunctionComponent<any> = (
  props: IVolumeButtonAndSliderProps
) => {
  const resolvedCSSVars: Record<string, string> = {};
  const sharedStyles = mtcComponentsStyles();
  const styles = volumeStyles();
  //const { handlers, player, loc, settingsStore, log, useBooleanSetting } = usePlaybackControlsContext();
  const [isMuted, setIsMuted] = React.useState(false);
  const [playerVolume, setPlayerVolume] = React.useState(0);
  const [mediaHasAudio] = React.useState(true);
  let volumeExponent = 1;

  const currentPercentageInfo = React.useMemo<ISliderPercentageInfo>(() => {
    const volumeElem = document.querySelector("media-controller");

    const evt = new CustomEvent("mediavolumerequest", {
      composed: true,
      bubbles: true,
      detail: playerVolume,
    });

    volumeElem?.dispatchEvent(evt);

    const currentPercentage = Math.round(
      Math.pow(playerVolume, 1 / volumeExponent) * 100
    );
    return {
      currentPercentage,
      ariaLabel: format("VolumeSliderAriaLabel", `${currentPercentage}%`),
    };
  }, [playerVolume]);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "media-volume"
      ) {
        // setPlayerVolume(mutation.a);
        const el = mutation.target as HTMLElement;
        const volumeLevel = +el.getAttribute("media-volume")!;
        setPlayerVolume(volumeLevel);
        console.log(el.getAttribute("media-volume"));
      }
    });
    // console.log(mutations);
  });

  React.useEffect(() => {
    window.addEventListener("mediavolumerequest", (ev) => {
      console.log("Here's your event: ", ev);
    });
    const volumeElem = document.querySelector("media-controller");
    observer.observe(volumeElem!, {
      attributeFilter: ["media-volume"],
    });
  }, []);

  const [sliderTooltipVisible, setSliderTooltipVisible] =
    React.useState<boolean>(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [scrubbing, setScrubbing] = React.useState<boolean>(false);
  const scrubbingStartValue = React.useRef(0);
  const scrubbingStartTime = React.useRef(0);
  const hasLoggedOnDismiss = React.useRef(false);
  const hasLoggedOnShow = React.useRef(false);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const sliderContainerRef = React.useRef<HTMLDivElement>(null);
  let sliderLeaveTimer: number;

  const isHighContrastChangesEnabled = false;
  const sliderContainerStyle = isHighContrastChangesEnabled
    ? mergeClasses(
        styles.sliderContainerStyle,
        styles.sliderContainerStyleHighContrastFix
      )
    : styles.sliderContainerStyle;
  const buttonStyle = isHighContrastChangesEnabled
    ? mergeClasses(
        sharedStyles.buttonStyle,
        sharedStyles.buttonStyleHighContrastFix
      )
    : sharedStyles.buttonStyle;

  const onSliderChange: SliderProps["onChange"] = (
    _: React.ChangeEvent<HTMLInputElement>,
    data: SliderOnChangeData
  ) => {
    if (!scrubbing) {
      // log.userAction('VolumeSliderAction', {
      //   actionType: 'LeftClick',
      //   name: 'VolumeSliderChanged',
      //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
      //   oldSetting: currentPercentageInfo.currentPercentage.toString(),
      //   newSetting: data.value.toString(),
      //   settingChangeDuration: 0
      // });
    }
    setPlayerVolume(Math.pow(data.value / 100, volumeExponent));
    if (data.value > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const elementInfo = React.useMemo<IButtonUiElementInfo>(() => {
    if (mediaHasAudio === false) {
      return {
        tooltipLabel: "NoAudio",
        buttonAriaLabel: "NoAudio",
        buttonAriaDescLabel: "",
        buttonIcon: (
          <SpeakerOff20Regular className={sharedStyles.buttonIconStyle} />
        ),
      };
    } else {
      if (isMuted || currentPercentageInfo.currentPercentage === 0) {
        return {
          tooltipLabel: format("UnmuteTooltip", altKeyName),
          buttonAriaLabel: "MuteAriaLabel",
          buttonAriaDescLabel: format("VolumeDescription", altKeyName),
          buttonIcon: (
            <SpeakerOff20Regular className={sharedStyles.buttonIconStyle} />
          ),
        };
      } else {
        return {
          tooltipLabel: format("MuteTooltip", altKeyName),
          buttonAriaLabel: "MuteAriaLabel",
          buttonAriaDescLabel: format("VolumeDescription", altKeyName),
          buttonIcon:
            currentPercentageInfo.currentPercentage > 0.66 ? (
              <Speaker220Regular className={sharedStyles.buttonIconStyle} />
            ) : currentPercentageInfo.currentPercentage > 0.33 ? (
              <Speaker120Regular className={sharedStyles.buttonIconStyle} />
            ) : (
              <Speaker020Regular className={sharedStyles.buttonIconStyle} />
            ),
        };
      }
    }
  }, [mediaHasAudio, isMuted, currentPercentageInfo]);

  const showSlider = () => {
    console.log("showing slider");
    // if (props.isSliderAllowed) {
    clearTimeout(sliderLeaveTimer);
    if (sliderContainerRef && sliderContainerRef.current) {
      sliderContainerRef.current.style.height = "128px";
      sliderContainerRef.current.style.opacity = "0.8";
      sliderContainerRef.current.style.pointerEvents = "auto";
      // props.volumeSliderShown.value = true;
      if (!hasLoggedOnShow.current) {
        // log.userAction('VolumeSliderAction', {
        //   actionType: 'LeftClick',
        //   name: 'VolumeSliderShown',
        //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
        //   oldSetting: currentPercentageInfo.currentPercentage.toString(),
        //   newSetting: currentPercentageInfo.currentPercentage.toString(),
        //   settingChangeDuration: 0
        // });
        hasLoggedOnShow.current = true;
        hasLoggedOnDismiss.current = false;
      }
    }
    // }
  };

  const hideSlider = () => {
    sliderLeaveTimer = window.setTimeout(() => {
      if (sliderContainerRef && sliderContainerRef.current) {
        sliderContainerRef.current.style.height = "0px";
        sliderContainerRef.current.style.opacity = "0";
        sliderContainerRef.current.style.pointerEvents = "none";
        //props.volumeSliderShown.value = false;
        if (!hasLoggedOnDismiss.current) {
          // log.userAction('VolumeSliderAction', {
          //   actionType: 'LeftClick',
          //   name: 'VolumeSliderDismissed',
          //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
          //   oldSetting: currentPercentageInfo.currentPercentage.toString(),
          //   newSetting: currentPercentageInfo.currentPercentage.toString(),
          //   settingChangeDuration: 0
          // });
          hasLoggedOnDismiss.current = true;
          hasLoggedOnShow.current = false;
        }
      }
      // To guarantee the tooltip is never shown without the slider, proactively set it to false
      setSliderTooltipVisible(false);
    }, 100);
  };

  resolvedCSSVars[
    `${CssVarNames.volumePercentVar}`
  ] = `${currentPercentageInfo.currentPercentage}%`;

  const onClick = (): void => {
    //handlers.toggleMute('LeftClick');
  };

  const onVolumeButtonFocus = (): void => {
    // log.userAction('VolumeSliderAction', {
    //   actionType: 'KeyDown',
    //   name: 'VolumeButtonActive',
    //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
    //   oldSetting: currentPercentageInfo.currentPercentage.toString(),
    //   newSetting: currentPercentageInfo.currentPercentage.toString(),
    //   settingChangeDuration: 0
    // });
  };

  const onVolumeButtonMouseEnter = (): void => {};

  const onVolumeSliderMouseDown = () => {
    setScrubbing(true);
    scrubbingStartValue.current = currentPercentageInfo.currentPercentage;
    scrubbingStartTime.current = Date.now();
    setSliderTooltipVisible(true);
  };

  const onVolumeSliderMouseUp = () => {
    setScrubbing(false);
    setSliderTooltipVisible(false);
    // log.userAction('VolumeSliderAction', {
    //   actionType: 'LeftClick',
    //   name: 'VolumeSliderChanged',
    //   playbackTimeSec: player.currentTimeInSeconds.value || -1,
    //   oldSetting: scrubbingStartValue.current.toString(),
    //   newSetting: currentPercentageInfo.currentPercentage.toString(),
    //   settingChangeDuration: Date.now() - scrubbingStartTime.current
    // });
    scrubbingStartValue.current = 0;
  };

  return (
    <FluentProvider theme={webDarkTheme}>
      <div
        className={styles.volumeContainer}
        // tslint:disable-next-line: jsx-ban-props
        style={{ ...resolvedCSSVars } as React.CSSProperties}
        onMouseEnter={showSlider}
        onMouseLeave={hideSlider}
        onFocus={showSlider}
        onBlur={hideSlider}
      >
        <Tooltip
          content={{
            className: sharedStyles.tooltip,
            children: elementInfo.tooltipLabel,
          }}
          relationship="label"
          withArrow
          positioning={{ position: "after" }}
          mountNode={undefined}
        >
          <Button
            role="menuitemcheckbox"
            icon={elementInfo.buttonIcon}
            onClick={onClick}
            className={buttonStyle}
            appearance="transparent"
            aria-description={elementInfo.buttonAriaDescLabel}
            aria-label={elementInfo.buttonAriaLabel}
            aria-checked={isMuted}
            onFocus={onVolumeButtonFocus}
            onMouseEnter={onVolumeButtonMouseEnter}
          />
        </Tooltip>

        <div className={sliderContainerStyle} ref={sliderContainerRef}>
          <Tooltip
            content={{
              className: sharedStyles.tooltip,
              children: `${currentPercentageInfo.currentPercentage}%`,
            }}
            relationship="inaccessible"
            visible={sliderTooltipVisible}
            positioning={{ position: "after", target: thumbRef.current }}
            withArrow
            mountNode={props.tooltipMountNode}
          >
            <Slider
              id="my-slider"
              value={currentPercentageInfo.currentPercentage}
              min={0}
              max={100}
              vertical
              size="small"
              aria-label={currentPercentageInfo.ariaLabel}
              thumb={{
                className: isHovering
                  ? mergeClasses(styles.thumb, styles.thumbHover)
                  : styles.thumb,
                ref: thumbRef,
              }}
              input={{ className: styles.input, role: "slider" }}
              // tslint:disable-next-line: jsx-ban-props
              style={
                {
                  ...resolvedCSSVars,
                } as React.CSSProperties
              }
              rail={{ className: styles.rail }}
              onChange={onSliderChange}
              // tslint:disable-next-line: jsx-no-lambda
              onMouseEnter={() => setIsHovering(true)}
              // tslint:disable-next-line: jsx-no-lambda
              onMouseLeave={() => setIsHovering(false)}
              onMouseDown={onVolumeSliderMouseDown}
              onMouseUp={onVolumeSliderMouseUp}
              // tslint:disable-next-line: jsx-no-lambda
              onFocus={() => setSliderTooltipVisible(true)}
              // tslint:disable-next-line: jsx-no-lambda
              onBlur={() => setSliderTooltipVisible(false)}
            />
          </Tooltip>
        </div>
      </div>
    </FluentProvider>
  );
};

//   import reactToWebComponent from "react-to-webcomponent"
// import ReactDOM from 'react-dom';

// const WebGreeting = reactToWebComponent(VolumeButtonAndSlider, React as any, ReactDOM as any)

// customElements.define("my-volume-button", WebGreeting)

// import reactToWebComponent from 'convert-react-to-web-component';
import ReactDom from "react-dom";
const webComponent = reactToWebComponent(
  VolumeButtonAndSlider,
  React as any,
  ReactDom as any
);

export default () =>
  customElements.define("react-test-volume", webComponent as any);
