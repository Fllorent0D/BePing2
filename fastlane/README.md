fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### build_ionic_prod

```sh
[bundle exec] fastlane build_ionic_prod
```

build ionic app

----


## iOS

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Fetch certificates and provisioning profiles

### ios align_versioning_and_bump

```sh
[bundle exec] fastlane ios align_versioning_and_bump
```

Align versioning

### ios build_ios

```sh
[bundle exec] fastlane ios build_ios
```

Build the iOS application.

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Ship to Testflight.

----


## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build the Android application.

### android align_versioning_and_bump

```sh
[bundle exec] fastlane android align_versioning_and_bump
```

Align versioning

### android build_android

```sh
[bundle exec] fastlane android build_android
```

Build android app

### android alpha

```sh
[bundle exec] fastlane android alpha
```

Ship to Playstore Alpha track.

### android beta

```sh
[bundle exec] fastlane android beta
```

Ship to Playstore Alpha track.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
