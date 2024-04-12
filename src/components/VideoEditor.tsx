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
import { EditVideoFn, DeleteVideoFn, AddVideoFn } from '../types';


type VideoEditorProps = {
  documentId: string,
  currentVideo?: Partial<Ambiance>,
  editVideo?: EditVideoFn,
  deleteVideo?: DeleteVideoFn,
  addVideo?: AddVideoFn
}


export default function VideoEditor(props: VideoEditorProps) {
  const { currentVideo, documentId, editVideo, deleteVideo, addVideo } = props;
  const [showDeleteAlert, setShowDeleteAlert] = useState<Boolean>(false);
  const [showEditAlert, setShowEditAlert] = useState<Boolean>(false);
  const [localVideo, setLocalVideo] = useState<Partial<Ambiance> | undefined>(currentVideo);

  const verifyDelete = () => {
    setShowDeleteAlert(true);
  }

  const verifyEdit = () => {
    setShowEditAlert(true);
  }

  const deleteAction = () => {
    if (!currentVideo?.code || !deleteVideo) {
      return;
    }

    deleteVideo(documentId, currentVideo.code);
    setShowDeleteAlert(false);
  }

  const editVideoAction = () => {
    if (!localVideo || !currentVideo?.code || !editVideo) {
      return;
    }

    if (!localVideo.name || !localVideo.code || !localVideo.group) {
      alert("Name, Code, and Group are required");
      return;
    }

    editVideo(documentId, currentVideo.code, localVideo as Ambiance)
    setShowEditAlert(false);
  }

  const addVideoAction = () => {
    if (!localVideo || !addVideo) {
      return;
    }

    if (!localVideo.name || !localVideo.code || !localVideo.group) {
      alert("Name, Code, and Group are required");
      return;
    }

    addVideo(documentId, localVideo as Ambiance);
    setLocalVideo({});
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Ambiance) => {
    const newVidData: Partial<Ambiance> = {
      ...localVideo,
      [key]: event.target.value
    }
    setLocalVideo(newVidData);
  }

  const handleOnChangeBoolean = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Ambiance) => {
    const localBoolean = event.target.value === "true";
    const newVidData: Partial<Ambiance> = {
      ...localVideo,
      [key]: localBoolean
    }
    setLocalVideo(newVidData);
  }

  const handleOnChangeInteger = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Ambiance) => {
    let localInteger: number;

    if(!event.target.value) {
      localInteger = 0;
    } else {
      localInteger = parseInt(event.target.value);

      if (isNaN(localInteger)) {
        alert("Cannot set " + key + " to integer from the value: " + event.target.value);
        return;
      }
    }

    const newVidData: Partial<Ambiance> = {
      ...localVideo,
      [key]: localInteger
    }
    setLocalVideo(newVidData);
  }

  const handleOnChangeChannel = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Channel) => {
    let newChannel: Channel;
    if (key === "name") {
      newChannel = {
        link: localVideo?.channel?.link || "",
        name: event.currentTarget.value
      }
    } else {
      newChannel = {
        link: event.currentTarget.value,
        name: localVideo?.channel?.name || "",
      }
    }

    const newVidData: Partial<Ambiance> = {
      ...localVideo,
      channel: newChannel
    }
    setLocalVideo(newVidData);
  }


  return (
    <div id='Video-Editor'>
      <Stack className='text-field-stack' direction="column" spacing={1}>
        <TextField
          defaultValue={localVideo?.name}
          onChange={(e) => handleOnChange(e, "name")}
          helperText="Display Name"
          size='small'
          variant="filled"
          required
          value={localVideo?.name || ""}
        />
        <TextField
          defaultValue={localVideo?.group}
          onChange={(e) => handleOnChange(e, "group")}
          helperText="Subcategory"
          variant="filled"
          size='small'
          required
          value={localVideo?.group || ""}
        />
        <TextField
          defaultValue={localVideo?.code}
          onChange={(e) => handleOnChange(e, "code")}
          helperText="YouTube URL"
          variant="filled"
          size='small'
          required
          value={localVideo?.code || ""}
        />
        <TextField
          defaultValue={localVideo?.channel?.name}
          onChange={(e) => handleOnChangeChannel(e, "name")}
          helperText="Optional: YouTube channel Name"
          variant="filled"
          size='small'
          value={localVideo?.channel?.name || ""}
        />
        <TextField
          defaultValue={localVideo?.channel?.link}
          onChange={(e) => handleOnChangeChannel(e, "link")}
          helperText="Optional: YouTube channel Link"
          variant="filled"
          size='small'
          value={localVideo?.channel?.link || ""}
        />
        <TextField
          defaultValue={localVideo?.startTimeS}
          onChange={(e) => handleOnChangeInteger(e, "startTimeS")}
          helperText="Optional: Video start time (seconds)"
          variant="filled"
          size='small'
          type='number'
          inputProps={{min: "0"}}
          value={localVideo?.startTimeS}
        />
        <TextField
          defaultValue={localVideo?.livestream ? "Yes" : "No"}
          onChange={(e) => handleOnChangeBoolean(e, "livestream")}
          helperText="Optional: Yes / No livestream"
          variant="filled"
          size='small'
          select
          value={localVideo?.livestream}
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

      {editVideo &&
        <Stack className="button-stack" direction="row" spacing={10}>
          <Button onClick={verifyEdit} disabled={!!showEditAlert || !!showDeleteAlert} size='small' variant="contained" color='secondary'>Save Changes</Button>
          <Button onClick={verifyDelete} disabled={!!showEditAlert || !!showDeleteAlert} variant="outlined" color="error">Delete Video</Button>
        </Stack>
      }

      {addVideo &&
        <Stack className="button-stack" direction="row" spacing={10}>
          <Button onClick={addVideoAction} size='small' variant="contained" color='secondary'>Add Video</Button>
        </Stack>
      }
    </div>
  )

}