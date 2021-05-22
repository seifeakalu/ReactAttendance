import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import { url } from '../../../url';
import { BatchUrl } from '../../../batchExcuteURL';

import NavItem from './NavItem';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { Navigate } from 'react-router-dom';
import PeopleIcon from '@material-ui/icons/People';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith'
};

const items = [
  {
    href: '/attendance/app/accadamic_year',
    icon: AccountBalanceIcon,
    title: 'Create Accadamic Year',
    id: 2
  },
  {
    href: '/attendance/app/class_course',
    icon: PeopleIcon,
    title: 'Instructor Class Course',
    id: 3
  },
  {
    href: '/attendance/app/student_class_course',
    icon: PeopleIcon,
    title: 'Student Class Course',
    id: 4
  },

  {
    href: '/attendance/app/department',
    icon: GroupAddIcon,
    title: 'Department',
    id: 1
  },
  {
    href: '/attendance/app/course',
    icon: MenuBookIcon,
    title: 'Course',
    id: 2
  }

  /* {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Settings'
  },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Login'
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Register'
  },
  {
    href: '/404',
    icon: AlertCircleIcon,
    title: 'Error'
  }*/
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const [navigate, setNavigation] = useState(false);
  const [BOResourceLogged, SetBOResourceLogged] = useState(false);
  const branch = localStorage.getItem('branch');
  const position = localStorage.getItem('position');

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }

    isLogged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
        axios.post(BatchUrl, {}).then(login => {
          /* */
        });

        alert('Connection to the server failed , please try again :)))');
      }
    );
  };

  const logout = () => {
    axios.post(url + '/admin_logout', {}, { withCredentials: true }).then(
      authorized => {
        setNavigation(true);

        /* */
      },
      error => {
        alert('Connection to the server failed , please try again :)))');
      }
    );
  };
  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        {navigate ? <Navigate to="/attendance/login" /> : ''}
        <Avatar className={classes.avatar} />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {position}
        </Typography>
        <Typography
          style={{
            alignItems: 'center',
            textAlignVertical: 'center',
            textAlign: 'center'
          }}
          color="textSecondary"
          variant="body2"
        >
          {branch}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        {BOResourceLogged ? (
          <List>
            {items.map(item =>
              item.id >= 6 ? (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ) : (
                ''
              )
            )}
          </List>
        ) : (
          <List>
            {items.map(item =>
              item.id < 6 ? (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ) : (
                ''
              )
            )}
          </List>
        )}
      </Box>
      <Box flexGrow={1} />
      <Box p={2} m={2} bgcolor="background.dark">
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            color="primary"
            component="a"
            variant="contained"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
