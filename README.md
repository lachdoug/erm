# Engines Resource Manager

Use ERM to create and manage an orderly file structure.

## Configure

Configure ERM using `config/erm.yaml`.

```yaml
---
  logo:
    height: 35
    width: 100
  title: My Resources
  home:
    label: "Cool"
    description: "wow"
  css:
    body:
      backgroundColor: white
      color: "dimgrey"
  mount:
    - name: Clients
      order: true
      files:
        key: Note
        serialize: yaml
        as: list
        metadata:
          show:
            as: list
          form:
            - field:
                key: with
            - field:
                key: date
                type: date
            - field:
                key: body
                as: textarea
        content: |
          with: {{{ metadata.with }}}
          date: {{{ metadata.date }}}
          body: {{{ metadata.body }}}
      dirs:
        key: Client
        description: "RM: {{{ metadata.account_manager }}}"
        # label: Client
        metadata:
          form:
            - field:
                key: account_manager
                as: select
                collection:
                  - Lachlan
                  - Doug
        dirs:
          - name: User
          - name: Projects
            order: true
            dirs:
              key: Project
              dirs:
                - name: Data
                  dirs:
                    key: Notebook
                    new: false
                    delete: false
                    edit: false
                    files:
                      key: Output
                      new: false
                      delete: false
                      edit: false
                      raw: false
                      editor: false
                      as: link
                      link:
                        label: Open in Jupyter
                        href: https://ipjn3.eq8r.com/notebooks/{{ path }}
                - name: Controllers
                  order: true
                  files:
                    key: Controller
                    ext: ipynb
                    raw: false
                    editor: false
                    as: link
                    link:
                      label: Open in Jupyter
                      href: https://ipjn3.eq8r.com/notebooks/{{ path }}
                    seed: |
                      {
                        "cells": [
                          {
                            "cell_type": "code",
                            "execution_count": null,
                            "metadata": {},
                            "outputs": [],
                            "source": []
                          }
                        ],
                        "metadata": {
                          "kernelspec": {
                            "display_name": "Python 3",
                            "language": "python",
                            "name": "python3"
                          },
                          "language_info": {
                            "codemirror_mode": {
                              "name": "ipython",
                              "version": 3
                            },
                            "file_extension": ".py",
                            "mimetype": "text/x-python",
                            "name": "python",
                            "nbconvert_exporter": "python",
                            "pygments_lexer": "ipython3",
                            "version": "3.7.1"
                          }
                        },
                        "nbformat": 4,
                        "nbformat_minor": 2
                      }
                  dirs:
                    - name: Processes
                      order: true
                      files:
                        key: Process
                        raw: false
                        editor: false
                        ext: ipynb
                        as: link
                        link:
                          label: Open in Jupyter
                          href: https://ipjn3.eq8r.com/notebooks/{{ path }}
                        seed: |
                          {
                            "cells": [
                              {
                                "cell_type": "code",
                                "execution_count": null,
                                "metadata": {},
                                "outputs": [],
                                "source": []
                              }
                            ],
                            "metadata": {
                              "kernelspec": {
                                "display_name": "Python 3",
                                "language": "python",
                                "name": "python3"
                              },
                              "language_info": {
                                "codemirror_mode": {
                                  "name": "ipython",
                                  "version": 3
                                },
                                "file_extension": ".py",
                                "mimetype": "text/x-python",
                                "name": "python",
                                "nbconvert_exporter": "python",
                                "pygments_lexer": "ipython3",
                                "version": "3.7.1"
                              }
                            },
                            "nbformat": 4,
                            "nbformat_minor": 2
                          }
mode_map:
  ipynb: javascript
```

## Actions - NOT SURE IF THIS IS THE BEST WAY TO GET IMAGES INTO APP

### Upload Logo
1. Form with a file field
2. Write file `public/logo.png`

### Upload Favicon
1. Form with a file field
2. Write file `public/favicon.ico`

## Services

### Volumes

Mounts multiple volumes.

### OAuth

Callback URL: `/oauth2_callback`

URL, client ID and secret set in environment.

## Deploy

### Environment

#### ENV['ERM_FS_DIR']

Location for mounted volumes.

Defaults to:
- `/home/fs` in production
- `volumes` in development

#### ENV['ERM_OAUTH_URL']
#### ENV['ERM_OAUTH_CLIENT_ID']
#### ENV['ERM_OAUTH_SECRET']

### Build

`rake client:build` to create concatenated and minified client files. Output goes to `public/client.js` and `public/client.min.js`.

### Assets

Static assets served from `public`.

### Run

Sinatra modular style, with `config.ru`.

Has Gemfile. Requires `bundle`.
