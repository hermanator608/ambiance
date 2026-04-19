import React, { useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import { AuthContext } from "./AuthProvider";
import { collection, getFirestore, onSnapshot, doc, updateDoc, setDoc, deleteDoc, getDoc, Timestamp } from "firebase/firestore";
import { EditVideoFn, DeleteVideoFn, AddVideoFn, AddCategoryFn, DeleteCategoryFn, EditCategoryFn } from './types';
import { AmbianceCategory } from './config/ambiance/types';
import { AmbianceDisplayType } from "./types";
import { groupVideosBySubcategory } from "./util/groupVideoBySubcategory";
import { TreeIcon } from './components/TreeIcon';
import { Icon, toIconId } from './components/Icon';
import { AMBIANCE_COLLECTION, AUTO_HIDE_SNACKBAR } from './constants';
import VideoEditor from './components/VideoEditor';
import CategoryEditor from './components/CategoryEditor';
import cloneDeep from 'lodash.clonedeep';
//MUI Imports
import { Alert, Button, ButtonGroup, Snackbar, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import Construction from '@mui/icons-material/Construction';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { TreeItem  } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { AlertProps } from '@mui/material';

type ReportInfo = {
  count: number;
  lastReportedAtMs?: number;
};

function formatReportTooltip(reportInfo: ReportInfo): string {
  const last = reportInfo.lastReportedAtMs ? new Date(reportInfo.lastReportedAtMs).toLocaleString() : undefined;
  return `Reports: ${reportInfo.count}${last ? ` • Last: ${last}` : ''}`;
}

function toMillis(value: unknown): number | undefined {
  if (!value) return undefined;
  if (value instanceof Timestamp) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof (value as any).toMillis === 'function') return (value as any).toMillis();
  return undefined;
}

function VideoEditExpandIcon() {
  return <BuildCircleIcon color="secondary" fontSize="small" />;
}

function AddExpandIcon() {
  return <AddIcon color="secondary" fontSize="small" />;
}

function ReportBadge({ reportInfo }: { reportInfo?: ReportInfo }) {
  if (!reportInfo || reportInfo.count <= 0) {
    return null;
  }

  return (
    <Tooltip title={formatReportTooltip(reportInfo)}>
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'error.main', flexShrink: 0 }}>
        <ReportProblemIcon fontSize="small" color="error" />
        <Typography component="span" variant="body2" sx={{ color: 'error.main', fontWeight: 700 }}>
          {reportInfo.count}
        </Typography>
      </Box>
    </Tooltip>
  );
}


