// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// import { ActionType } from '@msstream/components-base-telemetry-typings';

export function actionTypeFromClick(eventType: string): any {
  return eventType === 'click' ? 'LeftClick' : 'KeyDown';
}
