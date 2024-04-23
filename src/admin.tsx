import React, { useContext, useEffect, useState } from 'react';
import './index.css';
import { AuthContext } from "./AuthProvider";
import { collection, getFirestore, onSnapshot, doc, updateDoc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { EditVideoFn, DeleteVideoFn, AddVideoFn, AddCategoryFn, DeleteCategoryFn, EditCategoryFn } from './types';
import { Ambiance, AmbianceCategory } from './config/ambiance/types';
import { TreeIcon } from './components/TreeIcon';
import { AMBIANCE_COLLECTION } from './constants';
import VideoEditor from './components/VideoEditor';
import CategoryEditor from './components/CategoryEditor';
import cloneDeep from 'lodash.clonedeep';
//MUI Imports
import { Alert, Button, ButtonGroup, Snackbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import Construction from '@mui/icons-material/Construction';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { AlertProps } from '@mui/material';


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
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertProps["severity"]>("info");
  const [snackPack, setSnackPack] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (snackPack.length && !snackBarMessage) {
      // Set a new snack when we don't have an active one
      setSnackBarMessage(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && snackBarMessage) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, snackBarMessage]);

  const handleSnackBarExited = () => {
    setSnackBarMessage("");
    setOpen(false);
  }

  const handleAddSnackBarMessage = (message: string) => {
    setSnackPack((prev) => [...prev, message]);
  }

  const handleCloseSnackBar = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarMessage("");
    setOpen(false);
  };

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
    }).then(() => {
      setAlertSeverity("success");
      handleAddSnackBarMessage("Successfully updated video - " + newData.name);
    });

  }

  const deleteVideo: DeleteVideoFn = async (documentId, videoUrlCode) => {
    if (!data) {
      console.error("Ambiance data not available when attempting to deleteVideo");
      return;
    }

    const videoToDelete = data[documentId].videos.find(video => video.code === videoUrlCode);

    const newVideos = cloneDeep(data[documentId].videos)
      .filter(video => video.code !== videoUrlCode);

    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    return updateDoc(docRef, {
      videos: newVideos
    }).then(() => {
      setAlertSeverity("success");
      handleAddSnackBarMessage("Removed video - " + videoToDelete?.name);
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
    }).then(() => {
      setAlertSeverity("success");
      handleAddSnackBarMessage("Successfully added video - " + newData.name);
    });
  }

  const addCategory: AddCategoryFn = async (documentId, documentName, icon) => {
    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setAlertSeverity("error");
      handleAddSnackBarMessage("Ambiance Category - " + documentId + " already exists");

    } else {
      setDoc(doc(db, AMBIANCE_COLLECTION, documentId), {
        name: documentName,
        icon: icon,
        videos: []
      }).then(() => {
        setAlertSeverity("success");
        handleAddSnackBarMessage("Successfully added category - " + documentId);
      });
    }
  }

  const editCategory: EditCategoryFn = async (documentId, documentName, icon) => {
    updateDoc(doc(db, AMBIANCE_COLLECTION, documentId), {
      name: documentName,
      icon: icon,
    }).then(() => {
      setAlertSeverity("success");
      handleAddSnackBarMessage("Successfully updated category - " + documentId);
    });
  }

  const deleteCategory: DeleteCategoryFn = async (documentId) => {
    deleteDoc(doc(db, AMBIANCE_COLLECTION, documentId)).then(() => {
      setAlertSeverity("success");
      handleAddSnackBarMessage("Removed category - " + documentId);
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
      <TreeItem
        sx={{ padding: 1 }}
        key={documentId}
        nodeId={documentId}
        label={<Typography variant='h6'>{ambianceDisplay.friendlyName}</Typography>}
      >
        <TreeItem
          expandIcon={<TreeIcon tooltipText='Edit Category' icon={<BuildCircleIcon />} />}
          collapseIcon={<TreeIcon tooltipText='Close Editor' icon={<BuildCircleIcon color='error' />} />}
          key={documentId + 'edit_category'}
          nodeId={documentId + 'edit_category'}
          label={<p>Edit <i><b>{ambianceDisplay.friendlyName}</b></i> Category</p>}
        >
          <CategoryEditor editCategory={editCategory} deleteCategory={deleteCategory} categoryID={documentId} categoryDetails={data[documentId]}></CategoryEditor>
        </TreeItem>
        <Divider />
        {Object.entries(ambianceDisplay.videosBySubcategory).map(([subcategory, vids]) => (
          <TreeItem
            key={documentId + subcategory}
            nodeId={documentId + subcategory}
            label={<Typography variant='subtitle1'>{subcategory}</Typography>}
          >
            {vids.map(vid => (
              <TreeItem
                expandIcon={<TreeIcon tooltipText='Edit Video' icon={<BuildCircleIcon />} />}
                collapseIcon={<TreeIcon tooltipText='Close Editor' icon={<BuildCircleIcon color='error' />} />}
                key={documentId + subcategory + vid.code + "edit_video"}
                nodeId={documentId + subcategory + vid.code + "edit_video"}
                label={vid.name}
              >
                <VideoEditor currentVideo={vid} documentId={documentId} editVideo={editVideo} deleteVideo={deleteVideo} />
              </TreeItem>
            ))}
            <TreeItem
              key={documentId + subcategory + "add_video"}
              nodeId={documentId + subcategory + "add_video"}
              expandIcon={<TreeIcon tooltipText='Add Video' icon={<AddIcon />} />}
              collapseIcon={<TreeIcon tooltipText='Close Editor' icon={<BuildCircleIcon color='error' />} />}
            >
              <VideoEditor documentId={documentId} addVideo={addVideo} currentVideo={{ group: subcategory }}></VideoEditor>
            </TreeItem>
          </TreeItem>
        ))}
        <TreeItem
          key={documentId + "new_video"}
          nodeId={documentId + "new_video"}
          expandIcon={<TreeIcon tooltipText='Add Video' icon={<AddIcon />} />}
          collapseIcon={<TreeIcon tooltipText='Close Editor' icon={<BuildCircleIcon color='error' />} />}
        >
          <VideoEditor documentId={documentId} addVideo={addVideo}></VideoEditor>
        </TreeItem>
      </TreeItem>
    ));

    return (
      <div id='tree-view'>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: '100%', flexGrow: 1, maxWidth: 900, overflowY: 'auto', paddingLeft: 10 }}
        >
          {elements}
          <TreeItem
            sx={{ padding: 1 }}
            nodeId='add_category'
            expandIcon={<TreeIcon tooltipText='New Category' icon={<AddIcon />} />}
            collapseIcon={<TreeIcon tooltipText='Close Editor' icon={<BuildCircleIcon color='error' />} />}
          >
            <Typography variant='h6'><i>New Ambiance Category</i></Typography>
            <Divider />
            <CategoryEditor addCategory={addCategory}></CategoryEditor>
          </TreeItem>
        </TreeView>
      </div>
    )
  }

  return (
    <div id="admin-page" data-testid='admin'>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        TransitionProps={{ onExited: handleSnackBarExited }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%', marginTop: 10 }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ flexGrow: 1, display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <ButtonGroup color='secondary' variant='outlined' size='large' sx={{ marginLeft: "auto" }}>
              <Button>Analytics</Button>
              <Button onClick={() => document.getElementById('videos-title')?.scrollIntoView(true)}>Videos</Button>
              <Button onClick={signOut}>Logout</Button>
            </ButtonGroup>
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer
        sx={{ width: "250px", flexShrink: 0, '& .MuiDrawer-paper': { width: "250px", boxSizing: 'border-box', }, }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List sx={{ padding: 3 }}>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            <b><i>Welcome,</i></b>
          </Typography>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {currentUser?.email?.split('@')[0]}
          </Typography>
        </List>
        <Divider />
        <List sx={{ padding: 3 }}>
          <Typography color="secondary" variant="h4" component="div" sx={{ flexGrow: 1 }}>
            <TreeIcon icon={<Construction/>} tooltipText='Coming Soon...'></TreeIcon>
            Tools 
          </Typography>
          <Typography variant="subtitle1">Expand All</Typography>
          <Typography variant="subtitle1">Collapse All</Typography>
          <Typography variant="subtitle1">Search</Typography>
        </List>
      </Drawer>
      
      {/* videos-title id not used in css file, used for "scroll into view" videos button in app bar */}
      <Typography id="videos-title" color="secondary" variant='h1' textAlign={"center"}>videos</Typography>
      {displayTreeComponent()}

    </div>
  );
}
