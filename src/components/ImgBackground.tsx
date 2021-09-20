import React from 'react'

type ImgBackgroundProps = {
  show: boolean
  src: string
}

export const ImgBackground: React.FC<ImgBackgroundProps> = ({ show, src }) => {
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
