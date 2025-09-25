import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(login(values));
        if (login.fulfilled.match(resultAction)) {
          toast.success('Welcome back!');
          onSuccess();
        } else {
          toast.error(resultAction.payload || 'Login failed');
        }
      } catch (error) {
        toast.error('An error occurred during login');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
        placeholder="Enter your email"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
        placeholder="Enter your password"
      />

      <Button
        type="submit"
        disabled={loading || !formik.isValid}
        className="w-full"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;