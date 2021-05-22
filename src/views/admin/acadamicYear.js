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
  Box
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
import CreateAccadamicYear from './createAccadamicYear';
import CreateClass from './createClass';
import CreateSemister from './createSemister';
import CreateYear from './createYear';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

var deleteID;
var dept_name = '';
var updateID;
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

const AccadamicYear = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openSemister, setOpenSemister] = React.useState(false);
  const [openYear, setOpenYear] = React.useState(false);
  const [openClass, setOpenClass] = React.useState(false);
  const [paginationReset, setPaginationReset] = useState(false);
  const [values, setValues] = useState({
    name: '',
    description: ''
  });

  const searchTriggred = event => {
    event.preventDefault();
    setPaginationReset(true);

    searchInput = event.target.value;
    if (event.target.value.trim() != '') {
      searchRequested = true;
      getAccadamicYearList();
    } else {
      searchRequested = false;

      searchInput = null;
      getAccadamicYearList();
    }

    console.log('search triggred with ' + searchInput);
    // Save  when form is submitted
  };
  const handleClose = () => {
    setOpen(false);
    setdeleteConfirmOpen(false);
    setOpenEdit(false);
    setOpenCreate(false);
    setOpenClass(false);
    setOpenSemister(false);
    setOpenYear(false);
  };

  const myRefname = useRef(null);
  // `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`
  const columns = [
    {
      name: 'Customer Name',
      selector: 'name'
    },
    {
      name: 'Description',
      selector: 'description'
    },
    {
      name: 'Department',
      selector: 'department'
    },
    {
      name: 'Semister',
      selector: 'semister'
    },
    {
      name: 'Accadamic Year',
      selector: 'year'
    },
    {
      name: 'class',
      selector: 'room'
    },
    {
      name: 'Edit',

      cell: row =>
        row.id != null ? (
          <Button
            onClick={() =>
              editClicked(
                row.id,
                row.name,
                row.description,
                row.department_id,
                row.year_of_id,
                row.class_id,
                row.semister_id
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
          <Button onClick={() => deleteClicked(row.id, row.name)}>
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
  const [accadamicYear, setAccadamicYear] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const countPerPage = 6;

  const [semister, setSemister] = useState([]);
  const [department, setDepartment] = useState([]);
  const [year, setYear] = useState([]);
  const [classResult, setClass] = useState([]);
  const [dataFetchedSem, setDataFetchedSem] = useState(false);
  const [dataFetchedYear, setDataFetchedYear] = useState(false);
  const [dataFetchedDept, setDataFetchedDept] = useState(false);
  const [dataFetchedClass, setDataFetchedClass] = useState(false);
  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  const editAccadamicYear = () => {
    if (values.name.trim() === '') {
      setErrorMessage('Please provide company name');
    } else {
      axios
        .put(
          url + '/stream/' + updateID,
          {
            name: values.name,
            description: values.description,
            department_id: values.department_id,
            year_of_id: values.year_of_id,
            class_id: values.class_id,
            semister_id: values.semister_id
          },
          { withCredentials: true }
        )
        .then(
          data => {
            window.location.reload(false);

            /* */
          },
          error => {
            alert('Connection to the server failed , please try again :)');
          }
        );
    }
  };

  const getSemister = () => {
    setDataFetchedSem(false);
    axios
      .get(`${url}/semister`, {
        withCredentials: true
      })
      .then(resp => {
        setSemister({});

        setSemister(resp.data);
        // result =JSON.parse(resp.data);

        setDataFetchedSem(true);
      })
      .catch(err => {
        setSemister({});
        setDataFetchedSem(true);
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
  const deleteClicked = (id, name) => {
    console.log(id);
    deleteID = id;
    dept_name = name;

    setdeleteConfirmOpen(true);
  };
  const handleSubmit = event => {
    event.preventDefault();
    editAccadamicYear(); // Save  when form is submitted
  };
  const editClicked = (
    id,
    name,
    description,
    department_id,
    year_of_id,
    class_id,
    semister_id
  ) => {
    console.log(id);
    updateID = id;
    setValues({
      ...values,
      name: name,
      description: description,
      department_id: department_id,
      year_of_id: year_of_id,
      class_id: class_id,
      semister_id: semister_id
    });

    setOpenEdit(true);
  };

  const createDepartment = () => {
    setOpenCreate(true);
  };
  const createClass = () => {
    setOpenClass(true);
  };
  const createYear = () => {
    setOpenYear(true);
  };
  const createSemister = () => {
    setOpenSemister(true);
  };
  const deleteAccadamicYear = () => {
    console.log('delete called');
    axios
      .delete(url + '/stream/' + deleteID, {
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
  const getAccadamicYearList = () => {
    setDataFetched(false);
    axios
      .get(
        `${url}/stream/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true
        }
      )
      .then(res => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setAccadamicYear({});
        setTotalRowCount(res.data[res.data.length - 1].countRow);
        res.data.splice(countPerPage + 1, 1);
        res.data.splice(countPerPage, 1);
        setPaginationReset(false);
        setDataFetched(true);

        setAccadamicYear(res);
      })
      .catch(err => {
        setAccadamicYear({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    getAccadamicYearList();
  }, [page]);

  return (
    <Page
      className={classes.root}
      title="Acadamic Year"
      breadcrumbs={[{ name: 'Forms', active: true }]}
    >
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
          <Dialog
            open={deleteConfirmOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {'Delete Department '}
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
              <Button onClick={deleteAccadamicYear} color="primary">
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
              {'Create Stream'}
            </DialogTitle>
            <DialogContent>
              <CreateAccadamicYear />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openClass}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {'Create Class'}
            </DialogTitle>
            <DialogContent>
              <CreateClass />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openSemister}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {'Create semister'}
            </DialogTitle>
            <DialogContent>
              <CreateSemister />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openYear}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {'Create Year'}
            </DialogTitle>
            <DialogContent>
              <CreateYear />
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
              {'Edit Stream data'}
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
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Department name"
                          name="name"
                          readOnly={false}
                          onChange={handleChange}
                          value={values.name}
                          aria-label="minimum height"
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
                          value={values.description}
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
                                selected={values.department_id == option.id}
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
                                selected={values.year_of_id == option.id}
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
                            <option key={0} value={0}>
                              {'select class'}
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
                      {dataFetchedSem ? (
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
                                selected={values.semister_id == option.id}
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
              placeholder="Search Stream"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
            <Button variant="outlined" color="primary" onClick={() => createYear()}>
              Create Year
            </Button>
            <span>&nbsp;</span>
            <Button variant="outlined" color="primary"  onClick={() => createSemister()}> 
              Create Semister
            </Button>
            <span>&nbsp;</span>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => createClass()}
            >
              Create Class
            </Button>
            <span>&nbsp;</span>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => createDepartment()}
            >
              Create Stream
            </Button>
          </Paper>
          <DataTable
            title={'Stream'}
            columns={columns}
            data={accadamicYear.data}
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
        <Navigate to="/attendance/login" />
      )}
    </Page>
  );
};

export default AccadamicYear;
