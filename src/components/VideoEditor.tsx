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

    if (!event.target.value) {
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
      <Stack component='form' className='text-field-stack' direction="column" spacing={2}>
        <TextField
          onChange={(e) => handleOnChange(e, "name")}
          label="Video Name"
          size='small'
          variant="outlined"
          required
          color='secondary'
          value={localVideo?.name || ""}
        />
        <TextField
          onChange={(e) => handleOnChange(e, "group")}
          label="Subcategory"
          variant="outlined"
          size='small'
          required
          color='secondary'
          value={localVideo?.group || ""}
        />
        <TextField
          onChange={(e) => handleOnChange(e, "code")}
          label="YouTube Watch Code"
          variant="outlined"
          size='small'
          required
          color='secondary'
          value={localVideo?.code || ""}
        />
        <TextField
          onChange={(e) => handleOnChangeChannel(e, "name")}
          label="YouTube Channel"
          variant="outlined"
          size='small'
          color='secondary'
          value={localVideo?.channel?.name || ""}
        />
        <TextField
          onChange={(e) => handleOnChangeChannel(e, "link")}
          label="YouTube Channel Link"
          variant="outlined"
          size='small'
          color='secondary'
          value={localVideo?.channel?.link || ""}
        />
        <TextField
          onChange={(e) => handleOnChangeInteger(e, "startTimeS")}
          label="Video Start Time"
          variant="outlined"
          size='small'
          type='number'
          color='secondary'
          inputProps={{ min: "0" }}
          value={localVideo?.startTimeS}
        />
        <TextField
          onChange={(e) => handleOnChangeBoolean(e, "livestream")}
          label="LiveStream"
          variant="outlined"
          size='small'
          color='secondary'
          select
          value={!!localVideo?.livestream}
        >
          <MenuItem key="true" value="true">True</MenuItem>
          <MenuItem key="false" value="false">False</MenuItem>
        </TextField>
      </Stack>


      {showDeleteAlert &&
        <Stack>
          <Alert
            severity="error"
            variant='outlined'
            action={
              <Stack direction="row">
                <Button sx={{ color: "white" }} size="small" onClick={deleteAction}>YES</Button>
                <Button sx={{ color: "white" }} size="small" onClick={() => setShowDeleteAlert(false)}>NO</Button>
              </Stack>
            }
          >
            <AlertTitle>Delete Video?</AlertTitle>
            This action cannot be undone
          </Alert>
        </Stack>
      }

      {showEditAlert &&
        <Stack>
          <Alert
            severity="error"
            variant='outlined'
            action={
              <Stack direction="row">
                <Button sx={{ color: "white" }} size="small" onClick={editVideoAction}>YES</Button>
                <Button sx={{ color: "white" }} color='secondary' size="small" onClick={() => setShowEditAlert(false)}>NO</Button>
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
          <Button
            onClick={verifyEdit}
            disabled={!!showEditAlert || !!showDeleteAlert}
            size='small'
            variant="contained"
            color='secondary'
          >
            Save Changes
          </Button>
          <Button
            onClick={verifyDelete}
            disabled={!!showEditAlert || !!showDeleteAlert}
            variant="contained"
            color="error"
          >
            Delete Video
          </Button>
        </Stack>
      }

      {addVideo &&
        <Stack className="button-stack" direction="row" spacing={10}>
          <Button color="secondary" onClick={addVideoAction} size='small' variant="contained">Add Video</Button>
        </Stack>
      }
    </div>
  )

}