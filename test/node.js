// Following read-only creds point to a copy of Contentful's sample photo galery
const config = {
  access_token: '0aaf00d1373121cf60bf386add9e16d4d71b92b27ba16fd39d71ce67cf35af81',
  space: 'r6crsmn3pvic'
}

const ContentfulClient = new require('../contentful-js-client.js');
const contentfulClient = new ContentfulClient(config);

contentfulClient.getEntries({ content_type: '1xYw5JsIecuGE68mmGMg20', fields: {}, order: '-fields.title', include: 3 })
  .then(galleryItems => {
    console.log(JSON.stringify(galleryItems, null, 2));
  })
  .catch(reason => {
    console.error(reason);
  })
