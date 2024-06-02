# mobile-apps-fcm-push

This is the code that powers the official mobile app push notifications. Feel free to submit PRs!

This repository was forked from home-assistant. The following adaptions had to be made to work with the custom app HAX-iOS:

- .firebaserc: change name to "hax-mobile-apps"
- firebase.json: change function name from "iOSV1" to "push"
- ios.js and legacy.js: change the app_id to HAX-iOS https://github.com/sevimuelli/HAX-iOS:
```
if (req.body.registration_info.app_id.indexOf('io.robbie.HomeAssistant') > -1) {
```
to
```
if (
      req.body.registration_info.app_id.indexOf('io.severinmueller.HAX.dev') >
        -1 ||
      req.body.registration_info.app_id.indexOf('io.severinmueller.HAX.beta') >
        -1 ||
      req.body.registration_info.app_id.indexOf('io.severinmueller.HAX') > -1
    ) {
```

Also, the following adaptions had to be made, this is mainly a note for myself:
- Add each app to firebase and add the APNs Authentication Key
- Create a realtime database, can not be changed or deleted
- Create a firestore database and change it to "Native mode", need to use the "(default)" because DB can not be changed
- In the app, in HAAPI.swift change:
```
"push_url": "https://mobile-apps.home-assistant.io/api/sendPushNotification",
```
to
```
"push_url": "https://us-central1-hax-mobile-apps.cloudfunctions.net/sendPushNotification",
```
- In the app, in NotificationRateLimitsAPI.swift change:
```
string: "https://mobile-apps.home-assistant.io/api/checkRateLimits"
```
to
```
string: "https://us-central1-hax-mobile-apps.cloudfunctions.net/checkRateLimits"
```
- In Home Assistant, use a DNS server to rewrite "ios-push.home-assistant.io" to "us-central1-hax-mobile-apps.cloudfunctions.net"
- Download "GoogleService-Info.plist" and replace it in the app


## Developer Setup

Install NPM dependencies:

```
cd functions
npm install
```

Startup function for local testing:

```
# Only Once
npm install -g firebase-tools

firebase functions:config:set debug.local=true
firebase functions:config:get > .runtimeconfig.json

# Whenever you want to start
npm run serve
```

# Deploy your own

Change the target project if needed:

```
# Only once
sed -i s/home-assistant-mobile-apps/myproject/g ../.firebaserc
```

You can set the `app.region` setting if you want to deploy your functions in a another location than `us-central1`, e.g. `europe-west1`:

```
# Only once
firebase functions:config:set app.region="us-central1"
```

Then deploy the Cloud Functions:

```
firebase deploy
```
