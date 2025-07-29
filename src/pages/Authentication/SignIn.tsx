import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewLogo from '../../images/logo/kanhalogo.webp';
import { Apiservice } from '../../service/apiservice';
import toast from 'react-hot-toast';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys, { TOKEN_NAME } from '../../constant/localStorageKeys';
import { ROUTES_CONST } from '../../constant/routeConstant';
import { useMutation } from '@tanstack/react-query';
import { API_USER_LOGIN } from '../../utils/APIConstant';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../store/authSlice';

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (values: SignInFormValues) => {
      return await Apiservice.post(API_USER_LOGIN, values);
    },
    onSuccess: (response: any) => {
      // You may want to check response?.data for success, token, etc.
      // For now, just log and navigate if needed
      console.log(response, "Login response");
      if (response && response.data && response.data.status) {
        const token = response.data.data?.token;          
        if (token) {
          dispatch(setAccessToken(token));
          localStorage.setItem(TOKEN_NAME, token);
          toast.success("Login successful!");
          navigate(ROUTES_CONST.HOME);
        } else {
          toast.error("No token received.");
        }
      } else {
        toast.error(response?.data?.message || "Login failed.");
      }
    },
    onError: (error: any) => {
      console.log("errorerrorerror" , error);
      
      toast.error(error?.message || "An error occurred during login.");
    },
  });

  const signinHandler = async (values: SignInFormValues) => {
    mutation.mutate(values);
  };

  const initialValues: SignInFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const formik = useFormik<SignInFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values: SignInFormValues, actions: FormikHelpers<SignInFormValues>) => {
      actions.setSubmitting(false);
      signinHandler(values);
    },
  });

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:flex xl:w-1/2 items-center justify-center min-h-[600px]">
            <div className="py-17.5 px-26 text-center w-full">
              <Link className="mb-5.5 inline-block" to="/">
                <img src={NewLogo} alt="Logo" className="mx-auto" style={{ maxWidth: '480px', maxHeight: '260px' }} />
              </Link>

              {/* <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                suspendisse.
              </p> */}

              <span className="mt-15 inline-block">
                {/* SVG omitted for brevity */}
                <svg
                  width="350"
                  height="350"
                  viewBox="0 0 350 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* ...SVG paths... */}
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              {/* <span className="mb-1.5 block font-medium">Start for free</span> */}
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Admin - New Kanha Hotel
              </h2>

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...formik.getFieldProps('email')}
                      className={`w-full rounded-lg border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-stroke'
                        } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                    ) : null}
                    <span className="absolute right-4 top-4">
                      {/* SVG Icon */}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      {...formik.getFieldProps('password')}
                      className={`w-full rounded-lg border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-stroke'
                        } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                    ) : null}
                    <span className="absolute right-4 top-4">
                      {/* SVG Icon */}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={formik.isSubmitting || mutation.isLoading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
