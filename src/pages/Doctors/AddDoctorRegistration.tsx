import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import toast from 'react-hot-toast';
import { validationSchema } from './DoctorSchema';
import ReactQuill from 'react-quill';
import DefaultPatients from '../../components/patients/DefaultPatients.tsx';
import 'react-quill/dist/quill.snow.css';
import NotExistPatientForm from '../../components/patients/NotExistPatientForm.tsx';
import ExistPatientForm from '../../components/patients/ExistPatientForm.tsx';
// import ExistPatientForm from '../../components/patients/ExistPatientForm.tsx';

interface ModalProps {
  getFunction: () => void;
  setOpenAddModal: (open: boolean) => void;
  openModal: boolean;
  addPatientsId: {
    _id: string;
    username: string;
    mobileNo: string;
    relationship: string;
    sex: string;
    age: number;
    address: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  updateRow: {
    _id: string;
    ticketDate: string;
    medicineName: string[];
    DiagnosticName: string[];
    amount: number;
    note: string;
    ticketDescription: string;
    username: string;
    mobileNo: string;
    sex: string;
    age: number;
    address: string;
  };
}
interface SpecializationItem {
  _id: string;
  specialization: string;
}
// const states = ['California', 'Texas', 'Florida', 'New York', 'Illinois'];
interface SpecializationItem {
  _id: string;
  specialization: string;
}
interface Diagnostic {
  id: string;
  name: string;
}

const AddDoctorRegistration: React.FC<ModalProps> = ({
  openModal,
  setOpenAddModal,
  getFunction,
  addPatientsId,
  updateRow,
}) => {
  console.log("updateRowupdateRow"  , updateRow);
  
  const [specializationList, setSpecializationList] = useState<
    SpecializationItem[]
  >([]);
  const [selectedDiagnostics, setSelectedDiagnostics] = useState<Diagnostic[]>(
    [],
  );
  const [isPatientsRegister, setIsPatientsRegister] = useState<string>('');
  const [PatientsId, setPatientsData] = useState<object>({});
  const [newUserData, setNewUserData] = React.useState<object>({});
  const token = localStorage.getItem(localStorageKeys.token);
  // console.log("newUserData" , newUserData);
  useEffect(() => {
    if (addPatientsId && Object.keys(addPatientsId).length > 1) {
      setPatientsData(addPatientsId);
      setIsPatientsRegister('exist');
    }
  }, [addPatientsId]);
  useEffect(() => {
    if (updateRow && Object.keys(updateRow).length > 1) {
      setIsPatientsRegister('exist');
      setOpenAddModal(true);
    }
  }, [updateRow]);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    console.log("valuesvalues" , values);
    
    try {

      if (!token) {
        throw new Error('Token is missing.');
      }
      const medicineName = values.specialization?.map(
        (item) => item.medicineName,
      );
      const Diagnostics = values.diagnostics?.map(
        (item) => item.diagnosticName,
      );
      const param = {
        mobileNo: values.mobile,
        relationship: values.relationship,
        ticketData: {
          username: values.NameOfPatient,
          sex: values?.gender,
          age: values.age,
          address: values.address,
          otherPatientInfo: values.note,
          ticketDate: values.patientDate,
          medicineName: medicineName,
          DiagnosticName: Diagnostics,
          amount: values.amount,
          note: values.note,
          ticketDescription: values.description,
          finalDiagnostics : values.finalDiagnostics,
          doses : values.doses,
          doesTiming : values?.timing,
          medicineDoesDays : values?.medicineDoesDays,
          user: PatientsId?._id,
          ticketId : updateRow?._id
        },
      };
      let res;
      if (
        updateRow &&
        updateRow?._id 
      ) {
        res = await Apiservice.postAuth(apiEndPoints.ticket.edit, param, token);
      } else {
        res = await Apiservice.postAuth(apiEndPoints.ticket.add, param, token);
      }
             console.log("ddddddddddresresres" , res);
             
      if (res?.status == 200) {
        toast.success(res.data.message);
        resetForm();
        setOpenAddModal(false);
        getFunction();
        setIsPatientsRegister('');
      }
    } catch (error) {
      console.log("rorrrrrr" , error);
      toast.error(error?.response?.data?.message)
      
    }
  };

  const handleSubmitMobile = async (values: any, { resetForm }: any) => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }
      const param = {
        mobileNo: values.mobile,
        relationship: values.relationship,
      };

      const res = await Apiservice.postAuth(
        apiEndPoints.ticket.check,
        param,
        token,
      );

      if (res?.status == 200) {
        // toast.success(res.data.message);
        resetForm();
        setIsPatientsRegister('exist');
        setPatientsData(res.data.ticket);
        toast.success('User Find Successfully');
      } else {
        setIsPatientsRegister('NotExist');
        // setNewUserData(res.newUserData);
      }
    } catch (error) {
      console.log('eororrr', error);
      if (error?.response?.status == 400) {
        setNewUserData(error?.response?.data?.newUserData);
        setIsPatientsRegister('NotExist');
        toast.success('MAke New User');
      }
    }
    // console.log('Form submitted with values:', values);
  };

  const getMedician = async () => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }

      const url = `${apiEndPoints.medicine.list}?flag=0`;
      const res = await Apiservice.getAuth(url, token);

      if (res && res.data.status === 200) {
        setSpecializationList(res.data.data || []);
      } else {
        setSpecializationList([]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setSpecializationList([]);
    }
  };

  const getDiagnotics = async () => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }

      const url = `${apiEndPoints.diagnostic.list}?flag=0`;
      const res = await Apiservice.getAuth(url, token);

      if (res && res.data.status == 200) {
        setSelectedDiagnostics(res.data.data || []);
      } else {
        setSelectedDiagnostics([]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setSelectedDiagnostics([]);
    }
  };

  useEffect(() => {
    getMedician();
    getDiagnotics();
  }, []);

  return (
    <Dialog open={openModal} fullWidth maxWidth="md">
      <DialogTitle>
        Add Patient
        <IconButton
          onClick={() => {
            setOpenAddModal(false);
            setIsPatientsRegister('');
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
      </DialogTitle>

      {isPatientsRegister === 'exist' ? (
        <>
          <DialogContent>
            <NotExistPatientForm
              handleSubmit={handleSubmit}
              PatientsId={PatientsId}
              specializationList={specializationList}
              diagnostic={selectedDiagnostics}
              updateRow={updateRow}
            />
          </DialogContent>
        </>
      ) 
      : isPatientsRegister === 'NotExist' ? (
        <>
          <DialogContent>
            <NotExistPatientForm
              handleSubmit={handleSubmit}
              newUserData={newUserData}
              specializationList={specializationList}
              diagnostic={selectedDiagnostics}
            />
          </DialogContent>
        </>
      ) 
      : (
        <>
          <DialogContent>
            <DefaultPatients handleSubmitMobile={handleSubmitMobile} />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default AddDoctorRegistration;
