import { getAnalytics, logEvent as logEventFirebase} from "firebase/analytics"

type OnClickWrapperProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  eventData: Record<string, string> & {
    actionId?: string;
  }
}

const logEvent = (eventData: OnClickWrapperProps['eventData']): void => {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  const analytics = getAnalytics();
  logEventFirebase(analytics, 'button_click', eventData);
}

export const logEventClickWrapper = (props: OnClickWrapperProps): React.MouseEventHandler<HTMLButtonElement> => {
  const {onClick, eventData} = props

  const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    logEvent(eventData)

    onClick?.(event)
  }

  return onClickHandler
}
