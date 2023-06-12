import * as yup from 'yup';

export default yup.object().shape({
    _id: yup.string().required(),
    secret: yup.string().required(),
    name: yup.string().required(),
    userAccess: yup.array().required(),
})