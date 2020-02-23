# Certificate Manager

SSL Certificate manager for MacOS that adds virtual hosts to Apache and restarts it automatically.

## Usage

```bash
# bash
cm
```

## Configuration

Make sure you export the following variables from somewhere in your shell's startup files.

Eh: `~/.zshrc`, `~/.bashrc`, ...

``` bash
export CM_PATH_SITES="/Users/tovenaar-merlijn/Sites/test"
export CM_PATH_CA="/Users/tovenaar-merlijn/.ssl"
export CM_PATH_VHOSTS="/usr/local/etc/httpd/extra"
export CM_CA_NAME="LetsDecrypt"
```

| name | description |
| --- | --- |
| CM_PATH_SITES | The path to the folder containing symlinks to the document roots of your localhost websites. |
| CM_PATH_CA | The path that contains your Certificate Authority files. |
| CM_PATH_VHOSTS | The path that contains Apache's `httpd-vhosts.conf` file. |
| CM_CA_NAME | The name of the Certificate Authority you would like to use to sign your certificates. Without extension. |


### Create Certificate Authority

If you don't already have a Certificate Authority, create one with `$ cm`.
The name you pick for the CA will be the name you use for `CM_CA_NAME`.
