// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import type { BitrateQuality } from '@msstream/components-oneplayer-typings';

export const getInitialQualityLabelFromList = (
  listOfQualityBitrates: BitrateQuality[],
  labelForAutoQuality: string
) => {
  // if there is only 1 available bitrate, show that ones label. Otherwise show "Auto"
  if (listOfQualityBitrates.length > 1) {
    return labelForAutoQuality;
  } else if (listOfQualityBitrates.length === 1) {
    return listOfQualityBitrates[0].label;
  } else {
    return '';
  }
};
