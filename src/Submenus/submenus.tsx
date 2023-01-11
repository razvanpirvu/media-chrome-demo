// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { MenuOpenChangeData, MenuOpenEvents } from "@fluentui/react-components";
import { ActionType } from "@msstream/components-base-telemetry-typings";
import React from "react";
import { CaptionColorSubmenu } from "./CaptionColorSubmenu";
import { CaptionSettingsSubmenu } from "./CaptionSettingsSubmenu";
import { CaptionSizeSubmenu } from "./CaptionSizeSubmenu";
import { CaptionTrackSubmenu } from "./CaptionTrackSubmenu";
import { OverflowSubmenu } from "./OverflowSubmenu";
import { PlaybackSpeedSubmenu } from "./PlaybackSpeedSubmenu";
import { QualitySubmenu } from "./QualitySubmenu";
import { SettingsRootSubmenu } from "./SettingsRootSubmenu";

export type SubmenuName = keyof AllSubmenuDefinitions;

export interface ISubmenuProps {
  navigateBack: (actionType: ActionType) => void;
  navigateTo: (newSubmenu: SubmenuName, actionType: ActionType) => void;
  menuItemsToAddToTopOfSubmenu: JSX.Element[];
  updateMenuOpenState?: (open: boolean, actionType: ActionType) => void; // The updateMenuOpenState from SubMenuButton is passed to allow  popover submenus to close on change
  focusSubmenuButton?: () => void; // Allows the submenu to focus the button that opened it
}

interface ISubmenuDefinition {
  subMenuTitleStringName: string;
  backButtonAriaDescriptionStringName: string;
  renderSubmenu: (props: ISubmenuProps) => JSX.Element;
  openUserActionName: string;
  closeUserActionName: string;
}

type AllSubmenuDefinitions = {
  settingsRoot: ISubmenuDefinition;
  captionSettings: ISubmenuDefinition;
  captionSize: ISubmenuDefinition;
  captionColor: ISubmenuDefinition;
  captionTrack: ISubmenuDefinition;
  qualitySettings: ISubmenuDefinition;
  playbackSpeed: ISubmenuDefinition;
  overflowMenu: ISubmenuDefinition;
};

export const submenuDefinitions: AllSubmenuDefinitions = {
  settingsRoot: {
    subMenuTitleStringName: "PlaybackSettingsSubmenuTitle",
    backButtonAriaDescriptionStringName:
      "PlaybackSettingsSubmenuBackAriaDescription",
    renderSubmenu: (props: ISubmenuProps) => <SettingsRootSubmenu {...props} />,
    openUserActionName: "OpenSettingsMenu",
    closeUserActionName: "CloseSettingsMenu",
  },
  captionSettings: {
    subMenuTitleStringName: "PlaybackSettings.CaptionSettings",
    backButtonAriaDescriptionStringName:
      "PlaybackSettings.BackToHomeAriaDescription",
    renderSubmenu: (props: ISubmenuProps) => (
      <CaptionSettingsSubmenu {...props} />
    ),
    openUserActionName: "OpenCaptionSettingsMenu",
    closeUserActionName: "CloseCaptionSettingsMenu",
  },
  captionSize: {
    subMenuTitleStringName: "PlaybackSettings.CaptionSettings.Size",
    backButtonAriaDescriptionStringName:
      "PlaybackSettings.BackToCaptionSettingsAriaDescription",
    renderSubmenu: (props: ISubmenuProps) => <CaptionSizeSubmenu {...props} />,
    openUserActionName: "OpenCaptionSizeMenu",
    closeUserActionName: "CloseCaptionSizeMenu",
  },
  captionColor: {
    subMenuTitleStringName: "PlaybackSettings.CaptionSettings.Color",
    backButtonAriaDescriptionStringName:
      "PlaybackSettings.BackToCaptionSettingsAriaDescription",
    renderSubmenu: (props: ISubmenuProps) => <CaptionColorSubmenu {...props} />,
    openUserActionName: "OpenCaptionColorMenu",
    closeUserActionName: "CloseCaptionColorMenu",
  },
  captionTrack: {
    subMenuTitleStringName: "CaptionSubmenuTitle",
    backButtonAriaDescriptionStringName: "CaptionMenuBackAriaDescription",
    renderSubmenu: (props: ISubmenuProps) => <CaptionTrackSubmenu {...props} />,
    openUserActionName: "OpenCaptionsMenu",
    closeUserActionName: "CloseCaptionsMenu",
  },
  qualitySettings: {
    subMenuTitleStringName: "PlaybackSettings.Quality",
    backButtonAriaDescriptionStringName:
      "PlaybackSettings.BackToHomeAriaDescription",
    renderSubmenu: (props: ISubmenuProps) => <QualitySubmenu {...props} />,
    openUserActionName: "OpenPlaybackQualityMenu",
    closeUserActionName: "ClosePlaybackQualityMenu",
  },
  playbackSpeed: {
    subMenuTitleStringName: "PlaybackSpeedSubmenuTitle",
    backButtonAriaDescriptionStringName: "PlaybackSpeedBackAriaDescription",
    renderSubmenu: (props: ISubmenuProps) => (
      <PlaybackSpeedSubmenu {...props} />
    ),
    openUserActionName: "OpenPlaybackSpeedMenu",
    closeUserActionName: "ClosePlaybackSpeedMenu",
  },
  overflowMenu: {
    subMenuTitleStringName: "",
    backButtonAriaDescriptionStringName: "",
    renderSubmenu: (props: ISubmenuProps) => <OverflowSubmenu {...props} />,
    openUserActionName: "OpenPlaybackExperienceOverflowMenu",
    closeUserActionName: "ClosePlaybackExperienceOverflowMenu",
  },
};

export function renderSubmenu(
  name: SubmenuName,
  props: ISubmenuProps
): JSX.Element {
  return submenuDefinitions[name].renderSubmenu(props);
}

export function getBackButtonAriaDescriptionStringName(
  name: SubmenuName
): string {
  return submenuDefinitions[name].backButtonAriaDescriptionStringName;
}

export function getSubMenuTitleStringName(name: SubmenuName): string {
  return submenuDefinitions[name].subMenuTitleStringName;
}

export function getSubmenuOpenUserActionName(name: SubmenuName): string {
  return submenuDefinitions[name].openUserActionName;
}

export function getSubmenuCloseUserActionName(name: SubmenuName): string {
  return submenuDefinitions[name].closeUserActionName;
}
