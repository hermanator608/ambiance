import React, { useState } from 'react';
import '../index.css';
import { Ambiance } from '../config/ambiance/types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Channel } from '../config/ambiance/channels';


type VideoEditorProps = {
  documentId: string,
  video?: Partial<Ambiance>,
  videoUrlCode?: string,
  editVideo?: (documentId: string, videoUrlCode: string, newData: Ambiance) => void,
  deleteVideo?: (documentId: string, videoUrlCode: string) => void,
  addVideo?: (documentId: string, newData: Ambiance) => void
}


export default function VideoEditor(props: VideoEditorProps) {
  const { video, documentId, videoUrlCode, editVideo, deleteVideo, addVideo } = props;
  const [showDeleteAlert, setShowDeleteAlert] = useState<Boolean>(false);
  const [showEditAlert, setShowEditAlert] = useState<Boolean>(false);
  const [vidData, setVidData] = useState<Partial<Ambiance> | undefined>(video);

  const verifyDelete = () => {
    setShowDeleteAlert(true);
  }

  const verifyEdit = () => {
    setShowEditAlert(true);
  }

  const deleteAction = () => {
    if (!videoUrlCode || !deleteVideo) {
      return;
    }

    deleteVideo(documentId, videoUrlCode);
    setShowDeleteAlert(false);
  }

  const editVideoAction = () => {
    if (!vidData || !videoUrlCode || !editVideo) {
      return;
    }

    if (!vidData.name || !vidData.code || !vidData.group) {
      alert("Name, Code, and Group are required");
      return;
    }

    editVideo(documentId, videoUrlCode, vidData as Ambiance);
    setShowEditAlert(false);
  }

  const addVideoAction = () => {
    if (!vidData || !addVideo) {
      return;
    }

    if (!vidData.name || !vidData.code || !vidData.group) {
      alert("Name, Code, and Group are required");
      return;
    }

    addVideo(documentId, vidData as Ambiance);
    setVidData({});
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Ambiance) => {
    const newVidData: Partial<Ambiance> = {
      ...vidData,
      [key]: event.target.value
    }
    setVidData(newVidData);
  }

  const handleOnChangeChannel = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Channel) => {
    let newChannel: Channel;
    if (key === "name") {
      newChannel = {
        link: vidData?.channel?.link || "",
        name: event.currentTarget.value
      }
    } else {
      newChannel = {
        link: event.currentTarget.value,
        name: vidData?.channel?.name || "",
      }
    }

    const newVidData: Partial<Ambiance> = {
      ...vidData,
      channel: newChannel
    }
    setVidData(newVidData);
  }


  return (
    <div id='Video-Editor'>
      <Stack className='text-field-stack' direction="column" spacing={.4}>
        <TextField
          sx={{ '& .dsoQSg': { paddingTop: '10px' } }}
          defaultValue={vidData?.name}
          onChange={(e) => handleOnChange(e, "name")}
          helperText="Display Name"
          size='small'
          variant="filled"
          required
          value={vidData?.name || ""}
        />
        <TextField
          sx={{ '& .dsoQSg': { paddingTop: '10px' } }}
          defaultValue={vidData?.group}
          onChange={(e) => handleOnChange(e, "group")}
          helperText="Subcategory"
          variant="filled"
          size='small'
          required
          value={vidData?.group || ""}
        />
        <TextField
          sx={{ '& .dsoQSg': { paddingTop: '10px' } }}
          defaultValue={vidData?.code}
          onChange={(e) => handleOnChange(e, "code")}
          helperText="YouTube URL"
          variant="filled"
          size='small'
          required
          value={vidData?.code || ""}
        />
        <TextField
          sx={{ '& .dsoQSg': { paddingTop: '10px' } }}
          defaultValue={vidData?.channel?.name}
          onChange={(e) => handleOnChangeChannel(e, "name")}
          helperText="Optional: YouTube channel Name"
          variant="filled"
          size='small'
          value={vidData?.channel?.name || ""}
        />
        <TextField
          sx={{ '& .dsoQSg': { paddingTop: '10px' } }}
          defaultValue={vidData?.channel?.link}
          onChange={(e) => handleOnChangeChannel(e, "link")}
          helperText="Optional: YouTube channel Link"
          variant="filled"
          size='small'
          value={vidData?.channel?.link || ""}
        />
        <TextField
          sx={{ '& .dsoQSg': { paddingTop: '10px' } }}
          defaultValue={vidData?.startTimeS}
          onChange={(e) => handleOnChange(e, "startTimeS")}
          helperText="Optional: Video start time (seconds)"
          variant="filled"
          size='small'
          value={vidData?.startTimeS || ""}
        />
        <TextField
          sx={{ '& .dsoQSg': { paddingTop: '10px' } }}
          defaultValue={vidData?.livestream ? "Yes" : "No"}
          onChange={(e) => handleOnChange(e, "livestream")}
          helperText="Optional: Yes / No livestream"
          variant="filled"
          size='small'
          select
          value={vidData?.livestream || ""}
        >
          <MenuItem key="true" value="true">Yes</MenuItem>
          <MenuItem key="false" value="false">No</MenuItem>
        </TextField>
      </Stack>


      {showDeleteAlert &&
        <Stack>
          <Alert
            severity="error"
            action={
              <Stack direction="row">
                <Button color="inherit" size="small" onClick={deleteAction}>YES</Button>
                <Button color="inherit" size="small" onClick={() => setShowDeleteAlert(false)}>NO</Button>
              </Stack>
            }
          >
            <AlertTitle>Delete Video?</AlertTitle>
            This cannot be undone
          </Alert>
        </Stack>
      }

      {showEditAlert &&
        <Stack>
          <Alert
            severity="error"
            action={
              <Stack direction="row">
                <Button color="inherit" size="small" onClick={editVideoAction}>YES</Button>
                <Button color="inherit" size="small" onClick={() => setShowEditAlert(false)}>NO</Button>
              </Stack>
            }
          >
            <AlertTitle>Save Changes?</AlertTitle>
            This action cannot be undone
          </Alert>
        </Stack>
      }

      {!addVideo &&
        <Stack className="button-stack" direction="row" spacing={10}>
          <Button onClick={verifyEdit} disabled={!!showEditAlert || !!showDeleteAlert} size='small' variant="contained" color='secondary'>Save Changes</Button>
          <Button onClick={verifyDelete} disabled={!!showEditAlert || !!showDeleteAlert} variant="outlined" color="error">Delete Video</Button>
        </Stack>
      }

      {!editVideo &&
        <Stack className="button-stack" direction="row" spacing={10}>
          <Button onClick={addVideoAction} size='small' variant="contained" color='secondary'>Add Video</Button>
        </Stack>
      }
    </div>
  )

}