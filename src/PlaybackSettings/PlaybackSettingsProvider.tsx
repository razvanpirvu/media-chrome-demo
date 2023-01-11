// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import React from "react";
import { isLocalStorageSupported } from "@msstream/shared-services";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { loadSessionLastUsedPlaybackSpeed } from "../shared.utils";
import { SettingsActionName } from "../shared.utils";
// import { useSettingsToApplyToPlayer } from '../useSettingsToApplyToPlayer';
export type MenuSettings = {
  captionTrackLabel: string;
  captionsSize: string;
  captionsColor: string;
  captionsBackgroundTransparency: boolean;
  quality: string;
  playbackSpeed?: string;
};

type MenuContextData = {
  settings: MenuSettings;
  updateSettings(newSettings: MenuSettings): void;
  revertToDefaultCaptionSettings(): void;
  updateCaptionTrackLabel(newCaptionTrackLabel: string): void;
  logChangeSettingsAction(
    actionName: SettingsActionName,
    oldValue: string,
    newValue: string
  ): void;
};

interface IMenuProviderProps {
  initialSettings?: MenuSettings;
}

const defaultSettings: MenuSettings = {
  captionTrackLabel: "off",
  captionsSize: "small",
  captionsColor: "standard",
  captionsBackgroundTransparency: false,
  quality: "-1",
};

const MenuContext = React.createContext({} as MenuContextData);

export const MenuProvider: React.FC<IMenuProviderProps> = ({
  children,
  initialSettings = defaultSettings,
}: React.PropsWithChildren<IMenuProviderProps>) => {
  const {
    log,
    player,
    playerContainer,
    settingsStore,
    isNextGenEngineEnabled,
    showPlaybackSpeed,
    useBooleanSetting,
  } = usePlaybackExperienceContext();

  const loadMenuSettings = () => {
    if (isLocalStorageSupported()) {
      return localStorage.getItem("OnePlayer.mtcOptions");
    }

    return null;
  };

  const persistMenuSettings = (newMenuSettings: string) => {
    if (isLocalStorageSupported()) {
      localStorage.setItem("OnePlayer.mtcOptions", newMenuSettings);
    }
  };

  const [settings, setSettings] = React.useState(() => {
    const persistedMenuSettings = loadMenuSettings();
    const persistedPlaybackSpeed =
      loadSessionLastUsedPlaybackSpeed(showPlaybackSpeed);

    if (persistedMenuSettings) {
      const parsedPersistedMenuSettings = JSON.parse(
        persistedMenuSettings
      ) as MenuSettings;

      if (persistedPlaybackSpeed) {
        parsedPersistedMenuSettings.playbackSpeed = persistedPlaybackSpeed;
      }

      return parsedPersistedMenuSettings;
    }

    return initialSettings;
  });

  //   useSettingsToApplyToPlayer(
  //     playerContainer,
  //     settings,
  //     setSettings,
  //     player,
  //     settingsStore,
  //     isNextGenEngineEnabled
  //   );

  React.useEffect(() => {
    const settingsToPersist: Partial<MenuSettings> = { ...settings };
    if (settingsToPersist.playbackSpeed) {
      delete settingsToPersist.playbackSpeed;
    }

    if (useBooleanSetting("isRemoveQualitySettingFromLocalStorageEnabled")) {
      if (settingsToPersist.quality) {
        settingsToPersist.quality = "-1";
      }
    }

    persistMenuSettings(JSON.stringify(settingsToPersist));
  }, [settings]);

  const updateSettings = (newSettings: MenuSettings): void => {
    setSettings((current: MenuSettings) => {
      const currentSettings = current;
      return { ...currentSettings, ...newSettings };
    });
  };

  const updateCaptionTrackLabel = (newCaptionTrackLabel: string): void => {
    setSettings((current: MenuSettings) => {
      const currentSettings = current;
      return { ...currentSettings, captionTrackLabel: newCaptionTrackLabel };
    });
  };

  const revertToDefaultCaptionSettings = (): void => {
    setSettings((current: MenuSettings) => {
      return {
        ...current,
        captionsSize: initialSettings.captionsSize,
        captionsColor: initialSettings.captionsColor,
        captionsBackgroundTransparency:
          initialSettings.captionsBackgroundTransparency,
      };
    });
  };

  const logChangeSettingsAction = (
    actionName: SettingsActionName,
    oldValue: string,
    newValue: string
  ): void => {
    log.userAction("PlayerChangeSettingAction", {
      actionType: "LeftClick",
      name: actionName,
      oldSetting: oldValue,
      newSetting: newValue,
      playbackTimeSec: player.currentTimeInSeconds.value || -1,
    });
  };

  return (
    <MenuContext.Provider
      value={{
        settings,
        updateSettings,
        revertToDefaultCaptionSettings,
        updateCaptionTrackLabel,
        logChangeSettingsAction,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export function useMenuSettings(): MenuContextData {
  const context = React.useContext(MenuContext);

  if (!context) {
    throw new Error("useMenuSettings must be used within the MenuProvider");
  }

  return context;
}
