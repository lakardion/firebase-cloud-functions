import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Request, Response } from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const addMessage = functions.https.onRequest(
  async (req: Request, res: Response) => {
    const original = req.query.text;
    const writeResult = await admin
      .firestore()
      .collection("messages")
      .add({ original: original });
    res.json({ result: `Message with ID ${writeResult.id} added` });
  }
);

export const makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });
