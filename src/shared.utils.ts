// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// import { isSessionStorageSupported } from '@msstream/shared-services';
// import { getNarratorFriendlyTime, TimeUnitResources } from '@msstream/core';
// import { ILocalization } from '@msstream/components-oneplayer-typings';

export const getPercent = (value: number, min: number, max: number) => {
  return max === min ? 0 : ((value - min) / (max - min)) * 100;
};

export const convertTimeInSecondsToTimeString = (inputTime: number, inHourFormat: boolean = false) => {
  let hourString = '';
  let minuteString = '0:';
  let secondsString = '00';
  let currentTime = Math.floor(inputTime);
  if (currentTime / (60 * 60) >= 1) {
    const hoursParsed = Math.floor(currentTime / (60 * 60));
    hourString = hoursParsed < 10 && inHourFormat ? `0${hoursParsed}:` : `${hoursParsed}:`;
    currentTime = currentTime % (60 * 60);
    minuteString = '00:';
  } else if (inHourFormat) {
    hourString = '00:';
  }

  if (currentTime / 60 >= 1) {
    const minutes = Math.floor(currentTime / 60);
    minuteString =
      minutes <= 9 && (inHourFormat || hourString.length) ? '0' + minutes.toString() : minutes.toString();
    minuteString = minuteString + ':';
    currentTime = currentTime % 60;
  } else if (inHourFormat) {
    minuteString = '00:';
  }

  if (currentTime > 0) {
    const seconds = currentTime;
    secondsString = seconds <= 9 ? '0' + seconds.toString() : seconds.toString();
  }

  return `${hourString}${minuteString}${secondsString}`;
};

export const formatAriaTime = (time: string): string => {
  const timeUnits: any = {
    Year: {
      Singular: '',
      Plural: ''
    },
    Month: {
      Singular: '',
      Plural: ''
    },
    Day: {
      Singular: 'timeunit.day.single',
      Plural: 'timeunit.day.plural'
    },
    Hour: {
      Singular: 'timeunit.hour.single',
      Plural: 'timeunit.hour.plural'
    },
    Minute: {
      Singular: 'timeunit.minute.single',
      Plural: 'timeunit.minute.plural'
    },
    Second: {
      Singular: 'timeunit.second.single',
      Plural: 'timeunit.second.plural'
    },
    Separator: ':'
  };

  const narratorFriendlyTime = `$${timeUnits.Hour.singular-timeUnits.Minute.singular}`
  //getNarratorFriendlyTime(time, timeUnits);

  return narratorFriendlyTime;
};

export const xsBreakpoint = 200;
export const timestampWidthBreakpoint = 427;
export const volSliderHeightBreakpoint = 204;
export const mtcHeightWithPadding = 68;
export const bulletPointIcon = '\u2022';

export type SettingsActionName =
  | 'ChangeCaptionColor'
  | 'ChangeCaptionBackground'
  | 'ChangeCaptionSize'
  | 'ChangePlaybackQuality'
  | 'ChangePlaybackSpeed';

export const loadSessionLastUsedPlaybackSpeed = (playbackSpeedEnabled: boolean) => {
  if (!playbackSpeedEnabled) {
    return null;
  }

//   if (isSessionStorageSupported()) {
//     return sessionStorage.getItem('OnePlayer.mtcOptions/playbackSpeed');
//   }

  return null;
};

export const isHighContrastActivated = () => {
  return window.matchMedia('(forced-colors: active)').matches;
};
