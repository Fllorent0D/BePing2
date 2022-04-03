fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### build_ionic_prod
```
fastlane build_ionic_prod
```
build ionic app

----

## iOS
### ios certificates
```
fastlane ios certificates
```
Fetch certificates and provisioning profiles
### ios align_versioning_and_bump
```
fastlane ios align_versioning_and_bump
```
Align versioning
### ios build_ios
```
fastlane ios build_ios
```
Build the iOS application.
### ios beta
```
fastlane ios beta
```
Ship to Testflight.

----

## Android
### android build
```
fastlane android build
```
Build the Android application.
### android align_versioning_and_bump
```
fastlane android align_versioning_and_bump
```
Align versioning
### android build_android
```
fastlane android build_android
```
Build android app
### android alpha
```
fastlane android alpha
```
Ship to Playstore Alpha track.
### android beta
```
fastlane android beta
```
Ship to Playstore beta track.
### android internal
```
fastlane android internal
```
Ship to Playstore Internal track.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
