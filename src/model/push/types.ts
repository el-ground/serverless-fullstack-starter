// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Re-engageable_Notifications_Push
export type PushNotificationPermissionState =
  // common
  | `granted`
  | `denied`
  // pwa
  | `default`
  // app
  | `prompt`
  | `prompt-with-rationale`

/*
      default : display consent right away
      prompt : display consent right away
      prompt-with-rationale : place a request button; requestPermission
      granted : display granted!
      denied : display go to settings; openNotificationSettings 
  */
