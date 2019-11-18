import * as functions from 'firebase-functions';

import { firestoreDB } from '../services/firestore';

const cors = require('cors')({
  origin: true,
});

export const generateSeed = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      const dungeonCondition = await firestoreDB.collection('dungeonconditions').doc(request.body.dungeonId).get();
      const dungeonConditionData = dungeonCondition.data();
      const cardIds = Object.keys(dungeonConditionData.cards);
      const promises = [];
      for (const cardId of cardIds) {
        promises.push(firestoreDB.collection('dungeoncards').doc(cardId).get());
      }
      const dungeonCards = await Promise.all(promises);
      const dungeonSeed = { 
        ...dungeonConditionData,
        dungeoncards: []
      };
      for (const dungeonCard of dungeonCards) {
        dungeonSeed.dungeoncards.push(dungeonCard.data());
      }
      const dungeonSeedRef = await firestoreDB.collection('dungeonseeds').add(dungeonSeed);
      response.status(200).json({ data: { seed: dungeonSeedRef.id }});
    } catch (err) {
      console.error(err);
      response.status(500).json({ data: { err }});
    }
  });
});

// export const generateSeed = functions.https.onRequest((request, response) => {
//   return cors(request, response, () => {
//     db.collection('dungeonconditions').doc(request.body.dungeonId).get()
//     .then(dungeonCondition => {
//       const dungeonConditionData = dungeonCondition.data();
//       const cardIds = dungeonConditionData.cards.keys();
//       const promises = [];
//       for (const cardId of cardIds) {
//         promises.push(db.collection('dungeoncards').doc(cardId).get());
//       }
//       Promise.all(promises)
//       .then(dungeonCards => {
//         const dungeonSeed = { 
//           ...dungeonConditionData,
//           dungeoncards: []
//         };
//         for (const dungeonCard of dungeonCards) {
//           dungeonSeed.dungeoncards.push(dungeonCard.data());
//         }
//         db.collection('dungeonseeds').add(dungeonSeed)
//         .then(dungeonSeedRef => {
//           response.status(200).json({ data: { seed: dungeonSeedRef.id }});
//         })
//         .catch(err => {
//           console.error(err);
//           response.status(500).json({ data: { err }});
//         });
//       })
//       .catch(err => {
//         console.error(err);
//         response.status(500).json({ data: { err }});
//       });
//     })
//     .catch(err => {
//       console.error(err);
//       response.status(500).json({ data: { err }});
//     });
//   });
// });

export const updateTags = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
      response.status(200).json({ data: { ok: true }});
  });
});
