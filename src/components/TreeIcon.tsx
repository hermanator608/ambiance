import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ReactElement } from 'react';


export const TreeIcon: React.FC<{ tooltipText: string, icon: ReactElement }> = ({ tooltipText, icon }) => {

  return (
    <Tooltip title={tooltipText}>
      <IconButton color="secondary" size="small">
        {icon}
      </IconButton>
    </Tooltip>
  )
}