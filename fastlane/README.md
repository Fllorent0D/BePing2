fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### bump_patch

```sh
[bundle exec] fastlane bump_patch
```

test lane

----


## iOS

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Fetch certificates and provisioning profiles

### ios build

```sh
[bundle exec] fastlane ios build
```

Build the iOS application.

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Ship to Testflight.

### ios patch

```sh
[bundle exec] fastlane ios patch
```

Patch version number.

----


## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build the Android application.

### android beta

```sh
[bundle exec] fastlane android beta
```

Ship to Playstore Alpha track.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
