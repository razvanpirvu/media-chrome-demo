// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import React from "react";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { playbackSpeedStyles } from "./PlaybackSpeed.classNames";

interface IPlaybackSpeedIconProps {
  includeTitle?: boolean;
}

export const PlaybackSpeedIcon: React.FunctionComponent<
  IPlaybackSpeedIconProps
> = (props: IPlaybackSpeedIconProps) => {
  const loadedPlaybackSpeedStyles = playbackSpeedStyles();
  const [playerPlaybackRate] = React.useState(1);
  //   const isOverflowableButtonRtlFixEnabled = React.useMemo(
  //     () => useBooleanSetting('isOverflowableButtonRtlFixEnabled'),
  //     []
  //   );

  return (
    <div className={loadedPlaybackSpeedStyles.container}>
      <div
        // tslint:disable-next-line: jsx-ban-props
        // style={isOverflowableButtonRtlFixEnabled && rtl ? { marginRight: '6px' } : {}}
        className={loadedPlaybackSpeedStyles.iconContainer}
      >
        <span>{playerPlaybackRate.toString()}x</span>
      </div>
      {props.includeTitle ? (
        <span className={loadedPlaybackSpeedStyles.labelText}>
          {"PlaybackSpeedButtonTitle"}
        </span>
      ) : null}
    </div>
  );
};
