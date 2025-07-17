import { Navigate, Outlet, useRoutes } from "react-router";
import path from "./constants/path";
import Home from "./pages/Home";
import CardReview from "./pages/CardReview";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import { useAuthenticatedStore } from "./stores/useAuthenticatedStore";
import Register from "./pages/Register";
import DeckList from "./pages/DeckList";
import DeckCards from "./pages/DeckCards";
import AllCards from "./pages/AllCards";
import Feedback from "./pages/Feedback";
import Notifications from "./pages/Notifications";
import Account from "./pages/Account";

function ProtectedRoute() {
  const isAuthenticated = useAuthenticatedStore(
    (state) => state.isAuthenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}
function RejectedRoute() {
  const isAuthenticated = useAuthenticatedStore(
    (state) => state.isAuthenticated
  );
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

export default function useRouteElements() {
  const element = useRoutes([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          path: path.home,
          element: <Home />,
        },
      ],
    },
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: "",
          element: <Layout />,
          children: [
            {
              path: path.login,
              element: <Login />,
            },
            {
              path: path.register,
              element: <Register />,
            },
          ],
        },
      ],
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <Layout />,
          children: [
            {
              path: path.deck,
              element: <DeckList />,
            },
            {
              path: path.cards,
              element: <DeckCards />,
            },
            {
              path: path.cardReview,
              element: <CardReview />,
            },
            {
              path: path.allCards,
              element: <AllCards />,
            },
            {
              path: path.feedback,
              element: <Feedback />,
            },
            {
              path: path.notifications,
              element: <Notifications />,
            },
            {
              path: path.account,
              element: <Account />,
            },
          ],
        },
      ],
    },
  ]);
  return element;
}
