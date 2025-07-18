import { Navigate, Outlet, useRoutes } from "react-router";
import path from "./constants/path";

import { lazy } from "react";
import { useAuthenticatedStore } from "./stores/useAuthenticatedStore";

const CardReview = lazy(() => import("./pages/CardReview"));
const Layout = lazy(() => import("./layouts/Layout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const DeckList = lazy(() => import("./pages/DeckList"));
const DeckCards = lazy(() => import("./pages/DeckCards"));
const AllCards = lazy(() => import("./pages/AllCards"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Account = lazy(() => import("./pages/Account"));
const Home = lazy(() => import("./pages/Home"));

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
