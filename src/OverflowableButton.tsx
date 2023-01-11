// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  Button,
  mergeClasses,
  OnVisibleChangeData,
  Tooltip,
} from "@fluentui/react-components";
import React from "react";
// import { isSettingTrue } from '../../../common';
import { mtcComponentsStyles } from "./mtcComponents.classNames";
// import { usePlaybackExperienceContext } from '../MtcContextProvider';
import { playbackExperienceStyles } from "./PlaybackExperience.classNames";

export interface IOverflowableButtonProps {
  tooltipMountNode: HTMLDivElement;
  inOverflowMenu: boolean;
  ariaLabel: string | undefined;
  ariaDescription: string | undefined;
  icon: JSX.Element;
  onClick: () => void;
  buttonCaptionWhenInOverflowMenu: string | undefined;
  tooltipText: string | undefined;
  ariaRole: "menuitemcheckbox" | "menuitem";
  ariaChecked?: boolean;
  additionalClassNames?: string;
  disabled?: boolean;
  handleTooltipHover?: (
    _:
      | React.FocusEvent<HTMLElement>
      | React.PointerEvent<HTMLElement>
      | undefined,
    data: OnVisibleChangeData
  ) => void;
}

export const OverflowableButton: React.FunctionComponent<
  IOverflowableButtonProps
> = (props: IOverflowableButtonProps) => {
  // const { settingsStore, rtl, playerContainer, useBooleanSetting } =
  // usePlaybackExperienceContext();

  const mtcStyles = mtcComponentsStyles();
  const peStyles = playbackExperienceStyles();
  const isOverflowableButtonRtlFixEnabled = React.useMemo(
    () => false,
    //   isSettingTrue(
    //     settingsStore.getSettingObject(
    //       "isOverflowableButtonRtlFixEnabled",
    //       "boolean"
    //     )
    //   ),
    []
  );
  const isHighContrastChangesEnabled = false; // useBooleanSetting(
  //     "isHighContrastChangesEnabled"
  //   );

  const buttonStyle = props.disabled && mtcStyles.disabledButtonStyle;

  const buttonClassNames = mergeClasses(
    buttonStyle,
    props.inOverflowMenu && peStyles.buttonInOverflow,
    props.additionalClassNames
  );

  //   React.useEffect(() => {
  //     if (isOverflowableButtonRtlFixEnabled) {
  //         playerContainer.style.setProperty(
  //           "--fui-Button__icon--spacing",
  //           "var(--spacingHorizontalSNudge)"
  //         );
  //     }
  //   }, [rtl, isOverflowableButtonRtlFixEnabled, playerContainer]);

  const button = (
    <Button
      role={props.ariaRole}
      aria-label={props.ariaLabel}
      aria-description={props.ariaDescription}
      aria-checked={
        props.ariaRole === "menuitemcheckbox" ? props.ariaChecked : undefined
      }
      className={buttonClassNames}
      appearance="transparent"
      icon={props.icon}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.inOverflowMenu ? props.buttonCaptionWhenInOverflowMenu : null}
    </Button>
  );

  if (props.inOverflowMenu) {
    return button;
  } else {
    return (
      <Tooltip
        withArrow
        content={{ className: mtcStyles.tooltip, children: props.tooltipText }}
        relationship="inaccessible"
        mountNode={props.tooltipMountNode}
        onVisibleChange={props.handleTooltipHover}
      >
        {button}
      </Tooltip>
    );
  }
};
