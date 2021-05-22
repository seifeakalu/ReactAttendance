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

const CreateSemister = props => {
  const [year, setYear] = useState([]);
  const [dataFetchedYear, setDataFetchedYear] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    semister_no: '',
    year_of_id: ''
  });

  const getYear = () => {
    setDataFetchedYear(false);
    axios
      .get(`${url}/year`, {
        withCredentials: true
      })
      .then(resp => {
        setYear({});

        setYear(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedYear(true);
      })
      .catch(err => {
        setYear({});
        setDataFetchedYear(true);
      });
  };
  useEffect(() => {
    getYear();
  }, []);
  const saveSemister = () => {
    if (values.semister_no.trim() === '') {
      setErrorMessage('Please provide semister number');
    } else if (values.year_of_id == 0) {
        setErrorMessage('Please provide year');
      }else {
      axios
        .post(
          url + '/semister',
          {
            semister_no: values.semister_no,
            year_of_id: values.year_of_id
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
    saveSemister(); // Save  when form is submitted
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
        <CardHeader title="Semister registration" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="semister number"
                name="semister_no"
                readOnly={false}
                onChange={handleChange}
                required
                //value={destination_branch}

                variant="outlined"
              />
            </Grid>
            {dataFetchedYear ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Accadamic Year"
                  name="year_of_id"
                  onChange={handleChange}
                  required
                  select
                  error={
                    values.actions == -1
                      ? values.inputError
                        ? true
                        : false
                      : ''
                  }
                  SelectProps={{ native: true }}
                  // value={values.customerAction}
                  variant="outlined"
                >
                  <option
                    key={0}
                    value={0}
                    //selected={customer_contact == option.value}
                  >
                    {'select year'}
                  </option>
                  {year.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      //selected={customer_contact == option.value}
                    >
                      {option.year_date}
                    </option>
                  ))}
                </TextField>
              </Grid>
            ) : (
              ''
            )}

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

export default CreateSemister;
