# test

This folder currently contains two superficial and contrived tests. One for Node and the other for the browser. They simply
output the response of the query indicating that the class works in both environments.

## Usage/Instructions

__Node__

`node test/node.js`

__Browser__

Use a static HTTP server such as [Node static server](https://github.com/nbluis/static-server) to serve the root of this project. Navigate to http://{server-domain}/test/browser.html. It is necessary to serve from the root since the test file needs to walk up one directory level to fetch contentful-js-client.min.js.

Proper tests coming soon...
