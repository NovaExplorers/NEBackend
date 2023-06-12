import { DeviceType } from 'enum/DeviceType.enum';
import * as yup from 'yup';

export default yup.object().shape({
    type: yup.mixed<DeviceType>().required(),
    name: yup.string().max(32),
    id: yup.string().required(),
    secret: yup.string().required()
})