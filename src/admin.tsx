import React, { useContext, useEffect, useState } from 'react';
import './index.css';
import { AuthContext } from "./AuthProvider";
import { Button, ButtonGroup } from '@mui/material';
import { collection, getFirestore, onSnapshot, doc, updateDoc } from "firebase/firestore";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Ambiance, AmbianceCategory } from './config/ambiance/types';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import VideoEditor from './components/VideoEditor';
import { TreeIcon } from './components/TreeIcon';
import { AMBIANCE_COLLECTION } from './constants';
import cloneDeep from 'lodash.clonedeep';
import { EditVideoFn, DeleteVideoFn, AddVideoFn } from './types';

type SubcategoryMap = Record<string, Ambiance[]>;

/**
 * friendlyName is ambiance category name
 */
type SubcategoryGroupingType = {
  friendlyName: string;
  videosBySubcategory: SubcategoryMap;
}

/**
 * Key is documentId
 */
type AmbianceDisplayType = Record<string, SubcategoryGroupingType>;

export default function AdminPage() {
  const db = getFirestore();
  const { currentUser, signOut } = useContext(AuthContext);
  const [data, setData] = useState<Record<string, AmbianceCategory>>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, AMBIANCE_COLLECTION), (snapshot) => {
      const dataMap = snapshot.docs.reduce<Record<string, AmbianceCategory>>((obj, item) => {
        obj[item.id] = item.data() as AmbianceCategory

        return obj;
      }, {});

      setData(dataMap);
    });

    return unsubscribe;
  }, [db, setData]);


  const editVideo: EditVideoFn = async (documentId, videoUrlCode, newData) => {
    if (!data) {
      console.error("Ambiance data not available when attempting to editVideo");
      return;
    }

    const newVideos = cloneDeep(data[documentId].videos);
    const videoIndex = newVideos.findIndex(video => video.code === videoUrlCode);
    if (videoIndex === -1) {
      console.error("Index not found when attempting to editVideo");
      return;
    }
    newVideos[videoIndex] = newData;


    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    return updateDoc(docRef, {
      videos: newVideos
    });

  }

  const deleteVideo: DeleteVideoFn = async (documentId, videoUrlCode) => {
    if (!data) {
      console.error("Ambiance data not available when attempting to deleteVideo");
      return;
    }

    const newVideos = cloneDeep(data[documentId].videos)
      .filter(video => video.code !== videoUrlCode);

    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    return updateDoc(docRef, {
      videos: newVideos
    });
  }

  const addVideo: AddVideoFn = async (documentId, newData) => {
    if (!data) {
      console.error("Ambiance data not available when attempting to addVideo");
      return;
    }

    const newVideos = cloneDeep(data[documentId].videos);
    newVideos.push(newData);

    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    return updateDoc(docRef, {
      videos: newVideos
    });
  }


  const displayTreeComponent = () => {
    if (!data) {
      console.error("Ambiance data not available when attempting to displayTreeComponent");
      return;
    }

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


    // key = ambiance category, i.e., animalCrossing, bg3
    const elements = Object.entries(newData).map(([documentId, ambianceDisplay], index) => (
      <TreeItem className='tree-item' key={documentId} nodeId={documentId} label={ambianceDisplay.friendlyName} >
        {Object.entries(ambianceDisplay.videosBySubcategory).map(([subcategory, vids]) => (
          <TreeItem key={documentId + subcategory} nodeId={documentId + subcategory} label={subcategory} >
            {vids.map(vid => (
              <TreeItem
                expandIcon={<TreeIcon tooltipText='Edit Video' icon={<BuildCircleIcon />} />}
                collapseIcon={<TreeIcon tooltipText='Expand' icon={<BuildCircleIcon color='error' />} />}
                key={vid.name}
                nodeId={vid.name}
                label={vid.name}
              >
                <VideoEditor currentVideo={vid} documentId={documentId} editVideo={editVideo} deleteVideo={deleteVideo} />
              </TreeItem>
            ))}
            <TreeItem
              nodeId={subcategory + index}
              expandIcon={<TreeIcon tooltipText='Add Video' icon={<AddIcon />} />}
              collapseIcon={<TreeIcon tooltipText='Expand' icon={<BuildCircleIcon color='error' />} />}
            >
              <VideoEditor documentId={documentId} addVideo={addVideo} currentVideo={{ group: subcategory }}></VideoEditor>
            </TreeItem>
          </TreeItem>
        ))}
      </TreeItem>
    ));

    return (
      <div id='tree-view'>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: '100%', flexGrow: 1, maxWidth: 600, overflowY: 'auto', paddingLeft: 10 }}
        >
          {elements}
        </TreeView>
      </div>
    )
  }


  return (
    <div id="admin-page" data-testid='admin'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className="app-bar" >
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              <b><i>Welcome,</i></b> {currentUser?.email?.split('@')[0]}
            </Typography>
            <ButtonGroup variant='outlined' size='large' sx={{ bgcolor: 'black' }}>
              <Button>Analytics</Button>
              <Button onClick={() => document.getElementById('videos-title')?.scrollIntoView(true)}>Videos</Button>
              <Button onClick={signOut}>Logout</Button>
            </ButtonGroup>
          </Toolbar>
        </AppBar>
      </Box>

      <Typography id="videos-title" variant='h1' textAlign={"center"}>videos</Typography>
      {displayTreeComponent()}

    </div>
  );
}
