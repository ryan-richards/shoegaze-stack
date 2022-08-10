import type { LinksFunction } from "@remix-run/node";
import { Outlet, useNavigate } from "@remix-run/react";
import { CatchBoundary, Document, ErrorBoundary } from "~/lib/root";
import globalStylesUrl from "~/lib/styles/global.css";
import 'focus-visible/dist/focus-visible';

// https://remix.run/api/app#links
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

const App = () => {

  return (
    <Document>
      <Outlet />
    </Document>
  );
};

export { ErrorBoundary, CatchBoundary };

export default App;
