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

### OAuth

Callback URL: `/oauth2_callback`

URL, client ID and secret set in environment.

## Deploy

### Environment

#### ENV['ERM_TEMPLATE_PARAMS_YAML']

Input text. ( should really be code, but text will have to do for now, until new form DSL comes through )

Mutable. Ask at build time. Not mandatory. Not build time only

#### ENV['ERM_FS_DIR']

Location for mounted volumes.

Defaults to:
- `/home/fs` in production
- `volumes` in development

#### ENV['ERM_OAUTH_URL']
#### ENV['ERM_OAUTH_CLIENT_ID']
#### ENV['ERM_OAUTH_SECRET']

### Assets

Static assets served from `public`.

### Run

Sinatra modular style, with `config.ru`.

Has Gemfile. Requires `bundle`.
