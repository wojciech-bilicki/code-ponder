import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  username: yup.string().min(3).max(30).matches(/^[a-zA-Z0-9]*$/, 'Only letters and numbers').required(),
  email: yup.string().email().required().min(5).max(500),
  password: yup.string().min(5).max(1000)
})
