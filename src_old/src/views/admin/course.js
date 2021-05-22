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
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
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
import CreateCourse from './createCourse';
import AutorenewIcon from '@material-ui/icons/Autorenew';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

var deleteID;
var title = '';
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

const CourseList = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [paginationReset, setPaginationReset] = useState(false);
  const [values, setValues] = useState({
    title: '',
    description: '',
  
  });
  
  const searchTriggred = event => {
    event.preventDefault();
    setPaginationReset(true);

    searchInput = event.target.value;
    if (event.target.value.trim() != '') {
     
      searchRequested = true;
      getCourseList();
    } else {
      searchRequested = false;
    
      searchInput = null;
      getCourseList();
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
      name: 'Title',
      selector: 'title'
    },
    {
      name: 'Description',
      selector: 'description'
    },
  
    {
      name: 'Edit',

      cell: row =>
        row.id != null ? (
          <Button
            onClick={() =>
              editClicked(
                row.id,
                row.title,
                row.description,
               
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
          <Button onClick={() => deleteClicked(row.id, row.title)}>
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
  const [course, setCourse] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const countPerPage = 6;
  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  const editCourse = () => {
    if (values.title.trim() === '') {
      setErrorMessage('Please provide company name');
    }  else {
      axios
        .put(
          url + '/course/' + updateID,
          {
            title: values.title,
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
            axios.post(BatchUrl, {}).then(login => {
              /* */
            });
           
            alert(
              'Connection to the server failed , please try again :)'
            );
          }
        );
    }
  };
  const deleteClicked = (id, name) => {
    console.log(id);
    deleteID = id;
    title = name;
  
    setdeleteConfirmOpen(true);
  };
  const handleSubmit = event => {
    event.preventDefault();
    editCourse(); // Save  when form is submitted
  };
  const editClicked = (id, name, description) => {
    console.log(id);
    updateID = id;
    setValues({
      ...values,
      title: name,
      description: description,
     
    });

    setOpenEdit(true);
  };

  const createCourse = () => {
    setOpenCreate(true);
  };

  const deleteCourse = () => {
    console.log('delete called');
    axios
      .delete(url + '/course/' + deleteID, {
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
         
          alert(
            'Connection to the server failed , please try again :)'
          );
        }
      );
  };
  const getCourseList = () => {
    setDataFetched(false);
    axios
      .get(
        `${url}/course/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true
        }
      )
      .then(res => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setCourse({});
        setTotalRowCount(res.data[res.data.length - 1].countRow);
        res.data.splice(countPerPage + 1, 1);
        report = res.data[res.data.length - 1].report;
        res.data.splice(countPerPage, 1);
        setPaginationReset(false);
        setDataFetched(true);

        setCourse(res);
      })
      .catch(err => {
        setCourse({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    getCourseList();
  }, [page]);

  return (
    <Page
      className={classes.root}
      title="Course"
      breadcrumbs={[{ name: 'Forms', active: true }]}
    >
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
          <Button
            style={{ marginLeft: 'auto', float: 'right' }}
            variant="outlined"
            color="primary"
            onClick={() => createCourse()}
          >
            <PersonAddIcon />
            {'  '} Create Course
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
              {'Delete Course '}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete course{' '}
                {title}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
              <Button onClick={deleteCourse} color="primary">
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
              {'Create Course'}
            </DialogTitle>
            <DialogContent>
              <CreateCourse/>
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
              {'Edit Course data'}
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
                          label="Course title"
                          name="title"
                          readOnly={false}
                          onChange={handleChange}
                          value={values.title}
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
              placeholder="Search course"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <DataTable
            title={"Course"}
            columns={columns}
            data={course.data}
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

export default CourseList;
