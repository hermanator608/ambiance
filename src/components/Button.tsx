import React from "react";
// import ReactTooltip from "react-tooltip";
import { Icon, IconName } from "./Icon";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string
  tooltip?: string
  icon?: IconName
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  style,
  className,
  tooltip,
  icon,
  text
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
