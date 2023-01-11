// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  MenuCheckedValueChangeData,
  MenuCheckedValueChangeEvent,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuList,
  MenuProps,
  mergeClasses,
} from "@fluentui/react-components";
import React from "react";

import type { BitrateQuality } from "@msstream/components-oneplayer-typings";
import {
  createScreenReaderAlert,
  formatString,
} from "@msstream/shared-services";
import { submenuStyles } from "./Submenu.classNames";
import { getInitialQualityLabelFromList } from "../PlaybackSettings/PlaybackSettings.utils";
import { useMenuSettings } from "../PlaybackSettings/PlaybackSettingsProvider";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { ISubmenuProps } from "./submenus";
//   import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';

export const QualitySubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const styles = submenuStyles();
  const autoFocusTarget = React.useRef<null | HTMLDivElement>(null);
  const { updateSettings, settings, logChangeSettingsAction } =
    useMenuSettings();
  const { loc, rtl, player, useBooleanSetting } =
    usePlaybackExperienceContext();
  const isAutoQualityLabelLocalizedEnabled = useBooleanSetting(
    "isAutoQualityLabelLocalizedEnabled"
  );
  const isFluentMenuItemRadioFixEnabled = useBooleanSetting(
    "isFluentMenuItemRadioFixEnabled"
  );

  const [checkedValues, setCheckedValues] = React.useState<
    Record<string, string[]>
  >({
    quality:
      settings.quality === "-1"
        ? [
            getInitialQualityLabelFromList(
              player.availableBitrateQualities.value,
              isAutoQualityLabelLocalizedEnabled
                ? loc.getString("PlaybackSettings.AutoQualityLabel")
                : "Auto"
            ),
          ]
        : [settings.quality],
  });

  const isHighContrastChangesEnabled = useBooleanSetting(
    "isHighContrastChangesEnabled"
  );

  const settingMenuItemStyle = isHighContrastChangesEnabled
    ? mergeClasses(
        styles.settingMenuItem,
        styles.settingMenuItemHighContrastFix
      )
    : styles.settingMenuItem;

  const getDisplayListOfQualityRates = React.useCallback(
    (listOfBitrates: BitrateQuality[]): BitrateQuality[] => {
      if (listOfBitrates.length > 1) {
        // Assumes the incoming listOfBitrates is ordered like this [Auto, lowestQuality, ...., highestQuality] like in AMP
        // Re-orders the bitrates to match design. [Auto, highestQuality...lowestQuality]
        const qualityOptions = [...listOfBitrates];
        const autoQualityOption = qualityOptions.shift() as BitrateQuality;
        if (isAutoQualityLabelLocalizedEnabled) {
          autoQualityOption.label = loc.getString(
            "PlaybackSettings.AutoQualityLabel"
          );
        }
        const listOfQualityOptions = [
          autoQualityOption,
          ...qualityOptions.reverse(),
        ];
        return listOfQualityOptions;
      }
      // otherwise return list n=1
      return listOfBitrates;
    },
    [loc]
  );

  const [playbackRates, setPlaybackRates] = React.useState<BitrateQuality[]>(
    getDisplayListOfQualityRates(player.availableBitrateQualities.value)
  );

  // get available bitrate Qualities to display
  React.useEffect(() => {
    const unsubscribe = player.availableBitrateQualities.subscribe(
      (listOfBitrates: BitrateQuality[]) => {
        const displayList = getDisplayListOfQualityRates(listOfBitrates);
        setPlaybackRates(displayList);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [player.availableBitrateQualities.value, getDisplayListOfQualityRates]);

  const onChange: MenuProps["onCheckedValueChange"] = (
    _: MenuCheckedValueChangeEvent,
    { name, checkedItems }: MenuCheckedValueChangeData
  ) => {
    const newCheckedItem = checkedItems[checkedItems.length - 1];
    if (newCheckedItem) {
      logChangeSettingsAction(
        "ChangePlaybackQuality",
        checkedItems[0],
        newCheckedItem
      );
      const newBitrateQuality = player.availableBitrateQualities.value.find(
        (quality: BitrateQuality) => quality.label === newCheckedItem
      );
      if (newBitrateQuality) {
        player.downloadBitrate.value = newBitrateQuality.bitrate;
      }
      updateSettings({ ...settings, quality: newCheckedItem });
      setCheckedValues(() => ({ [name]: [newCheckedItem] }));
      const screenReaderString = formatString(
        loc.getString("FluentQualityChangedStatusMessage"),
        newCheckedItem
      );
      createScreenReaderAlert(screenReaderString, true);
    }
  };

  // useAutoFocusOnFirstChildButton(autoFocusTarget);

  return (
    <MenuList
      className={styles.container}
      dir={rtl ? "rtl" : "ltr"}
      checkedValues={checkedValues}
      onCheckedValueChange={onChange}
      ref={autoFocusTarget}
    >
      {props.menuItemsToAddToTopOfSubmenu}
      {playbackRates.map((bitrateSetting: BitrateQuality) => {
        return isFluentMenuItemRadioFixEnabled ? (
          <MenuItemRadio
            className={styles.settingMenuItem}
            name="quality"
            value={bitrateSetting.label}
            key={bitrateSetting.label}
          >
            {bitrateSetting.label}
          </MenuItemRadio>
        ) : (
          <MenuItemCheckbox
            className={settingMenuItemStyle}
            name="quality"
            value={bitrateSetting.label}
            key={bitrateSetting.label}
          >
            {bitrateSetting.label}
          </MenuItemCheckbox>
        );
      })}
    </MenuList>
  );
};
