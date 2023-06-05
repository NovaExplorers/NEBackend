import * as yup from 'yup';

export default yup.object().shape({
    _id: yup.string(),
    username: yup.string()
                .required('You must specify a username'),
    password: yup.string()
                 .required('You must specify a password'),
})