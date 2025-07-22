import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Apiservice } from '../../service/apiservice.ts';
import toast from 'react-hot-toast';
import { API_CANCLE_ROOM_BOOK, API_ROOM_ADD, API_ROOM_UPDATE } from '../../utils/APIConstant.ts';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ModalProps {
  handleToggelModal: () => void;
  handleClearRow: () => void;
  openModal: boolean;
  updateRow: {
    _id: string,
    image: string | null,
    medicineName: string,
    medicineManufacturerDate: string,
    medicineExpiryDate: string,
    medicineStock: string,
    createdAt: string,
    updatedAt: string
  } | undefined
}

const CancelBookingModel: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow }) => {
  
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);
  const addRoomMutation = useMutation({
    mutationFn: async () => {
      console.log("dddddFormDataFormDataFormData" , FormData);
      
      return await Apiservice.postAuth(`${API_CANCLE_ROOM_BOOK}/${updateRow._id}`, {}, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-room-booking-view"] });
        toast.success(res.data.message);
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to add room.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while adding the room.");
    },
  });



  
  return (
    <Dialog open={openModal} fullWidth={true} maxWidth={'xs'}>
      <div className="relative bg-white rounded-2xl shadow-xl p-8 text-center dark:bg-gray-900">
        <IconButton
          onClick={() => {
            handleToggelModal();
            handleClearRow();
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
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-2">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Cancel Room Booking?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to cancel this room booking? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              onClick={() => {
                handleToggelModal();
                handleClearRow();
              }}
            >
              Close
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow"
              onClick={() => {
                addRoomMutation.mutate(updateRow._id);
                // You should call your cancel booking logic here
                // handleSubmit && handleSubmit({}, () => {});
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default CancelBookingModel