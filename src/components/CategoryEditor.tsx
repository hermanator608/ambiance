import React, { useState } from 'react';
import '../index.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AddCategoryFn, DeleteCategoryFn, EditCategoryFn } from '../types';
import { AmbianceCategory } from '../config/ambiance/types';


type CategoryEditorProps = {
  editCategory?: EditCategoryFn,
  deleteCategory?: DeleteCategoryFn,
  addCategory?: AddCategoryFn,
  categoryDetails?: Partial<AmbianceCategory>,
  categoryID?: string
}

export default function CategoryEditor(props: CategoryEditorProps) {
  const { editCategory, deleteCategory, addCategory, categoryDetails, categoryID } = props;
  const [localCategoryID, setLocalCategoryID] = useState<string | undefined>(categoryID);
  const [category, setCategory] = useState<Partial<AmbianceCategory> | undefined>(categoryDetails);
  const [showDeleteAlert, setShowDeleteAlert] = useState<Boolean>(false);
  const [showEditAlert, setShowEditAlert] = useState<Boolean>(false);
  const [deleteCategoryID, setDeleteCategoryID] = useState<string>("");

  const verifyDelete = () => {
    setShowDeleteAlert(true);
  }

  const verifyEdit = () => {
    setShowEditAlert(true);
  }

  const clearDeleteAlert = () => {
    setShowDeleteAlert(false);
    setDeleteCategoryID("");
  }

  const saveChanges = () => {
    if (addCategory) {
      addCategoryAction();
    } else {
      editCategoryAction();
    }
    setShowEditAlert(false);
  }

  const editCategoryAction = () => {
    if (!editCategory || !localCategoryID || !category?.name || !category?.icon) {
      return;
    }
    editCategory(localCategoryID, category.name, category.icon);
  }

  const deleteCategoryAction = () => {
    if (!deleteCategory || !localCategoryID || !category?.name || !category?.icon) {
      return;
    }

    if (deleteCategoryID !== localCategoryID) {
      return;
    }

    deleteCategory(localCategoryID);
    setShowDeleteAlert(false);
  }

  const addCategoryAction = () => {
    if (!addCategory || !localCategoryID || !category?.name || !category?.icon) {
      return;
    }
    addCategory(localCategoryID, category.name, category.icon)
    setCategory({ icon: "", name: "" });
    setLocalCategoryID("");
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof AmbianceCategory) => {
    const newCategoryData: Partial<AmbianceCategory> = {
      ...category,
      [key]: event.target.value
    }
    setCategory(newCategoryData);
  }

  const handleOnChangeDelete = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDeleteCategoryID(event.target.value);
  }

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      {addCategory
        ? <TextField required color="secondary" size='small' label="Category ID" variant="outlined"
          value={localCategoryID}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setLocalCategoryID(event.target.value);
          }}
        />
        :
        <TextField color="secondary" size='small' label="Category ID" variant="outlined"
          value={categoryID}
          disabled
        />
      }
      <TextField required color="secondary" size='small' label="Friendly Name" variant="outlined"
        value={category?.name}
        onChange={(e) => handleOnChange(e, "name")}
      />
      <TextField required color="secondary" size='small' label="Icon" variant="outlined"
        value={category?.icon}
        onChange={(e) => handleOnChange(e, "icon")}
      />

      <Button
        color="secondary"
        variant='contained'
        disabled={!!showDeleteAlert}
        onClick={verifyEdit}
      >
        Save
      </Button>
      {!addCategory &&
        <Button
          color='error'
          variant='contained'
          onClick={verifyDelete} disabled={!!showDeleteAlert}
        >
          Delete
        </Button>
      }

      {showEditAlert &&
        <Stack>
          <Alert
            severity="error"
            variant='outlined'
            action={
              <Stack direction="row">
                <Button sx={{ color: "white" }} size="small" onClick={saveChanges}>YES</Button>
                <Button sx={{ color: "white" }} size="small" onClick={() => setShowEditAlert(false)}>NO</Button>
              </Stack>
            }
          >
            <AlertTitle>Save Changes?</AlertTitle>
            This action cannot be undone
          </Alert>
        </Stack>
      }

      {showDeleteAlert &&
        <Alert severity='error' color="error" variant='outlined'>
          <AlertTitle>WARNING</AlertTitle>
          Deleting an Ambiance category will delete ALL associated videos.
          This action cannot be undone.
          If you're sure you want to proceed, please type the Category ID below:<br />
          <TextField
            required
            label="Category ID"
            color="error"
            size='small'
            sx={{ margin: 1 }}
            value={deleteCategoryID}
            onChange={(e) => handleOnChangeDelete(e)}
          />
          <Stack direction="row">
            <Button
              sx={{ margin: 1 }}
              variant="contained"
              color='secondary'
              onClick={clearDeleteAlert}
            >
              Cancel
            </Button>
            <Button
              sx={{ margin: 1 }}
              variant="contained"
              color='error'
              onClick={deleteCategoryAction}
            >
              Delete
            </Button>
          </Stack>
        </Alert>
      }
    </Box>
  )
}