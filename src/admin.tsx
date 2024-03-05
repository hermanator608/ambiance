import React, { useContext, useEffect, useState } from 'react';
import './index.css';
import { AuthContext } from "./AuthProvider";
import { Button, ButtonGroup } from '@mui/material';
import { collection, getFirestore, onSnapshot, DocumentData } from "firebase/firestore";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';


export default function AdminPage() {
  const db = getFirestore();
  const { currentUser, signOut } = useContext(AuthContext);
  const [data, setData] = useState<DocumentData[]>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ambiance"), (snapshot) => {
      setData((snapshot.docs.map(doc => doc.data())));
    });

    return unsubscribe;
  }, [db]);


  const displayTreeComponent = () => {
    if (!data) {
      return;
    }
    // Group by subcategory
    const newData: Record<string, DocumentData> = {};
    data?.forEach((category) => {
      const groupedVideos: Record<string, DocumentData> = {};
      category.videos.forEach((vid: DocumentData) => {
        if (groupedVideos[vid.group]) {
          groupedVideos[vid.group] = groupedVideos[vid.group].concat(vid);
        } else {
          groupedVideos[vid.group] = [vid];
        }
      });

      newData[category.name] = groupedVideos;
    })

    const elements = Object.entries(newData).map(([key, groupedVideos]) => (
      <TreeItem className='tree-item' key={key} nodeId={key} label={key} sx={{textAlign: 'left'}}>
        {Object.entries(groupedVideos).map(([subcategory, vids]) => (
          <TreeItem key={key + subcategory} nodeId={key + subcategory} label={subcategory} sx={{textAlign: 'left'}}>
            {(vids as any).map((vid: DocumentData) => (
              <TreeItem key={vid.name} nodeId={vid.name} label={vid.name} sx={{textAlign: 'left'}} />
            ))}
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
            <ButtonGroup variant='outlined' size='large' sx={{ bgcolor: 'black'}}>
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



