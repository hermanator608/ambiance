import React, { useEffect, useState } from 'react';

export const DotDotDot: React.FC = () => {
  const [dotState, setDotState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        const newDotState = (dotState + 1) % 4
        setDotState(newDotState)
      }, 500);

      return () => {
        clearInterval(interval)
      }
  }, [dotState, setDotState]);

  const dots = []
  for (let i = 0; i < dotState; i++) {
    dots.push('.')
  }

  return (
    <span>{dots}</span>
  )
}
