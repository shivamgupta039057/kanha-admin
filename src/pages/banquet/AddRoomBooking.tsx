import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Apiservice } from '../../service/apiservice';
import { API_ADD_BANQUET, API_ADD_ROOM_BOOK, API_BOOK_BANQUET, API_UPDATE_ROOM_BOOK } from '../../utils/APIConstant';

interface ModalProps {
  handleToggelModal: () => void;
  UpdateBookingRow : {
    _id: string,
  },
  openModal: boolean;
}

const validationSchema = Yup.object().shape({
  guestName: Yup.string().required('Guest name is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  eventDate: Yup.string().required('Event date is required'),
  slot: Yup.string().required('Slot is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
  totalAmount: Yup.number().typeError('Total amount must be a number').required('Total amount is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
});

const AddRoomsBooking: React.FC<ModalProps> = ({ handleToggelModal, openModal , UpdateBookingRow }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);
  const addRoomMutation = useMutation({
      mutationFn: async (formData: FormData) => {
        console.log("dddddFormDataFormDataFormData" , FormData);
        
        return await Apiservice.postAuth(`${API_BOOK_BANQUET}/${UpdateBookingRow?._id}`, formData, token);
      },
      onSuccess: (res: any) => {
        if (res && res.data.status) {
          queryClient.invalidateQueries({ queryKey: ["get-banquet-list"] });
          toast.success("Room added successfully");
          handleToggelModal();
          
        } else {
          toast.error(res?.data?.message || "Failed to add room.");
        }
      },
      onError: (error: any) => {
        toast.error(error?.message || "An error occurred while adding the room.");
      },
    });
  
   const handleSubmit = async (values: any, resetForm: any) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }

      const param = {
        guestName : values.guestName,
        phone : values.phone,
        eventDate : values.eventDate,
        slot : values.slot,
        endTime : values.endTime,
        checkIn : values.checkIn,
        checkOut : values.checkOut,
        totalAmount : values.totalAmount,
        paymentMode : "offline",
        paymentMethod : values.paymentMethod,
        startTime : values.startTime,
        email : values.email
      }

      addRoomMutation.mutate(param);
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <Dialog open={openModal} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        Add Hall Booking
      </DialogTitle>
      <IconButton
        onClick={() => {
          handleToggelModal()
          
        }}
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={{
            guestName: '',
            email: '',
            phone: '',
            eventDate: '',
            slot: '',
            startTime: '',
            endTime: '',
            totalAmount: '',
            paymentMethod: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) =>
            handleSubmit(values, resetForm)
          }
        >
          {() => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Name */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Guest Name
                  </label>
                  <Field
                    type="text"
                    name="guestName"
                    placeholder="Guest Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="guestName" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Email */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Phone */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Phone
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Event Date */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Event Date
                  </label>
                  <Field
                    type="date"
                    name="eventDate"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="eventDate" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Slot */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Slot
                  </label>
                  <Field
                    type="text"
                    name="slot"
                    placeholder="Slot"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="slot" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Start Time */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Start Time
                  </label>
                  <Field
                    type="time"
                    name="startTime"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
                </div>
                {/* End Time */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    End Time
                  </label>
                  <Field
                    type="time"
                    name="endTime"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Total Amount */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Total Amount
                  </label>
                  <Field
                    type="number"
                    name="totalAmount"
                    placeholder="Total Amount"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="totalAmount" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Payment Method */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Payment Method
                  </label>
                  <Field
                    as="select"
                    name="paymentMethod"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="upi">UPI</option>
                  </Field>
                  <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              {/* Submit Button */}
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                 Add Booking
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddRoomsBooking