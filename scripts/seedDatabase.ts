import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../src/firebase'
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { channels } from '../src/config/ambiance/channels';
import { ambianceCategoryDetail, ambianceCategories } from "../src/config/ambiance/index";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//addChannels();
//addWarcraft();

async function addChannels() {
  try {

    let current: keyof typeof channels;

    for (current in channels) {
      let entry = channels[current];

      await setDoc(doc(db, "channels", current), {
        name: entry.name,
        link: entry.link,
      });
    }

  } catch (e) {
    console.error("Error: ", e);
  }

}


async function addWarcraft() {
  try {

    let current: keyof typeof ambianceCategories;

    for(current in ambianceCategories) {
      let entry = ambianceCategories[current];
      let entryDetails = ambianceCategoryDetail[current];

      await setDoc(doc(db, "ambiance", current), {
        name: entryDetails.name,
        icon: entryDetails.icon,
        videos: entry
      });
    }
       
  } catch (e) {
    console.error("Error: ", e);
  }

}