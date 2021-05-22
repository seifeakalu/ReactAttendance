import React, { useState, useEffect, useRef } from 'react';
import { Grid, Container, Button, makeStyles } from '@material-ui/core';
import DataTable from 'react-data-table-component';
import Page from 'src/components/Page';
import axios from 'axios';
import Dormant from './dormantList';
import Popup from 'reactjs-popup';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { Navigate } from 'react-router-dom';
import { url } from '../../../../url';
import LinearProgress from '@material-ui/core/LinearProgress';
window.$updateId = 0;
window.$customer_name = 'Test Name';
window.$customer_address = '';
window.$isLogged = 0;
window.$dormant_customer_action = 0;
window.$dormant_reason = 0;
window.$dormant_remark = '';
window.$customer_contact_address = '';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const DormantCustomerListView = ({ values }) => {
  const [value, setValue] = React.useState('');
  const myRefname = useRef(null);
  // `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`
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
            onClick={() => click(row.id, row.customer_name, row.action, row.reason, row.remark, row.customer_contact,row.other_reason)}
          >
            Reason
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
  const [dormantAccounts, setDormantAccounts] = useState({});
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
  const click = (id, name, action, reason, remark, phone, o_reason) => {
    myRefname.current.click();
    window.$updateId = id;
    window.$customer_name = name;
    console.log(id + ' ' + name);
    window.$dormant_customer_action = action;
    window.$dormant_reason = reason;
    window.$dormant_remark = remark;
    window.$customer_contact_address = phone;
    window.$other_reason = o_reason;
  };
  const getDormantAccountsList = () => {
    setDataFetched(false);
    axios
      .get(`${url}/dormants/all/${page}/${countPerPage}`, {
        withCredentials: true
      })
      .then(res => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setDormantAccounts({});
        setTotalRowCount(res.data[res.data.length - 1].countRow);
        setDataFetched(true);
        res.data.splice(countPerPage, 1);

        setDormantAccounts(res);
      })
      .catch(err => {
        setDormantAccounts({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    
    getDormantAccountsList();
  }, [page]);

  return (
    <Page
      className={classes.root}
      title="Dormant Accounts"
      breadcrumbs={[{ name: 'Forms', active: true }]}
    >
      
      <Popup
        trigger={
          <div ref={myRefname}>
            <button style={{ visibility: 'hidden' }} ref={myRefname} />
          </div>
        }
      >
        <Dormant />
      </Popup>
      
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
           {!dataFetched ? (
            <LinearProgress   />
         ) : '' }
          <DataTable
          title="Dormant Accounts"
          columns={columns}
          data={dormantAccounts.data}
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

export default DormantCustomerListView;
