# snips-action-localtime

Snips action code for the Local time app

## Setup

```sh
# Install the dependencies, builds the action and creates the config.ini file.
sh setup.sh
```

Don't forget to edit the `config.ini` file.

An assistant containing the intents listed below must be installed on your system. Deploy it following [these instructions](https://docs.snips.ai/articles/console/actions/deploy-your-assistant).

## Run

- Dev mode:

```sh
# Dev mode watches for file changes and restarts the action.
npm run dev
```

- Prod mode:

```sh
# 1) Lint, transpile and test.
npm start
# 2) Run the action.
node action-localtime.js
```

## Test & Demo cases

This app only supports french 🇫🇷 and english 🇬🇧.

### `GetLocalTime`

#### Get the current local time at a given location

Get the local time at the given location
> *Hey Snips, what time it is in Madrid?*

### `GetTimezone`

#### Get the timezone of a given location

Get the weather forecast at a given location
> *Hey Snips, I need to know the timezone of Kentucky*

### `GetDate`

#### Get the current date

Get the current date
> *Hey Snips, what's the date today?*

### `CheckTime`

#### Ask whether the time in a given place is what the user believes it is

Get a confirmation of a time in the given location
> *Hey Snips, is it 9pm in Paris?*

### `GetTimeDifference`

#### Get the time difference two locations

Get the time difference between the two given locations
> *Hey Snips, do Paris and Berlin have a time difference?*

### `ConvertTime`

#### Get the time at a given location when it's a given time at a specified location

Get the date it is in a given location according to the time in another given location
> *Hey Snips, what time it is in New York when it's 7pm in Paris?*

## Debug

In the `action-localtime.js` file:

```js
// Uncomment this line to print everything
// debug.enable(name + ':*')
```

## Test

*Requires [mosquitto](https://mosquitto.org/download/) to be installed.*

```sh
npm run test
```

**In test mode, i18n output and http calls are mocked.**

- **http**: see `tests/httpMocks/index.ts`
- **i18n**: see `src/factories/i18nFactory.ts`
