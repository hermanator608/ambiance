import { AmbianceCategory } from '../config/ambiance/types';
import { AmbianceDisplayType, SubcategoryMap} from "../types";

/**
 * Groups videos by subcategory for each document (i.e., each parent category)
 * @param data , all data / documents from Firestore database
 * @returns map of document ID (key) to subcategory information (subcategory name, videos in subcategory)
 */
export const groupVideosBySubcategory = (data: Record<string, AmbianceCategory>): AmbianceDisplayType => {
  // Map of documentId -> (Map of subcategory name -> videos in subcategory)
  const newData: AmbianceDisplayType = {};
  Object.entries(data).forEach(([documentId, value]) => {

    // Map of subcategory name -> videos in subcategory
    const groupedVideos: SubcategoryMap = {};
    value.videos.forEach((vid) => {
      // If subcategory already exists, concat to existing list of videos
      if (groupedVideos[vid.group]) {
        groupedVideos[vid.group] = groupedVideos[vid.group].concat(vid);
      } else { // Create new key/value in map, with array of one video
        groupedVideos[vid.group] = [vid];
      }
    });

    // Add grouped videos to newData map using documentId as key
    newData[documentId] = {
      friendlyName: value.name,
      videosBySubcategory: groupedVideos
    };
  })

  return newData;
}
