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

const CreateClass = props => {
 
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    room_no: '',
    
  });

  const saveClass = () => {
    if (values.room_no.trim() === '') {
      setErrorMessage('Please provide room number');
    } else {
      axios
        .post(
          url + '/class',
          {
            room_no: values.room_no,
            
            
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
    saveClass(); // Save  when form is submitted
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
        <CardHeader title="Class registration" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Room Number"
                name="room_no"
                readOnly={false}
                onChange={handleChange}
                required
                //value={destination_branch}

                variant="outlined"
              />
            </Grid>
                     
           
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

export default CreateClass;
