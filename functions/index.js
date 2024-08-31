const { onRequest, onCall } = require("firebase-functions/v2/https");
//const { firestore } = require("firebase-functions/v2/firestore");
const admin = require('firebase-admin');


admin.initializeApp();
const db = admin.firestore();
exports.helloWorld = onRequest((request, response) => {
    debugger;
    const name = request.params[0].replace('/','');
    const items = { lamp: 'This is a lamp', chair: 'Good chair' };
    const message = items[name];
    response.send(`<h1>${message}</h1>`);
});

exports.addNote = onRequest(async (req, res) => {
    try {
        const data = req.body;
        const docRef = await db.collection('notes').add(data);
        return res.status(200).send(docRef.id);
    } catch (err) {
        return res.status(500).send(err.message);
    }
})

exports.getTitlewithCount = onRequest(async (req, res) => {
    const Counter = {};
    try {
        const docRef = await db.collection('notes').get();
        const FinalData = docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //console.log('FinalData = ', FinalData);
        FinalData.forEach(data => {
            //const data = doc.data();
            const title = data.data.title; // Assuming the field is called 'title'
            console.log('title = ', title);
            if (title) {
                if (Counter[title]) {
                    Counter[title]++;
                } else {
                    Counter[title] = 1;
                }
            }
        });
        return res.status(200).send(Counter);
    } catch(err) {
        return res.status(500).send(err.message);
    }
});

exports.addDataToCollection = onRequest(async (req, res) => {
    try {
        const data = req.body;
        console.log('data = ', data);
        const docRef = await db.collection('users').add(data);
        return res.status(200).send(docRef.id);
    } catch (err) {
        return res.status(500).send(err.message);
    }
})

exports.getDataFromCollection = onRequest( async (req, res) => {
    try {
        //console.log('data = ', data);
        const docRef = await db.collection('users').get();
        const FinalData = docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //return FinalData;
        return res.status(200).send(FinalData);
      } catch (err) {
        return res.status(500).send(err.message);
      }
})


// exports.getDataFromCollection = onRequest(async (req, res) => {
//     try {
//         const docRef = await db.collection('users').get();
//         const FinalData = docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         //return FinalData;
//         return res.status(200).send(FinalData);
//       } catch (err) {
//         return res.status(500).send(err.message);
//       }
// })

exports.updateSingleDataEntryFromCollection = onRequest(async (req, res) => {
    try {
        const id = req.body.id;
        delete req.body.id;
        const docRef = await db.collection('users').doc(id);
        await docRef.update(req.body);
        return res.status(200).send(`Document with id: ${id} updated successfully`);
    } catch (err) {
        return res.status(500).send(err.message);
    }
})

exports.deleteDataEntryFromCollection = onRequest(async (req, res) => {
    try {
        const id = req.body.id;
        delete req.body.id;
        await db.collection('users').doc(id).delete();
        return res.status(200).send(`Document with id: ${id} deleted successfully`);
    } catch (err) {
        return res.status(500).send(err.message);
    }
})

exports.checkOnCall = onCall((data, context) => {
    return res.status(200).send('Hello World');
})


// const USD_to_EUR = 0.95;
// exports.newsku = firestore.document('/inventore/{sku}')
//     .onCreate(snapshot => {
//         const data = snapshot.data();
//         const eur = data.usd * USD_to_EUR;
//         //const promise = snapshot.ref.update({ eur });
//         //return promise;
//         return snapshot.ref.set({ eur, ...data }, { merge: true });
//     })
