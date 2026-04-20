import React, { useEffect, useState } from 'react';
import '../index.css';
import { AmbianceCategory } from '../config/ambiance/types';
import { AddCategoryFn, DeleteCategoryFn, EditCategoryFn } from '../types';
import { Icon, IMG_ICON_NAMES, toIconId, validateIconId, type IconId } from './Icon';

//MUI Imports
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

type CategoryEditorProps = {
  editCategory?: EditCategoryFn,
  deleteCategory?: DeleteCategoryFn,
  addCategory?: AddCategoryFn,
  onAddSuccess?: (categoryId: string) => void,
  categoryDetails?: Partial<AmbianceCategory>,
  categoryID?: string
}

export default function CategoryEditor(props: CategoryEditorProps) {
  const { editCategory, deleteCategory, addCategory, onAddSuccess, categoryDetails, categoryID } = props;
  const [localCategoryID, setLocalCategoryID] = useState<string | undefined>(categoryID);
  const normalizeCategory = (details?: Partial<AmbianceCategory>): Partial<AmbianceCategory> => {
    return {
      ...(details ?? {}),
      // Preserve the raw stored value so we don't silently wipe an unknown icon id.
      // Validation happens via `toIconId()` when determining `canSave`.
      icon: details?.icon ?? '',
    };
  };

  const [category, setCategory] = useState<Partial<AmbianceCategory> | undefined>(() => normalizeCategory(categoryDetails));
  const [showDeleteAlert, setShowDeleteAlert] = useState<Boolean>(false);
  const [showEditAlert, setShowEditAlert] = useState<Boolean>(false);
  const [deleteCategoryID, setDeleteCategoryID] = useState<string>("");
  const [validatedIconId, setValidatedIconId] = useState<IconId | ''>(() => {
    const initial = (categoryDetails?.icon ?? '').trim();
    return toIconId(initial) ?? '';
  });
  const [isIconValidating, setIsIconValidating] = useState(false);

  const rawIconValue = (category?.icon ?? '').trim();
  const normalizedIconValue = validatedIconId;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const value = rawIconValue.trim();
      if (!value) {
        setValidatedIconId('');
        setIsIconValidating(false);
        return;
      }

      setIsIconValidating(true);
      const resolved = await validateIconId(value);
      if (cancelled) return;

      setValidatedIconId(resolved ?? '');
      setIsIconValidating(false);
    };

    void run().catch(() => {
      if (cancelled) return;
      setValidatedIconId('');
      setIsIconValidating(false);
    });

    return () => {
      cancelled = true;
    };
  }, [rawIconValue]);

  const canSave = !!localCategoryID && !!category?.name && !!normalizedIconValue && !isIconValidating;

  const verifyDelete = () => {
    setShowDeleteAlert(true);
  }

  const verifyEdit = () => {
    if (!canSave) {
      return;
    }

    // Creating a new category should save immediately (no confirmation).
    if (addCategory) {
      void saveChanges();
      return;
    }
    setShowEditAlert(true);
  }

  const clearDeleteAlert = () => {
    setShowDeleteAlert(false);
    setDeleteCategoryID("");
  }

  const saveChanges = async () => {
    if (addCategory) {
      await addCategoryAction();
    } else {
      await editCategoryAction();
    }
    setShowEditAlert(false);
  }

  const editCategoryAction = async () => {
    if (!editCategory || !localCategoryID || !category?.name || !normalizedIconValue) {
      return;
    }
    await editCategory(localCategoryID, category.name, normalizedIconValue);
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

  const addCategoryAction = async () => {
    if (!addCategory || !localCategoryID || !category?.name || !normalizedIconValue) {
      return;
    }

    try {
      await addCategory(localCategoryID, category.name, normalizedIconValue);
      setCategory({ icon: '', name: '' });
      setLocalCategoryID("");
      onAddSuccess?.(localCategoryID);
    } catch {
      // Errors/snackbars are handled by the caller.
    }
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
      <Autocomplete
        freeSolo
        options={IMG_ICON_NAMES as unknown as string[]}
        value={rawIconValue}
        inputValue={rawIconValue}
        onChange={(_event, value) => {
          const nextValue = String(value ?? '').trim();
          setCategory((prev) => ({
            ...(prev ?? {}),
            icon: nextValue,
          }));
        }}
        onInputChange={(_event, value) => {
          setCategory((prev) => ({
            ...(prev ?? {}),
            icon: value,
          }));
        }}
        renderOption={(props, option) => {
          const iconId = toIconId(option);
          return (
            <Box component="li" {...props}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 30, display: 'inline-flex', justifyContent: 'center' }}>
                  {iconId ? <Icon icon={iconId} /> : null}
                </span>
                {option}
              </span>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            color="secondary"
            size="small"
            label="Icon"
            variant="outlined"
            onKeyDown={stopTreeKeyDown}
            error={!normalizedIconValue && !isIconValidating}
            helperText={
              <span>
                Choose a built-in image icon from the dropdown, or paste an icon name from{' '}
                <a href="https://react-icons.github.io/react-icons/icons/gi" target="_blank" rel="noreferrer">Game Icons (Gi)</a>,{' '}
                <a href="https://react-icons.github.io/react-icons/icons/fa" target="_blank" rel="noreferrer">Font Awesome (Fa)</a>, or{' '}
                <a href="https://react-icons.github.io/react-icons/icons/md" target="_blank" rel="noreferrer">Material Design (Md)</a>{' '}
                (example: <code>GiCampfire</code>). 
                
                To add a new custom built-in icon, the icon file must be added to the repo and registered in{' '}
                <code>IconMap</code>/<code>ImgMap</code>.

                {isIconValidating ? (
                  <>
                    <br />
                    Validating icon…
                  </>
                ) : rawIconValue && !normalizedIconValue ? (
                  <>
                    <br />
                    Icon not found.
                  </>
                ) : null}
              </span>
            }
            slotProps={{
              ...(params as any).slotProps,
              input: {
                ...((params as any).slotProps?.input ?? {}),
                startAdornment: normalizedIconValue ? (
                  <InputAdornment position="start">
                    <Icon icon={normalizedIconValue} />
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
        )}
      />

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
