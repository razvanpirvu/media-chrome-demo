// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
    ILocalization,
    IOnePlayerLogging,
    IPlayerApi,
    IObservableProperty,
    IThemeData,
    OnePlayerMediaType
  } from '@msstream/components-oneplayer-typings';
  import { ISettingsStore } from '@msstream/utilities-settings-store';
  
//   import { any } from '@msstream/utilities-telemetry';
//   import { any } from '../FeatureManagement';
//   import { IOverflowableButton } from './PlaybackExperience/MenuWithOverflow';
  
  declare type ITheme = import('@fluentui/react').ITheme;
  
  /**
   * Data that the context provides to all components inside of it.
   */
  export interface IMtcContextData {
    player: IPlayerApi;
    log: IOnePlayerLogging;
    loc: ILocalization;
    playerContainer: HTMLDivElement;
    settingsStore: ISettingsStore<any>;
    handlers: IMtcPlaybackExperienceHandlersData & IMtcPlaybackControlsHandlersData;
    rtl: boolean;
    showPlaybackSpeed: boolean;
    showPopOutButton: IObservableProperty<boolean>;
    themeData: IThemeData;
    getHostTheme: () => ITheme;
    overflowButtons: IObservableProperty<any[]>;
    criticalPlaybackContainer?: HTMLDivElement;
    useBooleanSetting: (settingName: any) => boolean;
    isNextGenEngineEnabled: boolean | undefined;
    mediaType: OnePlayerMediaType | undefined;
  }
  
  export interface IMtcPlaybackExperienceData {
    player: IPlayerApi;
    log: IOnePlayerLogging;
    loc: ILocalization;
    playerContainer: HTMLDivElement;
    settingsStore: ISettingsStore<any>;
    handlers: IMtcPlaybackExperienceHandlersData;
    rtl: boolean;
    showPlaybackSpeed: boolean;
    showPopOutButton: IObservableProperty<boolean>;
    themeData: IThemeData;
    getHostTheme: () => ITheme;
    overflowButtons: IObservableProperty<any[]>;
    criticalPlaybackContainer?: HTMLDivElement;
    useBooleanSetting: (settingName: any) => boolean;
    isNextGenEngineEnabled: boolean | undefined;
    mediaType: OnePlayerMediaType | undefined;
  }
  
  export interface IMtcPlaybackControlsData {
    player: IPlayerApi;
    log: IOnePlayerLogging;
    loc: ILocalization;
    playerContainer: HTMLDivElement;
    settingsStore: ISettingsStore<any>;
    handlers: IMtcPlaybackControlsHandlersData;
    useBooleanSetting: (settingName: any) => boolean;
  }
  
  export interface IMtcSeekBarData {
    player: IPlayerApi;
    log: IOnePlayerLogging;
    loc: ILocalization;
    playerContainer: HTMLDivElement;
    settingsStore: ISettingsStore<any>;
    useBooleanSetting: (settingName: any) => boolean;
  }
  
  export interface IMtcPlaybackExperienceHandlersData {
    // Functions used by the FullscreenToggle component
    requestFullscreen: (
      fullScreenElement: IExtendedDivElement,
      any: any,
      inOverflowMenu?: boolean
    ) => Promise<void>;
    exitFullscreen: (any: any, inOverflowMenu?: boolean) => Promise<void>;
  
    // Functions used by the PopOutButton component
    handlePopOutClick: (any: any, inOverflowMenu?: boolean) => void;
    handlePopOutHover: (any: any, inOverflowMenu?: boolean) => void;
  
    // Boolean and functions used to show/hide the KeyboardShortcutModal component
    isKeyboardShortcutsModalOpen: boolean;
    openKeyboardShortcutModal: (any: any) => void;
    closeKeyboardShortcutModal: () => void;
    handlePictureInPicture: (
      videoElement: HTMLVideoElement,
      inOverflowMenu: boolean,
      any: any
    ) => Promise<void>;
  }
  
  export interface IMtcPlaybackControlsHandlersData {
    // Function used by the SkipButton component
    skipXs: (direction: 'forward' | 'backward', increment: number, any: any) => void;
  
    // Function used by the VolumeButtonAndSlider component
    toggleMute: (any: any) => void;
  
    // Function used by the PlayPauseToggle component
    togglePlayPause: (any: any) => void;
  }
  
  /**
   * Props that we need to pass when creating the context in the MtcManager.
   */
  export interface IMtcContextProps {
    player: IPlayerApi;
    log: IOnePlayerLogging;
    loc: ILocalization;
    playerContainer: HTMLDivElement;
    settingsStore: ISettingsStore<any>;
    showPlaybackSpeed: boolean;
    showPopOutButton: IObservableProperty<boolean>;
    themeData: IThemeData;
    getHostTheme: () => ITheme;
    children?: React.ReactNode;
    overflowButtons: IObservableProperty<any[]>;
    reportUserActivity: () => void;
    pluginsKeyboardShortcuts: IObservableProperty<Map<string, IPluginKeyboardShortcutMapValue>>;
    criticalPlaybackContainer?: HTMLDivElement;
    playerRegionContainer?: HTMLDivElement;
    isNextGenEngineEnabled: boolean | undefined;
    popOutButtonItemUrlQueryStringProperties?: string | undefined;
    mediaType?: OnePlayerMediaType | undefined;
    getItemUrl: () => string | undefined;
  }
  
  export interface IExtendedDivElement extends HTMLDivElement {
    msRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
  }
  
  export interface IExtendedVideoElement extends HTMLVideoElement {
    webkitEnterFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    fullscreenEnabled?: () => Promise<void>;
    webkitFullscreenEnabled?: () => Promise<void>;
    mozFullScreenEnabled?: () => Promise<void>;
    msFullscreenEnabled?: () => Promise<void>;
    webkitSupportsFullscreen?: boolean;
  }
  
  export interface IPluginKeyboardShortcutMapValue {
    pluginName: string;
    callback: () => void;
  }
  