import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const cors = require('cors')({
  origin: true,
});

export const generateSeed = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log('1!!!');
      const dungeonCondition = await db.collection('dungeonconditions').doc(request.body.dungeonId).get();
      console.log('2!!!');
      const dungeonConditionData = dungeonCondition.data();
      const cardIds = dungeonConditionData.cards.keys();
      const promises = [];
      for (const cardId of cardIds) {
        promises.push(db.collection('dungeoncards').doc(cardId).get());
      }
      const dungeonCards = await Promise.all(promises);
      const dungeonSeed = { 
        ...dungeonConditionData,
        dungeoncards: []
      };
      for (const dungeonCard of dungeonCards) {
        dungeonSeed.dungeoncards.push(dungeonCard.data());
      }
      const dungeonSeedRef = await db.collection('dungeonseeds').add(dungeonSeed);
      response.status(200).json({ data: { seed: dungeonSeedRef.id }});
    } catch (err) {
      console.log('3!!!');
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
