import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';


import DepartmentList from 'src/views/admin/department';
import CourseList from 'src/views/admin/course';
import AccadamicYear from 'src/views/admin/acadamicYear';
import ClassCourse from 'src/views/admin/classCourse';
import StudentClassCour from 'src/views/admin/studentClassCourse';
const routes = [
  {
    path: 'attendance/app',
    element: <DashboardLayout/>,
    children: [
      { path: 'department', element: <DepartmentList /> },
      { path: 'course', element: <CourseList /> },
      { path: 'accadamic_year', element: <AccadamicYear /> },
      { path: 'class_course', element: <ClassCourse /> },
      { path: 'student_class_course', element: <StudentClassCour /> },
     
      { path: '*', element: <NotFoundView /> }
    ]
  },
  {
    path: '/attendance/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/attendance/login" /> },
      { path: '*', element: <NotFoundView /> }
    ]
  }
];

export default routes;
