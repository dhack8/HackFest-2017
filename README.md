# Hackfest Starter Pack

First up, install NodeJS from nodejs.org.  At the time of writing you probably want v4.5.0 LTS.

To get this demo up and running, clone it into a directory somewhere and run:

```bash
$ npm install
```

This will download all the NPM packages required to make this application run.

Get an API key from <https://developer.forecast.io/register> and put it into `app.js` in the correct place:

```javascript
var forecastIOKey = "your key goes here";
```

Then you're ready to run it:

```bash
$ node app.js
```

Navigating in your browser to <http://localhost:3000> will display the site.
