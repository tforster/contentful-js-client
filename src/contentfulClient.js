/*! license Contentful JS Client. Copyright 2017 Troy Forster https://github.com/tforster/contentful-js-client */

/**
 * Contentful JS Client: A dependancy free lightweight JavaScript client for Contentful's Content Delivery API
 */

'use strict';

class Contentful {
  constructor(config) {
    this.space = config.space;
    this.access_token = config.access_token;
  }

  /**
   * Node's native support for GETting a URL is the request object
   * 
   * @param {string} url 
   * @param {bool} denormalize 
   * @returns A Promise containing the results from the Contentful API
   * @memberof Contentful
   */
  _nodeRequest(url, denormalize) {
    let self = this;
    return new Promise((resolve, reject) => {
      const https = require('https');
      const { URL } = require('url');
      const uri = new URL(url);

      const options = {
        hostname: uri.hostname,
        port: 443,
        path: uri.pathname + uri.search,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let data = '';

      const req = https.request(options, res => {
        res.setEncoding('utf8');
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          if (denormalize) {
            data = self._denormalize(JSON.parse(data));
            // Todo: consider adding sys's back in
          }
          resolve(data);
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        reject(e);
      });

      req.write('');
      req.end();
    })
  }

  /**
   * The browser's native support for GETting a URL is the fetch() function
   * 
   * @param {string} url 
   * @param {bool} denormalize 
   * @returns A Promise containing the results from the Contentful API
   * @memberof Contentful
   */
  _windowFetch(url, denormalize) {
    let self = this;
    return new Promise((resolve, reject) => {
      const request = new Request(url, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });

      return fetch(request)
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (denormalize) {
            data = self._denormalize(data);
          }
          resolve(data);
        })
        .catch(reason => {
          console.error(reason);
          reject(reason);
        })
    });
  }


  /**
   * Contentful REST API returns results normalized. That is, an array of entry items may contain links
   * to additional data objects includes.assets and include.entries. Denormalize() recurses each item
   * and attaches any linked objects directly to the parent property for easier access.
   * 
   * Helper Methods
   * - getData: Retrieves a linked object if it exists else the original param. Note that this can mutate the val param
   * - denormalizeP:  A recursive function that returns a denormalized object including all of its child objects
   * 
   */
  _denormalize(obj) {
    let getData = data => {
      if (typeof (data === 'object') && data.sys && data.sys.type === 'Link') {
        let objects = obj.includes[data.sys.linkType].filter(include => {
          return include.sys.id === data.sys.id;
        });
        return denormalizeP(objects[0]);
      }
      return data;
    }

    let denormalizeP = item => {
      let retObj = {};

      for (let field in item.fields) {
        let itemData = item.fields[field];

        if (Array.isArray(itemData)) {
          retObj[field] = itemData.map(el => {
            return getData(el);
          });
        } else {
          retObj[field] = getData(itemData);
        }
      }
      return retObj;
    }

    if (obj && obj.items) {
      return obj.items.map(item => {
        return denormalizeP(item);
      });
    } else {
      console.warn('obj.items not found?')
      return [];
    }
  }

  /**
   * Pseudo private method that dispatches the request to either window.fetch() or Node Request
   * depending upon the detected host environment
   * 
   * @param {object} query 
   * @returns Promise
   * @memberof Contentful
   */
  _query(query) {
    let self = this;

    // Set defaults for any missing properties
    query.include = query.include || 10;
    query.denormalize = query.denormalize || true;
    query.raw = query.raw || false;
    self.okDenormalize = (query.denormalize && !query.raw);

    let url = `https://cdn.contentful.com/spaces/${self.space}/entries?access_token=${self.access_token}&content_type=${query.content_type}&include=${query.include}`;

    // Add any additional query field params
    if (query.fields) {
      for (let f in query.fields) {
        url = url + `&fields.${f}=${query.fields[f]}`
      }
    }

    if (query.order) {
      console.warn('query.order not yet implemented');
    }

    // Window === 'undefined' means this is not a browser so assume Node
    if (typeof (window) === 'undefined') {
      return self._nodeRequest(url, true);
    } else {
      return self._windowFetch(url, true)
    }
  }


  /**
   * Returns a Promise for an array of entries matching the query. 
   *  
   * @param {any} query 
   * @returns 
   * @memberof Contentful
   */
  getEntries(query) {
    let self = this;
    return new Promise((resolve, reject) => {
      self._query(query)
        .then(entries => {
          return resolve(entries);
        })
        .catch(reason => {
          console.error('contentful.getEntries failed:', reason);
          return reject(reason);
        })
    });
  }
}

// Export this class when executing this script under Mocha/NodeJS
(typeof (module) === 'object') ? module.exports = Contentful : null;

