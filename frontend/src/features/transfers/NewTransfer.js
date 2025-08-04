import React from 'react';
import { CssBaseline, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { selectAllUsers } from '../users/usersApiSlice';
import TransferForm from './TransferForm';
import useTitle from '../../hooks/useTitle';
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useLocation } from 'react-router-dom'; // Add this import

const NewTransfer = () => {
  useTitle('ArecGIS | Transfer Inventory');
  const { username, isManager, isAdmin } = useAuth();
  const allUsers = useSelector(selectAllUsers);
  const location = useLocation(); // Get location from react-router
  const inventory = location.state?.inventory; // Extract inventory from state
  
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

  let content;
  
  if (isLoading) {
    content = (
      <>
        <CssBaseline/>
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item>
            <MoonLoader color={"#fffdd0"} />
          </Grid>
        </Grid>
      </>
    );
  } else if (isError) {
    content = (
      <>
        <CssBaseline/>
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item>
            <p>{error?.data?.message || "An error occurred"}</p>
          </Grid>
        </Grid>
      </>
    );
  } else if (isSuccess) {
    content = allUsers ? (
      <TransferForm allUsers={allUsers} inventory={inventory} /> // Pass inventory to form
    ) : (
      <>
        <CssBaseline/>
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item>
            <MoonLoader color={"#fffdd0"} />
          </Grid>
        </Grid>
      </>
    );
  }

  return content;
};

export default NewTransfer;