// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
    Speaker020Regular,
    Speaker120Regular,
    Speaker220Regular,
    SpeakerOff20Regular
  } from '@fluentui/react-icons';
  import { format} from "@uifabric/utilities";
  import {
    Button,
    Tooltip,
    Slider,
    SliderProps,
    SliderOnChangeData,
    mergeClasses,
    shorthands,
    makeStyles
  } from '@fluentui/react-components';
  import * as React from 'react';
//   import { mtcComponentsStyles } from '../../mtcComponents.classNames';
//   import { IButtonUiElementInfo } from '../../sharedMtcUi.types';
  
//   import { usePlaybackControlsContext } from '../../MtcContextProvider';
//   import { useReadOnlyObservable, useObservable } from '@msstream/utilities-hooks';
//   import { altKeyName } from '@msstream/shared-ui';
//   import { isHighContrastActivated } from '../../shared.utils';
import reactToWebComponent from "react-to-webcomponent";
// import style from "./styles.css";

export const altKeyName = "Alt"
const ProductBrandColor: string = '#C30052';
const ProductBackgroundColor: string = '#FAF9F8';
const ProductBorderColor: string = '#E1DFDD';
const ProductPrimaryThemeColor: string = '#BC1948';
const ProductThemeDarkAltColor: string = '#AA1640';
const ProductPrimaryThemeColorDark: string = '#E8467C';
const NamedColors = {
  Black: 'black',
  BlackReddishBackground: 'rgba(27, 26, 25, 0.75)',
  BlackReddishBackgroundHover: 'rgba(50, 49, 48, 0.75)',
  DarkTransparent: '#000000CC',
  DarkGray: '#414141',
  DimGray: '#666666',
  LightBlue: '#E3ECFA',
  LightGray: '#C8C8C8',
  MedGray1: '#BEBBB8',
  MedGray2: '#A19F9D',
  OffGray: '#D2D0CE',
  White: 'white',
  WhiteCurrent: 'rgba(255, 255, 255, 0.15)',
  WhiteHover: 'rgba(255, 255, 255, 0.30)',
  Gray200: '#1B1A19',
  Gray190: '#201F1E',
  Gray170: '#292827',
  Gray170WithOpacity: 'rgba(41, 40, 39, 0.8)',
  Gray130: '#605E5C',
  Gray150: '#3B3A39',
  Gray160: '#323130',
  Gray120: '#797775',
  Gray110: '#8a8886',
  Gray100: '#979593',
  Gray90: '#A19F9D',
  Gray80: '#B3B0AD',
  Gray70: '#BFBFBF',
  Gray60: '#C8C6C4',
  Gray50: '#d2d0ce',
  Gray40: '#E1DFDD',
  Gray30: '#EDEBE9',
  Gray20: '#F3F2F1',
  Green10: '#498205',
  Orange20: '#CA5010',
  Gray100Transparent: '#97959380',
  Orange30: '#8E562E',
  VeryDarkGray: '#4a4a4a',
  VeryLightGray: '#EAEAEA',
  EvenLighterGray: '#F4F3F2',
  EvenDarkerGray: '#212121',
  Disabled: '#C2C2C2',
  linkColorDarkBg: '#D2D0CE',
  linkColorDarkBgHover: '#BEBBB8',
  linkColorDarkBgActive: '#A19F9D',
  linkHoverColor: ProductPrimaryThemeColor,
  slate: 'rgba(31, 26, 26, 0.85)',
  transparentBlack: 'rgba(0, 0, 0, 0.6)',
  transparent: 'rgba(255, 255, 255, 0)',
  LightGrayBackground: 'rgba(255, 255, 255, 0.5)',
  Background: ProductBackgroundColor,
  Border: ProductBorderColor,
  OverlayPanelBackground: 'rgba(37, 36, 35, 0.95)',
  OverlayPanelBackgroundOpaque: 'rgb(37, 36, 35)',
  DarkModeShimmerBase: 'rgb(50, 49, 48)',
  DarkModeShimmerWave: 'rgb(41, 40, 39)',
  DarkModeDisabledText: 'rgb(121, 119, 117)',
  LightModeDisabledText: 'rgb(161, 159, 157)',
  themeLight: '#eda6c3',
  themeDarkAlt: ProductThemeDarkAltColor,
  BluePrimary: '#0078D4',
  BlueShade10: '#106EBE',
  BlueTint30: '#DEECF9',
  BlueTint100: '#005A9E',
  BlackOpaque: '#252423',
  Purple: '#320022',
  Gray160Hover: 'rgba(50, 49, 48, 0.8)',
  Gray150Active: 'rgba(59, 58, 57, 0.8)',
  GrayDisabled: '#5C5C5C'
};

