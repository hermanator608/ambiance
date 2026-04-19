import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import type { MouseEventHandler, ReactElement } from 'react';

type TreeIconProps = {
  tooltipText: string;
  icon: ReactElement;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export function TreeIcon({ tooltipText, icon, onClick, disabled }: TreeIconProps) {

  return (
    <Tooltip title={tooltipText}>
      <IconButton color="secondary" size="small" onClick={onClick} disabled={disabled}>
        {icon}
      </IconButton>
    </Tooltip>
  )
}
