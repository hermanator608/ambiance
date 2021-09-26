import React from 'react';
import Button from './Button';

const text = 'Checkout the vibes on';

export const Twitter: React.FC = () => {
  return (
    <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text,
        )}&url=${encodeURIComponent('https://ambiance.dev')}`}
      >
      <Button icon='twitter' />
    </a>
  );
};
