import { getAnalytics, logEvent } from "firebase/analytics"

type OnClickWrapperProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  eventData: Record<string, string> & {
    actionId?: string;
  }
}

export const logEventClickWrapper = (props: OnClickWrapperProps): React.MouseEventHandler<HTMLButtonElement> => {
  const {onClick, eventData} = props

  const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const analytics = getAnalytics();
    logEvent(analytics, 'button_click', eventData);

    onClick?.(event)
  }

  return onClickHandler
}
