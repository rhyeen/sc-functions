import * as functions from 'firebase-functions';

const cors = require('cors')({
  origin: true,
});

export const generateSeed = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    response.status(200).json({ data: { seed: 'TEST' }});
  });
});

export const updatedTags = functions.https.onRequest((request, response) => {
    return cors(request, response, () => {
        response.status(200).json({ data: { ok: true }});
    });
  });
  