import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var admin = require("firebase-admin");
var serviceAccount = require("/home/sunder/Desktop/Android/one-bottle-316120-firebase-adminsdk-6wbc7-3a1fa56cab.json");
//import * as admin from "firebase-admin";
//import serviceAccount from "/home/sunder/Desktop/Android/one-bottle-316120-firebase-adminsdk-6wbc7-3a1fa56cab.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://amazona.firebaseio.com"
});



//module.exports.admin = admin
export default admin