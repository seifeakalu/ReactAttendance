import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Navigate } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { url } from '../../url';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Page from 'src/components/Page';
window.$branch = 'sese';
window.$position = 'kaaka';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const [role, setRole] = React.useState('');
  var urlPart = '';
  const handleChangeSelect = event => {
    setRole(event.target.value);
  };

  const submitHandler = e => {
    e.preventDefault();
    Login(details);
    console.log('login details are ' + details.name, details.password);
  };
  const [user, setUser] = useState({ name: '', email: '' });
  const [ResponseMessage, setResponseMessage] = useState('');
  const [details, setDetails] = useState({ name: '', password: '' });
  const [isLoggedIn, setAuthorized] = useState(false);
  const [adminLogged, setAdminLogged] = useState(false);
  const [studentLogged, setStudentLogged] = useState(false);
  const [instructorLogged, setInstructorLogged] = useState(false);
  const Login = details => {
    // console.log(details);

    if (details.name.trim() === '') {
      setResponseMessage('Please enter your username');
    } else if (details.password.trim() === '') {
      setResponseMessage('Please enter your password');
    } else {
      setResponseMessage('Loading');
      axios
        .post(
          url + '/admin_login',
          {
            username: details.name,
            password: details.password
          },
          { withCredentials: true }
        )
        .then(
          login => {
         
            if (login.data.result.success) {
              //localStorage.setItem('branch', login.data.branch);
            //  localStorage.setItem('position', login.data.position);             
              setStudentLogged(login.data.result.studentLogged);
              setInstructorLogged(login.data.result.instractorLogged);
              setAdminLogged(login.data.result.adminLogged);
              //$branch=login.data.result.adminLogged;
              ///
              localStorage.setItem('branch', "Seife"+' '+"Akalu");
              localStorage.setItem('position', "Admin");
              setResponseMessage('Success');
            } else {
              setResponseMessage(login.data.result.message);
            }
            /* */
          },
          error => {
            setResponseMessage(
              'Connection to the server failed , please try again :)'
            );
          }
        );
    }
  };

  useEffect(() => {
    setRole(10);
    axios.post(url + '/autorized', {}, { withCredentials: true }).then(
      authorized => {
        console.log('authorized opened');
        console.log(authorized.data);
        if (authorized.data.authorized) {
          console.log(authorized.data.authorized);
        
          if (authorized.data.BOResourceLogged) {
            setAdminLogged(true);
          } else {
            setAuthorized(true);
          }
        }
        if (!authorized.data.authorized) {
          setAuthorized(false);
        }
        /* */
      },
      error => {}
    );
  }, []);
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        {adminLogged ? <Navigate to="/attendance/app/department" /> : ''}
        {studentLogged ? <Navigate to="/attendance/app/customers" /> : ''}

        <Container maxWidth="sm">
          {ResponseMessage == 'Loading' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            ''
          )}
          <Formik>
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={submitHandler}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    {ResponseMessage != '' ? (
                      <div className="error">
                        <Alert severity="warning">{ResponseMessage}</Alert>
                      </div>
                    ) : (
                      ''
                    )}
                    Sign in As Admin{' '}
                  
                  </Typography>

                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in with admin username and password
                  </Typography>
                </Box>

                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Username"
                  margin="normal"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  id="name"
                  onChange={e =>
                    setDetails({ ...details, name: e.target.value })
                  }
                  value={details.name}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  id="password"
                  onChange={e =>
                    setDetails({ ...details, password: e.target.value })
                  }
                  value={details.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                    fullWidth
                    size="medium"
                    type="submit"
                    color="primary"
                  >
                    Sign in now
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
