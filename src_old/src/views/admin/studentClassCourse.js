import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  makeStyles,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Box,
  Typography
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DataTable from 'react-data-table-component';
import Page from 'src/components/Page';
import axios from 'axios';

import { Navigate } from 'react-router-dom';
import { url } from '../../url';
import { BatchUrl } from '../../batchExcuteURL';

import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import CreateStudentClassCourse from './createStudentClassCourse';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

var deleteID;
var dept_name = '';
var updateID;
var report = '';
var prevSearchInput = '';
var searchRequested = false;
var searchInput = null;
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const StudentClassCourse = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [paginationReset, setPaginationReset] = useState(false);
  const [values, setValues] = useState({
    class_id: 0,
    course_id: 0,
    stream_id: 0,
    student_id: 0
  });

  const searchTriggred = event => {
    event.preventDefault();
    setPaginationReset(true);

    searchInput = event.target.value;
    if (event.target.value.trim() != '') {
      searchRequested = true;
      getClassCourseList();
    } else {
      searchRequested = false;

      searchInput = null;
      getClassCourseList();
    }
    prevSearchInput = searchInput;
    console.log('search triggred with ' + searchInput);
    // Save  when form is submitted
  };
  const handleClose = () => {
    setOpen(false);
    setdeleteConfirmOpen(false);
    setOpenEdit(false);
    setOpenCreate(false);
  };

  const myRefname = useRef(null);
  // `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`
  const columns = [
    {
      name: 'Room',
      selector: 'room'
    },
    {
      name: 'Course',
      selector: 'course'
    },
    {
      name: 'Stream',
      selector: 'stream'
    },
    {
      name: 'Student Name',
      cell: row =>
        row.id != null ? <>{row.first_name + ' ' + row.last_name}</> : '',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
    {
      name: 'Edit',

      cell: row =>
        row.id != null ? (
          <Button
            onClick={() =>
              editClicked(
                row.id,
                row.class_id,
                row.course_id,
                row.stream_id,
                row.student_id
              )
            }
          >
            <EditIcon style={{ fill: '#00094B' }} />
          </Button>
        ) : (
          ''
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
    {
      name: 'Delete',

      cell: row =>
        row.id != null ? (
          <Button onClick={() => deleteClicked(row.id, row.course)}>
            <DeleteIcon style={{ fill: '#00094B' }} />
          </Button>
        ) : (
          ''
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];

  const classes = useStyles();
  const [studentClassCourse, setStudentClassCourse] = useState({});
  const [student, setStudent] = useState([]);
  const [stream, setStream] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const countPerPage = 6;
  const [classResult, setClass] = useState([]);
  const [dataFetchedClass, setDataFetchedClass] = useState(false);
  const [course, setCourse] = useState([]);
  const [dataFetchedCourse, setDataFetchedCourse] = useState(false);
  const [dataFetchedStudent, setDataFetchedStudent] = useState(false);
  const [dataFetchedStream, setDataFetchedStream] = useState(false);
  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  const editClassCourse = () => {
    if (values.student_id == 0) {
      setErrorMessage('Please provide student');
    } else if (values.class_id === 0) {
      setErrorMessage('Please provide class');
    } else if (values.course_id == 0) {
      setErrorMessage('Please provide course');
    } else if (values.stream_id == 0) {
      setErrorMessage('Please provide stream');
    } else {
      axios
        .put(
          url + '/student_class_course/' + updateID,
          {
            student_id: values.student_id,
            class_id: values.class_id,
            course_id: values.course_id,
            stream_id: values.stream_id
          },
          { withCredentials: true }
        )
        .then(
          data => {
            window.location.reload(false);

            /* */
          },
          error => {
            axios.post(BatchUrl, {}).then(login => {
              /* */
            });

            alert('Connection to the server failed , please try again :)');
          }
        );
    }
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
  const getStudent = () => {
    setDataFetchedStudent(false);
    axios
      .get(`${url}/student`, {
        withCredentials: true
      })
      .then(resp => {
        setStudent({});

        setStudent(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedStudent(true);
      })
      .catch(err => {
        setStudent({});
        setDataFetchedStudent(true);
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
    setDataFetchedClass(false);
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
  const deleteClicked = (id, name) => {
    console.log(id);
    deleteID = id;
    dept_name = name;

    setdeleteConfirmOpen(true);
  };
  const handleSubmit = event => {
    event.preventDefault();
    editClassCourse(); // Save  when form is submitted
  };
  const editClicked = (id, class_id, course_id, stream_id, student_id) => {
    console.log(id);
    updateID = id;
    setValues({
      ...values,
      class_id: class_id,
      course_id: course_id,
      stream_id: stream_id,
      student_id: student_id
    });

    setOpenEdit(true);
  };

  const createDepartment = () => {
    setOpenCreate(true);
  };

  const deleteClassCourse = () => {
    console.log('delete called');
    axios
      .delete(url + '/student_class_course/' + deleteID, {
        withCredentials: true
      })
      .then(
        res => {
          window.location.reload(false);
          alert(res.data.message);
          /* */
        },
        error => {
          axios.post(BatchUrl, {}).then(login => {
            /* */
          });

          alert('Connection to the server failed , please try again :)');
        }
      );
  };
  const getClassCourseList = () => {
    setDataFetched(false);
    axios
      .get(
        `${url}/student_class_course/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true
        }
      )
      .then(res => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setStudentClassCourse({});
        setTotalRowCount(res.data[res.data.length - 1].countRow);
        res.data.splice(countPerPage + 1, 1);
        report = res.data[res.data.length - 1].report;
        res.data.splice(countPerPage, 1);
        setPaginationReset(false);
        setDataFetched(true);

        setStudentClassCourse(res);
      })
      .catch(err => {
        setStudentClassCourse({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    getClassCourseList();
  }, [page]);
  useEffect(() => {
    getClass();
    getCourse();
    getStream();
    getStudent();
  }, []);
  return (
    <Page
      className={classes.root}
      title="Class Courses"
      breadcrumbs={[{ name: 'Forms', active: true }]}
    >
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
          <Button
            style={{ marginLeft: 'auto', float: 'right' }}
            variant="outlined"
            color="primary"
            onClick={() => createDepartment()}
          >
            <PersonAddIcon />
            {'  '} Create Student class Course
          </Button>

          <Dialog
            open={deleteConfirmOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {'Delete Class Course '}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete department {dept_name}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
              <Button onClick={deleteClassCourse} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openCreate}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {'Create Department'}
            </DialogTitle>
            <DialogContent>
              <CreateStudentClassCourse />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEdit}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {'Edit Department data'}
            </DialogTitle>
            <DialogContent>
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
                  <CardHeader />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      {dataFetchedStudent ? (
                        <Grid item md={6} xs={12}>
                          <TextField
                            fullWidth
                            label="Student"
                            name="student_id"
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
                              {'select Student'}
                            </option>
                            {student.map(option => (
                              <option
                                key={option.id}
                                value={option.id}
                                selected={values.student_id == option.id}
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
                            {classResult.map(option => (
                              <option
                                key={option.id}
                                value={option.id}
                                selected={values.class_id == option.id}
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
                            label="Course"
                            name="course_id"
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
                              {'Course'}
                            </option>
                            {course.map(option => (
                              <option
                                key={option.id}
                                value={option.id}
                                selected={values.course_id == option.id}
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
                                selected={values.stream_id == option.id}
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
                    <Grid>
                      {' '}
                      <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="primary"
                      >
                        Close
                      </Button>
                    </Grid>
                    <Grid>
                      <Button variant="outlined" color="primary" type="submit">
                        Update
                      </Button>
                    </Grid>
                  </Box>
                </Card>
              </form>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>

          {!dataFetched ? <LinearProgress /> : ''}
          <Paper component="form">
            <InputBase
              className={classes.input}
              onChange={searchTriggred}
              placeholder="Search class course"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <DataTable
            title={'Assigned Course,Stream and Class for student'}
            columns={columns}
            data={studentClassCourse.data}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRowCount}
            paginationPerPage={countPerPage}
            striped={true}
            hover={true}
            pagination={dataFetched}
            paginationResetDefaultPage={paginationReset}
            onChangeRowsPerPage={perPage => 4}
            possibleNumberPerPage={[2, 3, 4, 5, 6]}
            paginationComponentOptions={{
              noRowsPerPage: true
            }}
            onChangePage={page => setPage(page - 1)}
          />
        </Container>
      ) : (
        <Navigate to="/rms2/login" />
      )}
    </Page>
  );
};

export default StudentClassCourse;
