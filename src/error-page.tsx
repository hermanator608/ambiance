import { useRouteError } from "react-router-dom";


export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">

      <h1>Whoops!</h1>
      <p>If you're here, that means an error occurred.</p>

    </div>
  )
}