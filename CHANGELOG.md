# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.1.3](https://github.com/rmartone/missionlog/compare/v3.1.3...v3.1.4) (2025-05-13)
* added updated dev dependencies and README.md

### [3.1.2](https://github.com/rmartone/missionlog/compare/v3.1.1...v3.1.3) (2025-05-07)
* added isDebugEnabled, isTraceEnabled and isLevelEnabled methods to the log object

### [3.0.2](https://github.com/rmartone/missionlog/compare/v3.0.1...v3.0.2) (2025-03-02)
* Updated README sample code

### [3.0.1](https://github.com/rmartone/missionlog/compare/v2.0.3...v3.0.1) (2025-03-02)

# MissionLog v3.0.1 Release Notes

## Breaking Change
* Unregistered Tags Are No Longer Automatically Added to the System
* Previously, using an unregistered tag would implicitly add it to the tag registry.
* New Behavior: Logs using unregistered tags will now default to the global logging level (DEFAULT_TAG) instead of being automatically registered. This change allows for tagless logging, similar to console.log.
* Migration: If you rely on dynamic tag creation, ensure you explicitly register your tags before logging.

## 🚀 New Features & Enhancements
* Console-Compatible Output
* Improved logging format to be more compatible with standard console.log() behavior.

### Optional Tagging System
* Logging now works without requiring tags, allowing a simpler logging approach when desired.

### 🛠 Internal Improvements
* Refactored Default Logging Behavior
* Replaced hardcoded '*' wildcard with DEFAULT_TAG, improving maintainability and clarity in log filtering.

### Updated Test Suite
Ensured consistency by replacing hardcoded wildcard values with DEFAULT_TAG.

## [3.0.0](https://github.com/rmartone/missionlog/compare/v2.0.3...v2.1.0) (2025-03-02)
  * See 3.0.1

### [2.0.3](https://github.com/rmartone/missionlog/compare/v2.0.2...v2.0.3) (2025-03-01)
  * Updated README.md and keywords

### [2.0.2](https://github.com/rmartone/missionlog/compare/v2.0.1...v2.0.2) (2025-03-01)
  * Fixed path to types.

### [2.0.1](https://github.com/rmartone/missionlog/compare/v2.0.0...v2.0.1) (2025-03-01)
  * Fixed path to types.

### [2.0.0](https://github.com/rmartone/missionlog/compare/v1.8.9...v2.0.0) (2025-03-01)

* We've significantly improved MissionLog by adding support for both ES Modules (ESM) and CommonJS (CJS), whereas previously it only supported CJS. This makes MissionLog more versatile and compatible with modern JavaScript environments, including frontend applications and tools that prefer native ESM. Additionally, we've optimized the logging system by removing unnecessary error handling around user-defined callbacks, ensuring errors are surfaced in the caller's code rather than being caught internally. We've also enhanced the efficiency of our tag management by improving proxy handling and ensuring that log level assignments default correctly when invalid configurations are provided. These refinements make MissionLog more lightweight, flexible, and robust while maintaining its ease of use.

### [1.8.9](https://github.com/rmartone/missionlog/compare/v1.8.6...v1.8.9) (2025-01-13)
  ## updating dependencies

### [1.8.8](https://github.com/rmartone/missionlog/compare/v1.8.6...v1.8.8) (2023-07-02)
  ## updating dependencies

### [1.8.6](https://github.com/rmartone/missionlog/compare/v1.8.4...v1.8.6) (2023-05-20)
  ## updating dependencies

### [1.8.4](https://github.com/rmartone/missionlog/compare/v1.8.3...v1.8.4) (2022-12-01)

  ## updating dependencies

### [1.8.3](https://github.com/rmartone/missionlog/compare/v1.8.2...v1.8.3) (2022-02-28)

### [1.8.2](https://github.com/rmartone/missionlog/compare/v1.8.1...v1.8.2) (2022-02-28)

  ## updating README.md

### [1.8.1](https://github.com/rmartone/missionlog/compare/v1.7.8...v1.8.1) (2022-02-26)

