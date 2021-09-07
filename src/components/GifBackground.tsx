import React from 'react'

type GifBackgroundProps = {
  show: boolean
  src: string
}

export const GifBackground: React.FC<GifBackgroundProps> = ({ show, src }) => {
  if (!show) return null;
  return (
    <img
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: "0",
        left: "0",
        objectFit: "cover",
        zIndex: 0,
      }}
      src={src}
      alt=""
    />
  );
}
