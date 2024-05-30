// firebase config
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAcountKeyFirebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://db-ecommerce-34f42.firebaseio.com"
});
const firebase = admin.firestore();

module.exports = firebase