## Supprot for DEBUG & TRACE and modified babel settings to avoid using arguments

### [1.7.8](https://github.com/rmartone/missionlog/compare/v1.7.7...v1.7.8) (2022-02-26)

## dependencies and README initialization example

### [1.7.7](https://github.com/rmartone/missionlog/compare/v1.7.6...v1.7.7) (2022-02-25)

## more exports to simplify usage

### [1.7.6](https://github.com/rmartone/missionlog/compare/v1.7.5...v1.7.6) (2022-02-21)

## [1.7.5](https://github.com/rmartone/missionlog/compare/v1.7.4...v1.7.5) (2022-02-19)

### loosening restrictive definition

## [1.7.4](https://github.com/rmartone/missionlog/compare/v1.7.1...v1.7.4) (2022-02-19)

### swapped predicates for perf and updated deps and browserlist db

## [1.7.1](https://github.com/rmartone/missionlog/compare/v1.6.10...v1.7.1) (2022-01-10)

### * updating dependencies and dev dependencies
### * LogLevel no longer const enum

## [1.6.10](https://github.com/rmartone/missionlog/compare/v1.6.9...v1.6.10) (2021-12-31)

### * updating dependencies

## [1.6.9](https://github.com/rmartone/missionlog/compare/v1.6.8...v1.6.9) (2021-08-15)

### * updating dependencies

## [1.6.7](https://github.com/rmartone/missionlog/compare/v1.6.6...v1.6.7) (2021-05-09)

### * updating dependencies

## [1.6.6](https://github.com/rmartone/missionlog/compare/v1.6.5...v1.6.6) (2020-12-16)

### * updating dependencies

## [1.6.5](https://github.com/rmartone/missionlog/compare/v1.6.2...v1.6.5) (2020-07-29)

## [1.6.2](https://github.com/rmartone/missionlog/compare/v1.6.0...v1.6.2) (2020-07-01)

## [1.6.0](https://github.com/rmartone/missionlog/compare/v1.5.12...v1.6.0) (2020-02-26)

## [1.5.12](https://github.com/rmartone/missionlog/compare/v1.5.10...v1.5.12) (2019-12-15)

## [1.5.10](https://github.com/rmartone/missionlog/compare/v1.5.9...v1.5.10) (2019-12-14)

## [1.5.7](https://github.com/rmartone/missionlog/compare/v1.5.6...v1.5.7) (2019-12-14)

### * updating dependencies

## [1.5.6](https://github.com/rmartone/missionlog/compare/v1.5.5...v1.5.6) (2019-09-20)

### * updating README to better clarify recent changes

## [1.5.5](https://github.com/rmartone/missionlog/compare/v1.5.4...v1.5.5) (2019-09-20)

### * typedefs tweaked squared away and clearer README examples

## [1.5.4](https://github.com/rmartone/missionlog/compare/v1.5.3...v1.5.4) (2019-09-20)

### * exported LogLevel as a const enum so it can be used as type and value

## [1.5.2](https://github.com/rmartone/missionlog/compare/v1.5.1...v1.5.2) (2019-09-20)

### * exported LogLevel to make implementing a handler cleaner

## [1.5.1](https://github.com/rmartone/missionlog/compare/v1.5.0...v1.5.1) (2019-09-20)

### * modified travis.yml to use npm

## [1.5.0](https://github.com/rmartone/missionlog/compare/v1.4.1...v1.5.0) (2019-09-20)

### * support for a tag dictionary export and cleaned up build

## [1.4.0](https://github.com/rmartone/missionlog/compare/v1.3.5...v1.4.0) (2019-09-05)

### * bumping minor version to reflect earlier changes to .d.ts

## [1.3.4](https://github.com/rmartone/missionlog/compare/v1.3.3...v1.3.4) (2019-09-04)

### * updating dev dependencies

## [1.3.3](https://github.com/rmartone/missionlog/compare/v1.3.2...v1.3.3) (2019-08-30)

* relaxing type checking on init's config param to allow JSON

## [1.3.2](https://github.com/rmartone/missionlog/compare/v1.3.1...v1.3.2) (2019-08-30)

* Updated devDependencies

## [1.3.1](https://github.com/rmartone/missionlog/compare/v1.3.0...v1.3.1) (2019-08-30)

* Updated devDependencies

## [1.3.0](https://github.com/rmartone/missionlog/compare/v1.2.1...v1.3.0) (2019-08-22)

### Features
* exported Log class
* transitioned Log from object literal to class

## [1.2.1](https://github.com/rmartone/missionlog/compare/v1.2.0...v1.2.1) (2019-08-19)

* Fixed typo in readme.md

## [1.2.0](https://github.com/rmartone/missionlog/compare/v1.1.60...v1.2.0) (2019-08-03)

### Features
[['5011ed8fd6c918437e3310ddb678c3bc8495675e'](https://github.com/rmartone/missionlog/commit/5011ed8fd6c918437e3310ddb678c3bc8495675e)]
* added two more tests so coverage is back at 100%

## [1.1.60](https://github.com/rmartone/missionlog/compare/v1.1.57...v1.1.60) (2019-08-03)

### Features
[['d5cd438f9f5f93364ade51e765eea2bb6e1fa8ad'](https://github.com/rmartone/missionlog/commit/d5cd438f9f5f93364ade51e765eea2bb6e1fa8ad)]
* small improvement to level check for most common use case

## [1.1.57](https://github.com/rmartone/missionlog/compare/v1.1.56...v1.1.57) (2019-08-01)

### Features
[['5b181fc0a8e127aa2f48279e8abe4c70ba9a4e72'](https://github.com/rmartone/missionlog/commit/5b181fc0a8e127aa2f48279e8abe4c70ba9a4e72)]
* streamlined README.md

## [1.1.56](https://github.com/rmartone/missionlog/compare/v1.1.55...v1.1.56) (2019-08-01)

### Features
[['c88b11b90ac14ef8031ef123b0b56c50bc9239a1'](https://github.com/rmartone/missionlog/commit/c88b11b90ac14ef8031ef123b0b56c50bc9239a1)] * removing contributing, organzing package.json, non-compact babel output

## [1.1.55](https://github.com/rmartone/missionlog/compare/v1.1.54...v1.1.55) (2019-07-31)

### Features
[['b10c864c25276d132b460d527e2689c06fa248e3'](https://github.com/rmartone/missionlog/commit/b10c864c25276d132b460d527e2689c06fa248e3)] * switched back to yarn but added yarn to dev dependencies

## [1.1.54](https://github.com/rmartone/missionlog/compare/v1.1.53...v1.1.54) (2019-07-31)

### Features
* switched from yarn to npm since the later is more widely used

## [1.1.52](https://github.com/rmartone/missionlog/compare/v1.1.51...v1.1.52) (2019-07-30)

### Features
* added .editorconfig

## [1.1.51](https://github.com/rmartone/missionlog/compare/v1.1.49...v1.1.51) (2019-07-30)

### Features
* added CONTRIBUTING.md

## [1.1.49](https://github.com/rmartone/missionlog/compare/v1.1.48...v1.1.49) (2019-07-30)

### Features
* tweaked package.json description

## [1.1.48](https://github.com/rmartone/missionlog/compare/v1.1.47...v1.1.48) (2019-07-30)

### Features
* updated dependencies
* tweaked package.json description

## [1.1.47](https://github.com/rmartone/missionlog/compare/v1.1.46...v1.1.47) (2019-07-29)

### Features
* added more detail to package.json
* minor tweaks to readme
* updated dependencies

## [1.1.46](https://github.com/rmartone/missionlog/compare/v1.1.45...v1.1.46) (2019-07-29)

### Features
* updated README.md & package.json

## [1.1.45](https://github.com/rmartone/missionlog/compare/v1.1.44...v1.1.45) (2019-07-29)

### Features
* more minor changes to README.md
