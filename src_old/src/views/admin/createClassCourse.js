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

const CreateClassCourse = props => {
  const [classes, setClass] = useState([]);
  const [course, setCourse] = useState([]);
  const [instructor, setInstructor] = useState([]);
  const [stream, setStream] = useState([]);
  const [dataFetchedClass, setDataFetchedClass] = useState(false);
  const [dataFetchedCourse, setDataFetchedCourse] = useState(false);
  const [dataFetchedInstructor, setDataFetchedInstructor] = useState(false);
  const [dataFetchedStream, setDataFetchedStream] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    class_id: 0,
    course_id: 0,
    instructor_id: 0,
    stream_id: 0,
  });
  const getInstructor = () => {
    setDataFetchedInstructor(false);
    axios
      .get(`${url}/instructor`, {
        withCredentials: true
      })
      .then(resp => {
        setInstructor({});

        setInstructor(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedInstructor(true);
      })
      .catch(err => {
        setInstructor({});
        setDataFetchedInstructor(true);
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
  const getCourse = () => {
    setDataFetchedCourse(false);
    axios
      .get(`${url}/course_all`, {
        withCredentials: true
      })
      .then(resp => {
        setCourse({});

        setCourse(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedCourse(true);
      })
      .catch(err => {
        setCourse({});
        setDataFetchedCourse(true);
      });
  };
  const getStream = () => {
    setDataFetchedStream(false);
    axios
      .get(`${url}/all_stream`, {
        withCredentials: true
      })
      .then(resp => {
        setStream({});

        setStream(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedStream(true);
      })
      .catch(err => {
        setStream({});
        setDataFetchedStream(true);
      });
  };
  useEffect(() => {
    getClass();
    getCourse();
    getInstructor();
    getStream();
  }, []);
  const saveClassCourse = () => {
    if (values.instructor_id == 0) {
      setErrorMessage('Please provide instructor');
    } else if (values.class_id === 0) {
      setErrorMessage('Please provide class');
    } else if (values.course_id == 0) {
      setErrorMessage('Please provide course');
    } else if (values.stream_id == 0) {
      setErrorMessage('Please provide course');
    } else {
      axios
        .post(
          url + '/class_course',
          {
            class_id: values.class_id,
            course_id: values.course_id,
            instructor_id: values.instructor_id,
            stream_id: values.stream_id,
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
    saveClassCourse(); // Save  when form is submitted
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
        <CardHeader title="class course registration" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {dataFetchedInstructor ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Instructor"
                  name="instructor_id"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  // value={values.customerAction}
                  variant="outlined"
                >
                  <option
                    key={0}
                    value={0}
                    //selected={customer_contact == option.value}
                  >
                    {'select Instructor'}
                  </option>
                  {instructor.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      //selected={customer_contact == option.value}
                    >
                      {option.first_name} {option.last_name}
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
                  SelectProps={{ native: true }}
                  // value={values.customerAction}
                  variant="outlined"
                >
                  <option
                    key={0}
                    value={0}
                    //selected={customer_contact == option.value}
                  >
                    {'select Class'}
                  </option>
                  {classes.map(option => (
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
           
            {dataFetchedCourse ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="course"
                  name="course_id"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  // value={values.customerAction}
                  variant="outlined"
                >
                  <option
                    key={0}
                    value={0}
                    //selected={customer_contact == option.value}
                  >
                    {'select course'}
                  </option>
                  {course.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      //selected={customer_contact == option.value}
                    >
                      {option.title}
                    </option>
                  ))}
                </TextField>
              </Grid>
            ) : (
              ''
            )}
            {dataFetchedStream ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Stream"
                  name="stream_id"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  // value={values.customerAction}
                  variant="outlined"
                >
                  <option
                    key={0}
                    value={0}
                    //selected={customer_contact == option.value}
                  >
                    {'select Stream'}
                  </option>
                  {stream.map(option => (
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

export default CreateClassCourse;
