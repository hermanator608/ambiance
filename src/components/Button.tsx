import React from "react";
// import ReactTooltip from "react-tooltip";
import { Icon, IconProps } from "./Icon";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string
  tooltip?: string
  icon?: IconProps['icon']
  highlighted?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  style,
  className,
  tooltip,
  icon,
  text,
  highlighted
}) => {
  return (
    <>
      {/* {tooltip && <ReactTooltip place="top" type="dark" effect="solid"/>} */}
      <button
        data-tip={tooltip}
        onClick={onClick}
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          ...style,
          ...(text ? {} : { lineHeight: 0 }),
          ...(highlighted ? { filter: 'var(--yellow-glow-drop-shadow)' } : {}),
        }}
        className={className}
        title={tooltip}
      >
        {icon && <Icon icon={icon} />}
        {text && <span style={{ marginLeft: 8 }}>{text}</span>}
      </button>
    </>
  );
}

export default Button;
