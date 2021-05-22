import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, makeStyles } from '@material-ui/core';
import DataTable from 'react-data-table-component';
import Page from 'src/components/Page';
import axios from 'axios';
import Popup from 'reactjs-popup';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import TopDepositor from '../../account/topDepositorReason';
import { Navigate } from 'react-router-dom';
import { url } from '../../../url';
import LinearProgress from '@material-ui/core/LinearProgress';
//global variables
window.$depositor_updateId = 0;
window.$depositor_name = '';
window.$depositor_address = '';
window.$depositor_supplier = '';
window.$depositor_customers = '';
window.$depositor_action = 0;
window.$depositor_comment = '';
window.$customers_full_potential = '';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const TopDepositorList = ({ values }) => {
  const [value, setValue] = React.useState('');
  const myRefname = useRef(null);
  const columns = [
    {
      name: 'Customer Name',
      selector: 'customer_name'
    },
    {
      name: 'Account Number',
      selector: 'account_number'
    },

    {
      name: 'Status on reason update',

      cell: row =>
        row.responded === 1 ? (
          <CheckIcon style={{ fill: 'green' }} />
        ) : row.responded === 0 ? (
          <ClearIcon style={{ fill: 'red' }} />
        ) : (
          ''
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },

    {
      name: 'Action',

      cell: row =>
        row.id != null ? (
          <Button
            color="primary"
            onClick={() =>
              click(
                row.id,
                row.customer_name,
                row.customer_contact,
                row.supplier,
                row.customers,
                row.action,
                row.comment,
                row.customers_full_potential_attended
              )
            }
          >
            Status
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
  const [users, setUsers] = useState({});
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const countPerPage = 6;
  const handleChange = state => {
    // You can use setState or dispatch with something like Redux so we can use the retrieved data
    console.log('Selected Rows: ', state.selectedRows);
  };

  function handleChanges(newValue) {
    setValue(newValue);
  }
  const click = (
    id,
    name,
    address,
    supplier,
    customers,
    action,
    comment,
    customers_full_potential
  ) => {
    myRefname.current.click();

    window.$depositor_updateId = id;
    window.$depositor_name = name;
    window.$depositor_address = address;
    window.$depositor_supplier = supplier;
    window.$depositor_customers = customers;
    window.$depositor_action = action;
    window.$depositor_comment = comment;
    window.$customers_full_potential = customers_full_potential;
  };
  const getUserList = () => {
    setDataFetched(false);
    console.log(page);
    console.log(countPerPage);
    axios
      .get(`${url}/top_depositor/all/${page}/${countPerPage}`, {
        withCredentials: true
      })
      .then(res => {
        setUsers({});
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        //console.log("users" + res.data.user);
        setTotalRowCount(res.data[res.data.length - 1].countRow);

        res.data.splice(countPerPage, 1);

        setUsers(res);
        setDataFetched(true);
        // ;
      })
      .catch(err => {
        setUsers({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    getUserList();
  }, [page]);

  return (
    <Page
      className={classes.root}
      title="Top Deposit"
      breadcrumbs={[{ name: 'Forms', active: true }]}
    >
      <Popup
        trigger={
          <div ref={myRefname}>
            <Button ref={myRefname}></Button>
          </div>
        }
      >
        <TopDepositor />
      </Popup>
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
          {!dataFetched ? (
            <LinearProgress
              style={{
                marginTop: '100'
              }}
            />
          ) : (
            ''
          )}
          <DataTable
            title="Top Depositors"
            columns={columns}
            data={users.data}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRowCount}
            paginationPerPage={countPerPage}
            striped={true}
            hover={true}
            pagination={dataFetched}
            onClickRow={click}
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

export default TopDepositorList;