const CssVarNames = {
  volumePercentVar: '--oneplayer-volume-percent'
};

const volumeStyles = makeStyles({
  volumeContainer: {
    position: 'relative'
  },
  sliderContainerStyleHighContrastFix: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundColor: 'Canvas',
      ...shorthands.outline('1px', 'solid', 'ButtonText')
    }
  },
  sliderContainerStyle: {
    height: '0px',
    position: 'absolute',
    bottom: '100%',
    marginBottom: '4px',
    '@media screen and (-ms-high-contrast: active)': {
      backgroundColor: 'GrayText'
    },
    backgroundColor: "red",
    ...shorthands.padding('14px', '8px', '14px'),
    ...shorthands.borderRadius('2px'),
    boxShadow: 'none',
    opacity: '0',
    transitionProperty: 'height, opacity',
    transitionDuration: '0.25s, 0.25s',
    transitionTimingFunction: 'linear, linear',
    overflowY: 'hidden',
    pointerEvents: 'none'
  },
  rail: {
    '@media screen and (-ms-high-contrast: active)': {
      backgroundImage: `linear-gradient(
        to top,
        Highlight 0% var(${CssVarNames.volumePercentVar}),
        CanvasText var(${CssVarNames.volumePercentVar}) 100%)`
    },
    backgroundImage: `linear-gradient(
      to top,
      ${NamedColors.White} 0% var(${CssVarNames.volumePercentVar}),
      ${NamedColors.LightGrayBackground} var(${CssVarNames.volumePercentVar}) 100%)`
  },
  thumb: {
    width: '12px',
    height: '12px',
    backgroundColor: NamedColors.White,
    boxShadow: 'none',
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
  input: {
    cursor: 'pointer'
  }
});

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
      const volumeElem = document.querySelector("azure-video-player")?.shadowRoot?.querySelector("react-test-volume");
      
      const evt = new CustomEvent("mediavolumerequest", {
        composed: true,
        bubbles: true,
        detail: playerVolume
      })

      volumeElem?.dispatchEvent(evt);
      
      // volumeElem?.dispatchEvent(
      //   new window.CustomEvent("mediavolumerequest", {
      //     composed: true,
      //     bubbles: true,
      //     playerVolume
      //   })
      // )
      
      const currentPercentage = Math.round(Math.pow(playerVolume, 1 / volumeExponent) * 100);
      return {
        currentPercentage,
        ariaLabel: format('VolumeSliderAriaLabel', `${currentPercentage}%`)
      };

    }, [playerVolume]);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === "media-volume") {
            // setPlayerVolume(mutation.a);
            const el = mutation.target as HTMLElement;
            const volumeLevel = +(el.getAttribute('media-volume')!);
            setPlayerVolume(volumeLevel);
            console.log(el.getAttribute('media-volume'));
          }
      })
      // console.log(mutations);
      
    })

    React.useEffect(() => {
      window.addEventListener("mediavolumerequest", (ev) => {
        console.log("Here's your event: ", ev)
      })  
      const volumeElem =  document.querySelector("azure-video-player")?.shadowRoot?.querySelector("media-controller")
      observer.observe(volumeElem!, {
        attributeFilter: ['media-volume']
      })
    }, [])
  
    const [sliderTooltipVisible, setSliderTooltipVisible] = React.useState<boolean>(false);
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
      ? mergeClasses(styles.sliderContainerStyle, styles.sliderContainerStyleHighContrastFix)
      : styles.sliderContainerStyle;
    const buttonStyle = isHighContrastChangesEnabled
      ? mergeClasses(sharedStyles.buttonStyle, sharedStyles.buttonStyleHighContrastFix)
      : sharedStyles.buttonStyle;
  
    const onSliderChange: SliderProps['onChange'] = (
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
          tooltipLabel: 'NoAudio',
          buttonAriaLabel: 'NoAudio',
          buttonAriaDescLabel: '',
          buttonIcon:<SpeakerOff20Regular className={sharedStyles.buttonIconStyle} />
        };
      } else {
        if (isMuted || currentPercentageInfo.currentPercentage === 0) {
          return {
            tooltipLabel: format('UnmuteTooltip', altKeyName),
            buttonAriaLabel: 'MuteAriaLabel',
            buttonAriaDescLabel: format('VolumeDescription', altKeyName),
            buttonIcon: <SpeakerOff20Regular className={sharedStyles.buttonIconStyle} />
          };
        } else {
          return {
            tooltipLabel: format('MuteTooltip', altKeyName),
            buttonAriaLabel: 'MuteAriaLabel',
            buttonAriaDescLabel: format('VolumeDescription', altKeyName),
            buttonIcon:
              currentPercentageInfo.currentPercentage > 0.66 ? (
                <Speaker220Regular className={sharedStyles.buttonIconStyle} />
              ) : currentPercentageInfo.currentPercentage > 0.33 ? (
                <Speaker120Regular className={sharedStyles.buttonIconStyle} />
              ) : (
                <Speaker020Regular className={sharedStyles.buttonIconStyle} />
              )
          };
        }
      }
    }, [mediaHasAudio, isMuted, currentPercentageInfo]);
  
    const showSlider = () => {
      console.log("showing slider");
      // if (props.isSliderAllowed) {
        clearTimeout(sliderLeaveTimer);
        if (sliderContainerRef && sliderContainerRef.current) {
          sliderContainerRef.current.style.height = '10px';
          sliderContainerRef.current.style.opacity = '0.8';
          sliderContainerRef.current.style.pointerEvents = 'auto';
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
            sliderContainerRef.current.style.height = '0px';
            sliderContainerRef.current.style.opacity = '0';
            sliderContainerRef.current.style.pointerEvents = 'none';
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
  
    resolvedCSSVars[`${CssVarNames.volumePercentVar}`] = `${currentPercentageInfo.currentPercentage}%`;
  
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
  
    const onVolumeButtonMouseEnter = (): void => {
      
    };
  
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
  
    

    // const myStyles =  makeStyles({
    //   btn: {
    //     position: 'relative',
    //     backgroundColor: 'red'
    //   },
    // })

    // const myClasses = myStyles();

    return (
      <div
        className={styles.volumeContainer}
        // tslint:disable-next-line: jsx-ban-props
        style={{ ...resolvedCSSVars } as React.CSSProperties}
        onMouseEnter={showSlider}
        onMouseLeave={hideSlider}
        onFocus={showSlider}
        onBlur={hideSlider}
      >
        <link rel="stylesheet" type="text/css" href={"styles.css"} />

        <Tooltip
          content={{ className: sharedStyles.tooltip, children: elementInfo.tooltipLabel }}
          relationship='label'
          withArrow
          positioning={{ position: 'after' }}
          mountNode={document.querySelector("azure-video-player")?.shadowRoot?.querySelector("react-test-volume")}
        >
          <Button
            role='menuitemcheckbox'
            icon={elementInfo.buttonIcon}
            onClick={onClick}
            className={"buttonStyle"}
            appearance='transparent'
            aria-description={elementInfo.buttonAriaDescLabel}
            aria-label={elementInfo.buttonAriaLabel}
            aria-checked={isMuted}
            onFocus={onVolumeButtonFocus}
            onMouseEnter={onVolumeButtonMouseEnter}
          />
        </Tooltip>

      
        <div id="sliderContainer" className="sliderContainerStyle" ref={sliderContainerRef}>
          <Tooltip
            content={{
              className: sharedStyles.tooltip,
              children: `${currentPercentageInfo.currentPercentage}%`
            }}
            relationship='inaccessible'
            visible={sliderTooltipVisible}
            positioning={{ position: 'after', target: thumbRef.current }}
            withArrow
            mountNode={props.tooltipMountNode}
          >
            <Slider
              value={currentPercentageInfo.currentPercentage}
              min={0}
              max={100}
              vertical
              size='small'
              aria-label={currentPercentageInfo.ariaLabel}
              thumb={{
                className: isHovering ? "thumb, thumbHover" : "thumb",
                ref: thumbRef
              }}
              input={{ className: "input", role: 'slider' }}
              // tslint:disable-next-line: jsx-ban-props
              style={
                {
                  ...resolvedCSSVars
                } as React.CSSProperties
              }
              rail={{ className: "rail" }}
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
    );
  };
  
//   import reactToWebComponent from "react-to-webcomponent"
// import ReactDOM from 'react-dom';

// const WebGreeting = reactToWebComponent(VolumeButtonAndSlider, React as any, ReactDOM as any)

// customElements.define("my-volume-button", WebGreeting)

// import reactToWebComponent from 'convert-react-to-web-component';
import ReactDom from "react-dom"
import { mergeStyles } from '@uifabric/merge-styles';
const webComponent = reactToWebComponent(VolumeButtonAndSlider, React as any, ReactDom as any);

export default () => customElements.define("react-test-volume", webComponent as any);