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
## iOS
### ios alpha
```
fastlane ios alpha
```
Push a new internal build to TestFlight
### ios beta
```
fastlane ios beta
```
Push a new external build to TestFlight

----

## Android
### android bump_version_code
```
fastlane android bump_version_code
```
Bumps Android versionCode
### android alpha
```
fastlane android alpha
```
Push a new internal build to Google Play

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
