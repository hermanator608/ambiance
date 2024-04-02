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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Ambiance, AmbianceCategory } from './config/ambiance/types';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import VideoEditor from './components/VideoEditor';
import { AMBIANCE_COLLECTION } from './constants';
import cloneDeep from 'lodash.clonedeep';

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

  
  const editVideo = async (documentId: string, videoUrlCode: string, newData: Ambiance) => {
    if (!data) {
      return;
    }

    const newVideos = cloneDeep(data[documentId].videos);
    const videoIndex = newVideos.findIndex(video => video.code === videoUrlCode);
    newVideos[videoIndex] = newData;

    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    await updateDoc(docRef, {
      videos: newVideos
    });
 
  }

  const deleteVideo = async (documentId: string, videoUrlCode: string) => {
    if (!data) {
      return;
    }

    const newVideos = cloneDeep(data[documentId].videos)
      .filter(video => video.code !== videoUrlCode);

    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    await updateDoc(docRef, {
      videos: newVideos
    });
  }

  const addVideo = async (documentId: string, newData: Ambiance) => {
    if (!data) {
      return;
    }

    const newVideos = cloneDeep(data[documentId].videos);
    newVideos.push(newData);

    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    await updateDoc(docRef, {
      videos: newVideos
    });
  }


  const displayTreeComponent = () => {
    if (!data) {
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

    const addIcon = (
      <Tooltip title="Add Video">
        <IconButton color="secondary" size="small">
          <AddIcon />
        </IconButton>
      </Tooltip>
    );

    // key = ambiance category, i.e., animalCrossing, bg3
    const elements = Object.entries(newData).map(([documentId, ambianceDisplay], index) => (
      <TreeItem className='tree-item' key={documentId} nodeId={documentId} label={ambianceDisplay.friendlyName} sx={{ textAlign: 'left' }}>
        {Object.entries(ambianceDisplay.videosBySubcategory).map(([subcategory, vids]) => (
          <TreeItem key={documentId + subcategory} nodeId={documentId + subcategory} label={subcategory} sx={{ textAlign: 'left' }}>
            {vids.map(vid => (
              <TreeItem collapseIcon={<BuildCircleIcon className='build-icon' />} expandIcon={<BuildCircleIcon />} key={vid.name} nodeId={vid.name} label={vid.name} sx={{ textAlign: 'left' }} >
                <VideoEditor videoUrlCode={vid.code} video={vid} documentId={documentId} editVideo={editVideo} deleteVideo={deleteVideo} />
              </TreeItem>
            ))}
            {/* add new collapse icon, add tooltip to edit icon above */}
            <TreeItem nodeId={subcategory + index} expandIcon={addIcon} collapseIcon={<BuildCircleIcon className='build-icon' />}>
              <VideoEditor documentId={documentId} addVideo={addVideo} video={{group: subcategory}}></VideoEditor>
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
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
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

      <Typography id="videos-title" variant='h1'>videos</Typography>
      {displayTreeComponent()}

    </div>
  );
}
