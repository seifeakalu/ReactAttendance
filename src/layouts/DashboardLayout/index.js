import React, { useEffect,useState } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../url';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = () => {
  const [navigate, setNavigation] = useState(false);
  useEffect(() => {
  
    isLogged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isLogged = () => {
    
    console.log('called ,');
  
    axios.post(url + '/admin_authorize', {}, { withCredentials: true }).then(
      authorized => {
        console.log('authorized opened');
        console.log(authorized.data);
        if (!authorized.data.authorized) {
          setNavigation(true);
        }
  
        /* */
      },
      error => {
       
  
        alert('Connection to the server failed , please try again :)))');
      }
    );
  };
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      {navigate ? <Navigate to="/attendance/login" /> : ''}
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
