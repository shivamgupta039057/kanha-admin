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
        Add Table Booking
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
            guestName: "",
            phone: "",
            date: "",
            timeSlot: "",
            numberOfGuests: "",
            tableNumber: "",
            specialRequest: "",
            preOrderedItems: [],
          }}
          // validationSchema={getValidationSchema(updateRow)}
          onSubmit={(values, { resetForm }) => {
            // Convert preOrderedItems to array of ids if not already
            const submitValues = {
              ...values,
              preOrderedItems: Array.isArray(values.preOrderedItems)
                ? values.preOrderedItems
                : values.preOrderedItems
                ? [values.preOrderedItems]
                : [],
            };
            handleSubmit(submitValues, resetForm);
          }}
          
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Name Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Guest Name
                  </label>
                  <Field
                    type="text"
                    placeholder="Guest Name"
                    name="guestName"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="guestName" component="div" className="text-red-500 text-sm" />
                </div>
                
                {/* Phone Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Phone
                  </label>
                  <Field
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Date Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Date
                  </label>
                  <Field
                    type="date"
                    placeholder="Date"
                    name="date"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Time Slot Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Time Slot
                  </label>
                  <Field
                    type="time"
                    placeholder="Time Slot"
                    name="timeSlot"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="timeSlot" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Number of Guests Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Number of Guests
                  </label>
                  <Field
                    type="number"
                    placeholder="Number of Guests"
                    name="numberOfGuests"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="numberOfGuests" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Table Number Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Table Number
                  </label>
                  <Field
                    type="text"
                    placeholder="Table Number"
                    name="tableNumber"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="tableNumber" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Special Request Field */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Special Request
                  </label>
                  <Field
                    as="textarea"
                    name="specialRequest"
                    placeholder="Special Request"
                    rows={2}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="specialRequest" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Pre-Ordered Items Field - MUI Multiple Select */}
                {/* <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Pre-Ordered Items
                  </label>
                  <Field name="preOrderedItems">
                    {({ field }) => (
                      <div>
                        <FormControl fullWidth>
                          <Select
                            multiple
                            displayEmpty
                            value={field.value || []}
                            onChange={e => setFieldValue("preOrderedItems", e.target.value)}
                            renderValue={selected => {
                              if (!selected || selected.length === 0) {
                                return <span className="text-gray-400">Select Pre-Ordered Items</span>;
                              }
                              // Find names for selected ids
                              return (
                                <div className="flex flex-wrap gap-1">
                                  {(selected as string[]).map(id => {
                                    const item = Array.isArray(preOrderData)
                                      ? preOrderData.find((d: any) => d._id === id)
                                      : null;
                                    return (
                                      <Chip
                                        key={id}
                                        label={item ? item.name : id}
                                        size="small"
                                        style={{ marginRight: 2 }}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            }}
                            inputProps={{ 'aria-label': 'Pre-Ordered Items' }}
                            className="bg-transparent"
                          >
                            {Array.isArray(preOrderData) && preOrderData.length > 0 ? (
                              preOrderData.map((item: any) => (
                                <MenuItem key={item._id} value={item._id}>
                                  {item.name}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled value="">
                                No items available
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="preOrderedItems" component="div" className="text-red-500 text-sm" />
                </div> */}
              </div>
              {/* Submit Button */}
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Add Table Booking
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