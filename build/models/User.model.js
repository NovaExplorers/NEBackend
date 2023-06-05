import * as yup from 'yup';
export default yup.object().shape({
    _id: yup.string(),
    username: yup.string()
        .min(5, 'Username must be atleast 5 characters long')
        .max(16, 'Username must not exceed 32 characters')
        .required('You must specify a username'),
    password: yup.string()
        .min(8, 'Password must be atleast 8 characters long')
        .max(32, 'Password must not exceed 32 characters')
        .required('You must specify a password'),
});