export default function AdminPage() {
  const db = getFirestore();
  const { currentUser, signOut } = useContext(AuthContext);
  const [data, setData] = useState<Record<string, AmbianceCategory>>();
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [reportsByCategoryAndCode, setReportsByCategoryAndCode] = useState<Record<string, Record<string, ReportInfo>>>({});
  const [showReportedOnly, setShowReportedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const expandedItemsBeforeReportedRef = useRef<string[] | null>(null);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertProps["severity"]>("info");
  const [snackPack, setSnackPack] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [allNodeIds, setAllNodeIds] = useState<string[]>([]);

  const collapseItem = (itemId: string) => {
    setExpandedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const expandItems = (itemIds: string[]) => {
    setExpandedItems((prev) => Array.from(new Set([...prev, ...itemIds])));
  };

  const expandToVideo = (categoryId: string, subcategory: string, videoCode: string) => {
    const subcategoryId = categoryId + subcategory;
    const videoItemId = categoryId + subcategory + videoCode + 'edit_video';
    expandItems([categoryId, subcategoryId, videoItemId]);
  };

  const getReportCount = (categoryId: string, videoCode: string): number => {
    return reportsByCategoryAndCode?.[categoryId]?.[videoCode]?.count ?? 0;
  };

  // Get data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, AMBIANCE_COLLECTION), (snapshot) => {
      const dataMap = snapshot.docs.reduce<Record<string, AmbianceCategory>>((obj, item) => {
        obj[item.id] = item.data() as AmbianceCategory

        return obj;
      }, {});

      setData(dataMap);
      updateNodeIds(dataMap);

    });

    return unsubscribe;
  }, [db, setData]);

  // Get reports from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const next: Record<string, Record<string, ReportInfo>> = {};

      snapshot.docs.forEach((d) => {
        const data = d.data() as any;
        const categoryId = data.categoryId as string | undefined;
        const code = data.videoCode as string | undefined;
        const count = data.count as number | undefined;
        const lastReportedAtMs = toMillis(data.lastReportedAt);

        if (!categoryId || !code || typeof count !== 'number') return;
        if (!next[categoryId]) next[categoryId] = {};
        next[categoryId][code] = { count, lastReportedAtMs };
      });

      setReportsByCategoryAndCode(next);
    });

    return unsubscribe;
  }, [db]);

  
  // Snackbar section
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


  /**
   * Handle user selected nodes
   */
  const handleExpandedItemsChange = (
    event: React.SyntheticEvent | null,
    itemIds: string[],
  ) => {
    setExpandedItems(itemIds);
  };

  /**
   * Clears expanded items if any are open, else expands all categories and subcategories
   */
  const handleExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0
        ? allNodeIds
        : [],
    );
  };

  /**
   * Generate list of all node ids for categories and subcategories and updates allNodeIds state 
   */
  const updateNodeIds = (dataMap: Record<string, AmbianceCategory>): void => {
    if (!dataMap) {
      return;
    }

    const videosBySubCat = groupVideosBySubcategory(dataMap);
    const expandedItems: string[] = [];

    Object.entries(videosBySubCat).forEach(([documentID, subcategoryGrouping]) => {
      expandedItems.push(documentID);
      Object.keys(subcategoryGrouping.videosBySubcategory).forEach((subcategory) => {
        expandedItems.push(documentID + subcategory);
      })
    })

    setAllNodeIds(expandedItems);
  }

  const getReportedExpandedNodeIds = (): string[] => {
    if (!data) {
      return [];
    }

    const grouped: AmbianceDisplayType = groupVideosBySubcategory(data);
    const ids = new Set<string>();

    Object.entries(grouped).forEach(([documentId, display]) => {
      Object.entries(display.videosBySubcategory).forEach(([subcategory, vids]) => {
        const hasReportedVideo = vids.some((vid) => getReportCount(documentId, vid.code) > 0);
        if (!hasReportedVideo) return;
        ids.add(documentId);
        ids.add(documentId + subcategory);
      });
    });

    return Array.from(ids);
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
    }).catch(() => {
      setAlertSeverity("error");
      handleAddSnackBarMessage("An error occurred. " + newData.name + " not updated.");
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
    }).catch(() => {
      setAlertSeverity("error");
      handleAddSnackBarMessage("An error occurred. " + videoToDelete?.name + " not removed.");
    });
  }

  const addVideo: AddVideoFn = async (documentId, newData) => {
    if (!data) {
      console.error("Ambiance data not available when attempting to addVideo");
      throw new Error('Ambiance data not available');
    }

    const newVideos = cloneDeep(data[documentId].videos);
    newVideos.push(newData);

    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);
    try {
      await updateDoc(docRef, {
        videos: newVideos
      });
      setAlertSeverity("success");
      handleAddSnackBarMessage("Successfully added video - " + newData.name);
    } catch (err) {
      setAlertSeverity("error");
      handleAddSnackBarMessage("An error occurred. " + newData.name + " not added.");
      throw err;
    }
  }

  const addCategory: AddCategoryFn = async (documentId, documentName, icon) => {
    const docRef = doc(db, AMBIANCE_COLLECTION, documentId);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAlertSeverity("error");
        handleAddSnackBarMessage("Ambiance Category - " + documentId + " already exists");
        throw new Error('Category already exists');
      }

      await setDoc(doc(db, AMBIANCE_COLLECTION, documentId), {
        name: documentName,
        icon: icon,
        videos: []
      });

      setAlertSeverity("success");
      handleAddSnackBarMessage("Successfully added category - " + documentId);
    } catch (err) {
      // If we already reported a specific error (exists), don't overwrite.
      if ((err as any)?.message !== 'Category already exists') {
        setAlertSeverity("error");
        handleAddSnackBarMessage("An error occurred. " + documentId + " category not added.");
      }
      throw err;
    }
  }

  const editCategory: EditCategoryFn = async (documentId, documentName, icon) => {
    updateDoc(doc(db, AMBIANCE_COLLECTION, documentId), {
      name: documentName,
      icon: icon,
    }).then(() => {
      setAlertSeverity("success");
      handleAddSnackBarMessage("Successfully updated category - " + documentId);
    }).catch(() => {
      setAlertSeverity("error");
      handleAddSnackBarMessage("An error occurred. " + documentId + " category not updated.");
    });
  }

  const deleteCategory: DeleteCategoryFn = async (documentId) => {
    deleteDoc(doc(db, AMBIANCE_COLLECTION, documentId)).then(() => {
      setAlertSeverity("success");
      handleAddSnackBarMessage("Removed category - " + documentId);
    }).catch(() => {
      setAlertSeverity("error");
      handleAddSnackBarMessage("An error occurred. " + documentId + " category not removed.");
    });
  }

  const handleCategoryAdded = (categoryId: string) => {
    // Close the "Add New Ambiance Category" panel and open the newly created category editor.
    setExpandedItems((prev) => {
      const next = prev.filter((id) => id !== 'add_category');
      next.push(categoryId);
      return Array.from(new Set(next));
    });
    setEditingCategoryId(categoryId);
  };


  /**
   * Handles the tree display which takes all videos from each document / parent category
   * and groups them by the sub category field on a video for better display
   * @returns Tree view of all categories and videos grouped by subcategory 
   */
  const displayTreeComponent = () => {
    if (!data) {
      console.error("Ambiance data not available when attempting to displayTreeComponent");
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    const isSearching = query.length > 0;
    const hideCreateNodes = showReportedOnly || isSearching;

    // Map of documentId -> (Map of subcategory name -> videos in subcategory)
    const newData: AmbianceDisplayType = groupVideosBySubcategory(data);

    // key = ambiance category, i.e., animalCrossing, bg3
    const elements = Object.entries(newData).flatMap(([documentId, ambianceDisplay]) => {
      const iconId = toIconId(data?.[documentId]?.icon);
      const categoryMatches = isSearching
        ? (ambianceDisplay.friendlyName ?? '').toLowerCase().includes(query) || documentId.toLowerCase().includes(query)
        : false;

      const filteredSubcategories = Object.entries(ambianceDisplay.videosBySubcategory).flatMap(([subcategory, vids]) => {
        const subcategoryMatches = isSearching ? subcategory.toLowerCase().includes(query) : false;

        const filteredVids = showReportedOnly
          ? vids.filter((vid) => getReportCount(documentId, vid.code) > 0)
          : vids;

        const searchedVids = isSearching
          ? filteredVids.filter((vid) => {
              if (categoryMatches || subcategoryMatches) return true;
              const name = (vid.name ?? '').toLowerCase();
              const code = (vid.code ?? '').toLowerCase();
              return name.includes(query) || code.includes(query);
            })
          : filteredVids;

        if (searchedVids.length === 0) {
          return [];
        }

        return [[subcategory, searchedVids] as const];
      });

      if (showReportedOnly && filteredSubcategories.length === 0) {
        return [];
      }

      if (isSearching && !categoryMatches && filteredSubcategories.length === 0) {
        return [];
      }

      const categoryVideoCount = filteredSubcategories.reduce((acc, [, vids]) => acc + vids.length, 0);
      const newVideoItemId = documentId + "new_video";

      return [(
      <TreeItem
        sx={{ padding: 1 }}
        key={documentId}
        itemId={documentId}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              {iconId ? (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                  <Icon icon={iconId} />
                </Box>
              ) : null}
              <Typography variant='h6' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ambianceDisplay.friendlyName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>({categoryVideoCount})</Typography>
            </Box>
            <TreeIcon
              tooltipText={editingCategoryId === documentId ? 'Close Category Editor' : 'Edit Category'}
              icon={<BuildCircleIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setEditingCategoryId((prev) => (prev === documentId ? null : documentId));
                setExpandedItems((prev) => (prev.includes(documentId) ? prev : [...prev, documentId]));
              }}
            />
          </Box>
        }
      >
        {editingCategoryId === documentId && (
          <Box sx={{ paddingLeft: 4, paddingTop: 1, paddingBottom: 1 }} onClick={(e) => e.stopPropagation()}>
            <CategoryEditor
              editCategory={editCategory}
              deleteCategory={deleteCategory}
              categoryID={documentId}
              categoryDetails={data[documentId]}
            />
          </Box>
        )}
        <Divider />
        {filteredSubcategories.map(([subcategory, vids]) => {
          const subcategoryAddItemId = documentId + subcategory + "add_video";

          return (
            <TreeItem
              key={documentId + subcategory}
              itemId={documentId + subcategory}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Typography variant='subtitle1' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {subcategory}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>({vids.length})</Typography>
                </Box>
              }
            >
            {vids.map((vid) => {
              const reportInfo = reportsByCategoryAndCode?.[documentId]?.[vid.code];

              return (
              <TreeItem
                key={documentId + subcategory + vid.code + "edit_video"}
                itemId={documentId + subcategory + vid.code + "edit_video"}
                slots={{ expandIcon: VideoEditExpandIcon, collapseIcon: VideoEditExpandIcon }}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, width: '100%' }}>
                    <Typography sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {vid.name}{vid.invalid ? ' (invalid)' : ''}
                    </Typography>
                    <ReportBadge reportInfo={reportInfo} />
                  </Box>
                }
              >
                <VideoEditor currentVideo={vid} documentId={documentId} editVideo={editVideo} deleteVideo={deleteVideo} />
              </TreeItem>
              );
            })}
            {!hideCreateNodes ? (
              <TreeItem
                key={subcategoryAddItemId}
                itemId={subcategoryAddItemId}
                slots={{ expandIcon: AddExpandIcon, collapseIcon: AddExpandIcon }}
                label={<Typography variant="body2" sx={{ fontStyle: 'italic' }}>Add video</Typography>}
              >
                <VideoEditor
                  documentId={documentId}
                  addVideo={async (docId, newData) => {
                    await addVideo(docId, newData);
                    collapseItem(subcategoryAddItemId);
                    expandToVideo(docId, subcategory, newData.code);
                  }}
                  currentVideo={{ group: subcategory }}
                ></VideoEditor>
              </TreeItem>
            ) : null}
            </TreeItem>
          );
        })}
        {!hideCreateNodes ? (
          <TreeItem
            key={newVideoItemId}
            itemId={newVideoItemId}
            slots={{ expandIcon: AddExpandIcon, collapseIcon: AddExpandIcon }}
            label={<Typography variant="body2" sx={{ fontStyle: 'italic' }}>Add video in a new subcategory</Typography>}
          >
            <VideoEditor
              documentId={documentId}
              addVideo={async (docId, newData) => {
                await addVideo(docId, newData);
                collapseItem(newVideoItemId);
                expandToVideo(docId, newData.group, newData.code);
              }}
            ></VideoEditor>
          </TreeItem>
        ) : null}
      </TreeItem>
      )];
    });

    return (
      <div id='tree-view'>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
          aria-label="file system navigator"
          slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
          sx={{ height: '100%', flexGrow: 1, maxWidth: 900, overflowY: 'auto', paddingLeft: 10 }}
        >
          {elements}
          {!hideCreateNodes ? (
            <TreeItem
              sx={{ padding: 1 }}
              itemId='add_category'
              slots={{ expandIcon: AddExpandIcon, collapseIcon: AddExpandIcon }}
              label={<Typography variant='h6'><i>Add New Ambiance Category</i></Typography>}
            >
              <Divider />
              <CategoryEditor addCategory={addCategory} onAddSuccess={handleCategoryAdded}></CategoryEditor>
            </TreeItem>
          ) : null}
        </SimpleTreeView>
      </div>
    )
  }

  return (
    <div id="admin-page" data-testid='admin'>
      <Snackbar
        open={open}
        autoHideDuration={AUTO_HIDE_SNACKBAR}
        onClose={handleCloseSnackBar}
        slotProps={{ transition: { onExited: handleSnackBarExited } }}
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
          <Typography
            variant="h4"
            sx={{ flexGrow: 1, maxWidth: '100%', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            title={currentUser?.email?.split('@')[0]}
          >
            {currentUser?.email?.split('@')[0]}
          </Typography>
        </List>
        <Divider />
        <List sx={{ padding: 3 }}>
          <Typography color="secondary" variant="h4" component="div" sx={{ flexGrow: 1 }}>
            <TreeIcon icon={<Construction />} tooltipText='Coming Soon...'></TreeIcon>
            Tools
          </Typography>

          <TextField
            sx={{ marginTop: 3 }}
            label="Search"
            size='small'
            color='warning'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            sx={{ marginTop: 2 }}
            color={showReportedOnly ? 'error' : 'warning'}
            variant={showReportedOnly ? 'contained' : 'outlined'}
            onClick={() => {
              setShowReportedOnly((prev) => {
                const next = !prev;

                if (next) {
                  expandedItemsBeforeReportedRef.current = expandedItems;
                  setExpandedItems(getReportedExpandedNodeIds());
                } else {
                  setExpandedItems(expandedItemsBeforeReportedRef.current ?? []);
                  expandedItemsBeforeReportedRef.current = null;
                }

                return next;
              });
            }}
          >
            {showReportedOnly ? 'Viewing reported' : 'View reported'}
          </Button>
          <Button sx={{ marginTop: 2 }} color='warning' onClick={handleExpandClick}>
            {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
          </Button>
        </List>
      </Drawer>

      {/* videos-title id not used in css file, used for "scroll into view" videos button in app bar */}
      <Typography id="videos-title" color="secondary" variant='h1' sx={{ textAlign: 'center' }}>videos</Typography>
      {displayTreeComponent()}

    </div>
  );
}
