import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...registerData } = values;
        const resultAction = await dispatch(register(registerData));
        if (register.fulfilled.match(resultAction)) {
          toast.success('Account created successfully!');
          onSuccess();
        } else {
          toast.error(resultAction.payload || 'Registration failed');
        }
      } catch (error) {
        toast.error('An error occurred during registration');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && formik.errors.name}
        placeholder="Enter your full name"
      />

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
        placeholder="Create a password"
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
        placeholder="Confirm your password"
      />

      <Button
        type="submit"
        disabled={loading || !formik.isValid}
        className="w-full"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;