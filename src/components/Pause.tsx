import { useMediaQuery } from '@mui/material';
import styled from 'styled-components';

const Area = styled.div`
  position: absolute;
  top: 35%;
  right: 35%;
  bottom: 35%;
  left: 35%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Pause: React.FC<{
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}> = ({ isPlaying, setIsPlaying }) => {
  const matches = useMediaQuery('(min-width:500px)');

  function togglePlaying() {
    setIsPlaying(!isPlaying);
  }

  return matches ? <Area className="pause" onClick={togglePlaying} /> : null;
};
