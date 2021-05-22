import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { url } from '../../url';

const CreateDepartment = props => {
 
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    name: '',
    description: ''
  });

  const saveDepartment = () => {
    if (values.name.trim() === '') {
      setErrorMessage('Please provide department name');
    } else {
      axios
        .post(
          url + '/department',
          {
            name: values.name,
            description: values.description,
            
          },
          { withCredentials: true }
        )
        .then(
          data => {
            window.location.reload(false);

            /* */
          },
          error => {
            alert('Connection to the server failed');
          }
        );
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    saveDepartment(); // Save  when form is submitted
  };
  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {}, []);

  return (
    <form
      autoComplete="off"
      noValidate
      // className={clsx(classes.root, className)}
      // {...rest}
      onSubmit={handleSubmit}
    >
      <Card>
        {errorMessage != '' ? (
          <div className="error">
            <Alert severity="warning">{errorMessage}</Alert>
          </div>
        ) : (
          ''
        )}
        <CardHeader title="Department registration" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="department name"
                name="name"
                readOnly={false}
                onChange={handleChange}
                required
                //value={destination_branch}

                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                readOnly={false}
                onChange={handleChange}
                required
                aria-label="minimum height"
                variant="outlined"
              />
            </Grid>
       
           
            <Grid item md={6} xs={12}></Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" variant="contained" type="submit">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default CreateDepartment;
