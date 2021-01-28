# RiotClientServices.exe

If you're reading this document, you're likely interested in intercepting traffic from the local HTTP server or WebSocket server that runs on your local machine when you launch VALORANT.

A few things should be noted, for a fresh install of VALORANT:

- The webserver binds to `127.0.0.1`.
- The webserver requires requests over `https://` not `http://`.
- The webserver runs on a random port every time `RiotClientServces.exe` is launched.
- The webserver requires HTTP Basic Authentication, with the username `riot` and a random password which is generated when `RiotClientServices.exe` is launched.
- Intercepting requests with Charles Proxy or Fiddler will fail. (For most endpoints)

## Intercepting Requests

A few of the above things can be changed with flags passed in when running `RiotClientServces.exe`.

Usually when running VALORANT, the desktop shortcut contains the following:

```
"C:\Riot Games\Riot Client\RiotClientServices.exe" --launch-product=valorant --launch-patchline=live
```

This will launch the update and login flow which happens before VALORANT is actually launched.

In the case of a fresh install, the only flags passed in are:

- `--launch-product=valorant`
- `--launch-patchline=live`

We can disable HTTPS certificate checking in RiotClientServices which will allow us to intercept traffic to the webserver with tools such as Charles Proxy and Fiddler, by adding the following flag to our VALORANT shortcut:

```
--insecure
```

We are also able to influence which port the webserver will run on, by passing in another flag:

```
--app-port=12345
```

It is also possible to change the listen address of the webserver so you can access it from other devices on your network.

```
--app-listen-address=0.0.0.0
```

With the following shortcut, we will be able to intercept RiotClientServices requests on `https://127.0.0.1:12345` and `wss://127.0.0.1:12345`.

```
"C:\Riot Games\Riot Client\RiotClientServices.exe" --launch-product=valorant --launch-patchline=live --insecure --app-port=12345
```

If you're using Charles Proxy, make sure to install your custom CA Certificate into the `Trusted Root Certification Authorities` certificate trust store from the `Help` > `SSL Proxying` > `Install Charles Root Certificate` menu.

Make sure you only have SSL Proxying enabled for `https://127.0.0.1:12345` and `wss://127.0.0.1:12345`, otherwise VALORANT will not run due to Vanguard throwing an error code of `VAL 29`.

## Lock File

In order to obtain the password you need to authorize with the local RiotClientServices webserver, you can check your `lockfile`.

Your `lockfile` is usually stored at:

```
C:\Users\username\AppData\Local\Riot Games\Riot Client\Config\lockfile
```

The [LocalRiotClientAPI.js](../src/LocalRiotClientAPI.js) class shows how to parse this in the `parseLockFile` method.

Unfortunately, I haven't been able to influence the password by passing in the following flags:

- `--remoting-auth-token`
- `--riotclient-auth-token`

## How to find flags?

The flags mentioned in this document can be found inside of `RiotClientFoundation.dll` which is in the same folder as `RiotClientServices.exe`