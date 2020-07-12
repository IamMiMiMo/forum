# ReactJS Forum

A forum powered by ReactJS and Firebase.

## Basic Features:
* Authentication
* Start threads
* Comment system with WYSIWYG or simple Markdown editor
* Category system

## Future implementations
* Admin system
* Comment counter
* Newest threads and Hot threads

> Warning: **Don't** use this code in production, it has known **security risk** and **unstable**.

## Installation

1. Clone or download the code.
2. Create `src\constants\firebase.js` with your own firebase SDK configs, which can be obtained from Firebase backend, see [Firebase docs](https://firebase.google.com/docs/web/setup?authuser=0#add-sdks-initialize). See example code below.
3. Create `src\constants\apikey.js` with your own Chevereto API key, which can be obtain in your Chevereto site backend. See example code below. If you don't want to use Chevereto as your image host, modify the `uploadImage()` in `src\Components\CommentTextarea\CommentTextarea.js`.
4. Run `npm install` to install dependency.
5. Run `npm start` to start the forum in local environment.

## Example configuration

### Firebase configs

```javascript
export const FIREBASE_CONFIG = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
};
```

### API key config

``` javascript
export const CHEVERETO_API_KEY = 'PLACE_YOUR_API_KEY_HERE';
```

## License

MIT License

Copyright (c) 2020 ReactJS Forum

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.