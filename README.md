# Engines Resource Manager

Use ERM to create and manage an orderly file structure.

## Build client

***In development, before pushing production code***
`rake client:build` to create concatenated and minified client files. Output goes to `public/client.js` and `public/client.min.js`.


## Configure

The app expects a configuration repo to be cloned as persistent `data` directory.

The repo should contain two subdirectories.
- A `config` directory containing a file `erm.yaml`.
- A `public` directory containing files for icons, logo, webmanifest, etc.


## Actions

None.


## Services

### Volumes

1. Persistent directory `data` for configuration repo.

2. Share multiple volumes, as required by `config/erm.yaml`.

### Mounts

The shared volumes need to be mounted inside the /volume directory of the app.

e.g. A volume that is to appear in ERM as 'clients' needs to be at /volumes/clients

ERM needs write permissions on this.

### OAuth - FUTURE FUNCTIONALITY: NOT CURRENTLY BEING USED

Callback URL: `/oauth2_callback`

URL, client ID and secret set in environment.

## Deploy

### Environment

#### ENV['ERM_USER_TOKEN'] REQUIRED

ERM needs Engines to provide it with a token for user auth, in environment variable ENV['ERM_USER_TOKEN']

Not set by user: Generate and View the token with actionators.

#### ENV['ERM_USER_INACTIVITY_TIMEOUT'] OPTIONAL

User auth times-out after 30 minutes.

To change this, set ENV['ERM_USER_INACTIVITY_TIMEOUT'] to the number of minutes for timeout.




4. Deprecated ENV

ENV['ERM_FS_DIR'] is not longer being used by ERM.

#### ENV['ERM_TEMPLATE_PARAMS_YAML']

Input text. ( should really be code, but text will have to do for now, until new form DSL comes through )

Mutable. Ask at build time. Not mandatory. Not build time only

#### ENV['ERM_FS_DIR'] DEPRECATED
#### ENV['ERM_OAUTH_URL'] - FUTURE FUNCTIONALITY: NOT CURRENTLY BEING USED
#### ENV['ERM_OAUTH_CLIENT_ID'] - FUTURE FUNCTIONALITY: NOT CURRENTLY BEING USED
#### ENV['ERM_OAUTH_SECRET'] - FUTURE FUNCTIONALITY: NOT CURRENTLY BEING USED

### Assets

Static assets served from `public`.

### Run

Sinatra modular style, with `config.ru`.

Has Gemfile. Requires `bundle`.
