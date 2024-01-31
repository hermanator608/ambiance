import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../src/firebase'
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { channels } from '../src/config/ambiance/channels';
import { worldOfWarcraft } from '../src/config/ambiance/wow/index';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//addChannels();
//addWarcraft();

async function addChannels() {

  try {
    let current: keyof typeof channels;

    for (current in channels) {
      let entry = channels[current];

      const docRef = await setDoc(doc(db, "channels", current), {
        name: entry.name,
        link: entry.link,
      });
    }

  } catch (e) {
    console.error("Error: ", e);
  }

}

//TO DO: Update setDoc function or use Batch writes
async function addWarcraft() {

  try {
    let current: keyof typeof worldOfWarcraft;

    for (current in worldOfWarcraft) {
      let entry = worldOfWarcraft[current];
      //console.log(worldOfWarcraft[current]);
      //console.log(entry);

      const docRef = await setDoc(doc(db, "ambiance", "warcraft"), {
        name: entry.name,
        code: entry.code,
        group: entry.group,
        channel: entry.channel,
        liveStream: entry.livestream || null,
        startTime: entry.startTimeS || null
      });
      
    }

  } catch (e) {
    console.error("Error: ", e);
  }

}