import { DeviceType } from 'enum/DeviceType.enum';
import * as yup from 'yup';

export default yup.object().shape({
    type: yup.mixed<DeviceType>().required(),
    id: yup.string().required(),
    secret: yup.string().required(),
    deviceSelected: yup.string().required()
})