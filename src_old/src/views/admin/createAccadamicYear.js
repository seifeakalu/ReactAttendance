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

const CreateAccadamicYear = props => {
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    name: '',
    description: '',
    department_id: 0,
    class_id: 0,
    semister_id: 0,
    year_of_id: 0
  });

  const saveStream = () => {
    if (values.name.trim() === '') {
      setErrorMessage('Please provide stream name');
    } else if (values.department_id == 0) {
      setErrorMessage('Please provide department');
    } else if (values.year_of_id == 0) {
      setErrorMessage('Please provide year');
    } else if (values.class_id == 0) {
      setErrorMessage('Please provide class');
    } else if (values.semister_id == 0) {
      setErrorMessage('Please provide semister');
    } else {
      axios
        .post(
          url + '/stream',
          {
            name: values.name,
            description: values.description,
            department_id: values.department_id,
            class_id: values.class_id,
            semister_id: values.semister_id,
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

  const [semister, setSemister] = useState([]);
  const [department, setDepartment] = useState([]);
  const [year, setYear] = useState([]);
  const [classResult, setClass] = useState([]);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [dataFetchedYear, setDataFetchedYear] = useState(false);
  const [dataFetchedDept, setDataFetchedDept] = useState(false);
  const [dataFetchedClass, setDataFetchedClass] = useState(false);
  const handleSubmit = event => {
    console.log('called');
    event.preventDefault();
    saveStream(); // Save  when form is submitted
  };
  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const getSemister = () => {
    setDataFetched(false);
    axios
      .get(`${url}/semister`, {
        withCredentials: true
      })
      .then(resp => {
        setSemister({});

        setSemister(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetched(true);
      })
      .catch(err => {
        setSemister({});
        setDataFetched(true);
      });
  };
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
  const getClass = () => {
    setDataFetchedClass(false);
    axios
      .get(`${url}/class`, {
        withCredentials: true
      })
      .then(resp => {
        setClass({});

        setClass(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedClass(true);
      })
      .catch(err => {
        setClass({});
        setDataFetchedClass(true);
      });
  };
  const getDepartment = () => {
    setDataFetchedDept(false);
    axios
      .get(`${url}/all_department`, {
        withCredentials: true
      })
      .then(resp => {
        setDepartment({});

        setDepartment(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedDept(true);
      })
      .catch(err => {
        setDepartment({});
        setDataFetchedDept(true);
      });
  };
  useEffect(() => {
    getSemister();
    getYear();
    getClass();
    getDepartment();
  }, []);

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
        <CardHeader title="Stream registration" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Stream name"
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
            {dataFetchedDept ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department_id"
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
                    {'select department'}
                  </option>
                  {department.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      //selected={customer_contact == option.value}
                    >
                      {option.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
            ) : (
              ''
            )}
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
            {dataFetchedClass ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Class"
                  name="class_id"
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
                    {'select class'}
                  </option>
                  {classResult.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      //selected={customer_contact == option.value}
                    >
                      {option.room_no}
                    </option>
                  ))}
                </TextField>
              </Grid>
            ) : (
              ''
            )}
            {dataFetched ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Semister"
                  name="semister_id"
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
                    {'select semister'}
                  </option>
                  {semister.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      //selected={customer_contact == option.value}
                    >
                      {option.semister_no}
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

export default CreateAccadamicYear;
