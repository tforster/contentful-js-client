# Contentful JS Client

A dependency free lightweight JavaScript client for Contentful's Content Delivery API

Contentful JS Client is a simple and lightweight JavaScript client that is less than 2Kb minified. It has no external
dependencies and can be used either in the browser or NodeJS. It relies upon window.fetch() or the native request class respectively.

__Features:__

* Retrieves content using a single Promised method called getEntries()
* Automatically denormalizes the returned data so that linked entries and assets are directly accessible on their respective keys
* Can be used in the browser or NodeJS
* Written in contemporary JavaScript (e.g. ES6+) and should work in all evergreen browsers
* No jQuery, no Babel*, no Webpack, etc.

_* Babel ESLint and Babili are used for linting and minification respectively but there is no transpiling in this project._

__Why?__

Contentful provides a rock solid [JavaScript client](https://github.com/contentful/contentful.js) with broad feature set. However, it does far more
than I need for most of my Contenful driven applications and at 77Kb for the minified version is actually missing what I consider to be a critical
feature; denormalizing returned results. By contrast Contentful JS Client is under 2Kb minified, can retrieve entries with modest query requirements and automatically denormalizes data.

## Installation and Usage

First, install the package with your preferred package manager. E.g `npm install contentful-js-client` or `yarn contentful-js-client` 

For Node

```JavaScript
// Following read-only creds point to a copy of Contentful's sample photo galery
const config = {
  access_token: '0aaf00d1373121cf60bf386add9e16d4d71b92b27ba16fd39d71ce67cf35af81',
  space: 'r6crsmn3pvic'
}

const ContentfulClient = require('contentful-js-client');
const contentfulClient = new ContentfulClient(config);

contentfulClient.getEntries({ content_type: '7leLzv8hW06amGmke86y8G', fields: {}, include: 3 })
  .then(galleryItems => {
    console.log(JSON.stringify(galleryItems, null, 2));
  })
  .catch(reason => {
    console.error(reason);
  })
```

For the browser copy the built file from the repository to your scripts folder choosing the regular or minified versions depending on your build workflow. Then place the following at the bottom of your HTML just above the closing body tag. 

```html
<script src="src/js/contentfulClient.min.js"></script>
<script>
  // Following read-only creds point to a copy of Contentful's sample photo galery
  const config = {
    access_token: '0aaf00d1373121cf60bf386add9e16d4d71b92b27ba16fd39d71ce67cf35af81',
    space: 'r6crsmn3pvic'
  }
  
  const contentfulClient = new Contentful(config);

  contentfulClient.getEntries({ content_type: '7leLzv8hW06amGmke86y8G', fields: {}, include: 3 })
    .then(galleryItems => {
      document.getElementById('results').innerHTML = JSON.stringify(galleryItems, null, 2);
    })
    .catch(reason => {
      document.getElementById('results').innerHTML = reason;
    })
</script>
```

## What is Missing?

Honestly, probably lots. While this lightweight client meets the need for three of my current Contentful driven projects it may not have all the
features you need. While the goal is to keep the client as lightweight as possible I would not be averse to adding additional features on a case by case basis. Feel free to post an issue to Github or better, send me a PR.

One feature that will be added soon is support for ordering results.

## Built With

* [babel-eslint](https://github.com/babel/babel-eslint): Handles ES2017 features like arrow functions inside classes better than the default Espree parser.
* [Babili](https://github.com/babel/babili): ES6 minification
* [Coffee](https://en.wikipedia.org/wiki/Coffee): A good source of [C8H10N4O2](https://pubchem.ncbi.nlm.nih.gov/compound/caffeine)
* [Contentful](http://contentful.com)
* [Git 2.7.4](https://git-scm.com/)
* [Gulp](http://gulpjs.com/)
* [NodeJS 8.1.2](https://nodejs.org/en/)
* [NPM 5.3.0](https://www.npmjs.com/package/npm)
* [Oh-My-Zsh](https://github.com/robbyrussell/oh-my-zsh) on Bash on Ubuntu on [Windows Subsystem for Linux](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide)
* [Visual Studio Code 1.14.1](https://code.visualstudio.com/) on Windows 10

## Change Log

v0.2.1 ()

* Fixed embarrassing spelling mistake with the word dependency

v0.2.0 (2017-07-26)

* Moved to its own repository
* Started creating proper tests
* Improved error handling

v0.1.0 (2017-05-27)

* Originally created as a standalone class in bigger project 
