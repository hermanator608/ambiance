import React, { useState } from 'react';
import '../index.css';
import { AmbianceCategory } from '../config/ambiance/types';
import { AddCategoryFn, DeleteCategoryFn, EditCategoryFn } from '../types';
import { Icon, KNOWN_ICON_NAMES, toKnownIconName } from './Icon';

//MUI Imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

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
  const normalizeCategory = (details?: Partial<AmbianceCategory>): Partial<AmbianceCategory> => {
    return {
      ...(details ?? {}),
      icon: toKnownIconName(details?.icon) ?? '',
    };
  };

  const [category, setCategory] = useState<Partial<AmbianceCategory> | undefined>(() => normalizeCategory(categoryDetails));
  const [showDeleteAlert, setShowDeleteAlert] = useState<Boolean>(false);
  const [showEditAlert, setShowEditAlert] = useState<Boolean>(false);
  const [deleteCategoryID, setDeleteCategoryID] = useState<string>("");

  const normalizedIconValue = toKnownIconName(category?.icon) ?? '';

  const canSave = !!localCategoryID && !!category?.name && !!normalizedIconValue;

  const verifyDelete = () => {
    setShowDeleteAlert(true);
  }

  const verifyEdit = () => {
    if (!canSave) {
      return;
    }

    // Creating a new category should save immediately (no confirmation).
    if (addCategory) {
      saveChanges();
      return;
    }
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
    if (!editCategory || !localCategoryID || !category?.name || !normalizedIconValue) {
      return;
    }
    editCategory(localCategoryID, category.name, normalizedIconValue);
  }

  const deleteCategoryAction = () => {
    if (!deleteCategory || !localCategoryID) {
      return;
    }

    if (deleteCategoryID !== localCategoryID) {
      return;
    }

    deleteCategory(localCategoryID);
    setShowDeleteAlert(false);
  }

  const addCategoryAction = () => {
    if (!addCategory || !localCategoryID || !category?.name || !normalizedIconValue) {
      return;
    }
    addCategory(localCategoryID, category.name, normalizedIconValue)
    setCategory({ icon: '', name: '' });
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

  const stopTreeKeyDown: React.KeyboardEventHandler = (e) => {
    e.stopPropagation();
  }

  return (
    <Box component="form" noValidate autoComplete="off" sx={{'& > :not(style)': { m: 1 }}}>
      {addCategory
        ? <TextField 
            required 
            color="secondary" 
            size='small' 
            label="Category ID" 
            variant="outlined"
            value={localCategoryID}
            onKeyDown={stopTreeKeyDown}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLocalCategoryID(event.target.value);
            }}
            error={!localCategoryID}
            helperText={!localCategoryID ? 'Required' : ' '}
          />
        : <TextField 
            color="secondary" 
            size='small' 
            label="Category ID" 
            variant="outlined"
            value={categoryID}
            disabled
            onKeyDown={stopTreeKeyDown}
          />
      }

      <TextField 
        required 
        color="secondary" 
        size='small' 
        label="Friendly Name" 
        variant="outlined"
        value={category?.name}
        onKeyDown={stopTreeKeyDown}
        onChange={(e) => handleOnChange(e, "name")}
        error={!category?.name}
        helperText={!category?.name ? 'Required' : ' '}
      />
      <TextField 
        required 
        color="secondary" 
        size='small' 
        label="Icon"
        variant="outlined"
        select
        value={normalizedIconValue}
        onKeyDown={stopTreeKeyDown}
        onChange={(e) => handleOnChange(e, "icon")}
        error={!normalizedIconValue}
        helperText={!normalizedIconValue ? 'Required (fixed set)' : ' '}
        slotProps={{
          select: {
            renderValue: (selected: unknown) => {
              const selectedValue = String(selected ?? '');
              const iconName = toKnownIconName(selectedValue);
              if (!iconName) {
                return '(no icon)';
              }

              return (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon={iconName} />
                  {iconName}
                </span>
              );
            },
          },
        }}
      >
        <MenuItem value="">(no icon)</MenuItem>
        {KNOWN_ICON_NAMES.map((iconName) => (
          <MenuItem key={iconName} value={iconName}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon icon={iconName} />
              {iconName}
            </span>
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="button"
        color="secondary"
        variant='contained'
        disabled={!canSave || !!showDeleteAlert || !!showEditAlert}
        onClick={verifyEdit}
      >
        Save
      </Button>

      {!addCategory &&
        <Button
          type="button"
          color='error'
          variant='contained'
          disabled={!!showDeleteAlert || !!showEditAlert}
          onClick={verifyDelete}
        >
          Delete
        </Button>
      }

      {showEditAlert && !addCategory &&
        <Alert severity="error" variant='outlined'
          action={
            <Stack direction="row">
              <Button type="button" sx={{ color: "white" }} size="small" onClick={saveChanges}>YES</Button>
              <Button type="button" sx={{ color: "white" }} size="small" onClick={() => setShowEditAlert(false)}>NO</Button>
            </Stack>
          }
        >
          <AlertTitle>Save Changes?</AlertTitle>
          This action cannot be undone
        </Alert>
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
            onKeyDown={stopTreeKeyDown}
            onChange={(e) => handleOnChangeDelete(e)}
          />
          <Stack direction="row">
            <Button type="button" sx={{ margin: 1 }} variant="contained" color='secondary' onClick={clearDeleteAlert}>
              Cancel
            </Button>
            <Button type="button" sx={{ margin: 1 }} variant="contained" color='error' onClick={deleteCategoryAction}>
              Delete
            </Button>
          </Stack>
        </Alert>
      }

    </Box>
  )
}
