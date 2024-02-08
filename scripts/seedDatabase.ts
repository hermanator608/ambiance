import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../src/firebase'
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { channels } from '../src/config/ambiance/channels';
import { ambianceCategoryDetail, ambianceCategories } from "../src/config/ambiance/index";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

switch (process.argv[2]) {
  case "channels": 
    addChannels();
    break;
  case "ambiance": 
    addAmbianceCategories();
    break;
  default:
    addChannels();
    addAmbianceCategories();
    break;
}

async function addChannels() {
  try {

    console.log("Seeding Channels...");
    let current: keyof typeof channels;

    for (current in channels) {
      let entry = channels[current];

      await setDoc(doc(db, "channels", current), {
        name: entry.name,
        link: entry.link,
      });
    }

    console.log("Channels Seeded!")

  } catch (e) {
    console.error("Error: ", e);
  }

}


async function addAmbianceCategories() {
  try {

    console.log("Seeding Ambiance Categories...");
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

    console.log("Ambiance Categories Seeded!")
       
  } catch (e) {
    console.error("Error: ", e);
  }

}