import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import SpotsList from './components/SpotsList/SpotsList';
import SpotDetails from './components/SpotDetailsPage/SpotDetails';
import CreateSpotForm from './components/CreateSpotFormPage/CreateSpotForm';
import ManageSpots from './components/SpotsList/ManageSpots';
import UpdateSpotForm from './components/UpdateSpotFormPage/UpdateSpotForm';
import './index.css';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && <Outlet/>}
    </>
  );
}



const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
  {
    path: '/',
    element: <SpotsList />,
  },
  {
    path: '/spots/:spotId',
    element: <SpotDetails />,
  },
  {
    path: '/spots/new',
    element: <CreateSpotForm />,
  },
  {
    path: '/manage-spots',
    element: <ManageSpots />
  },
  {
    path: '/spots/:spotId/edit',
    element: <UpdateSpotForm />
  }
 ]
}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
