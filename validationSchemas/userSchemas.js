const yup = require('yup');

const registerSchema = yup.object().shape({
  firstName: yup.string().trim().required('Name is required'),
  lastName: yup.string().trim().required('Name is required'),
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
  password: yup.string().trim().required('Password is required'),
  emailAlerts: yup.bool().required('Alerts is required'),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
  password: yup.string().trim().required('Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema
};
