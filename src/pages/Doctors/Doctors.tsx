import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import { MaterialReactTable, MRT_SortingState } from 'material-react-table';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import AddDoctorRegistration from './AddDoctorRegistration';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton, MenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base';
import { MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES_CONST } from '../../constant/routeConstant';
import WhatsAppComponent from "../../components/whatsapp/WhatsappComponents.jsx"
const Listbox = styled('ul')(
  () => `
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 12px;
    margin: 12px 0;
    min-width: 150px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background : #fff;
    border: 1px solid #DAE2ED;
    color: #1C2025;
    box-shadow: 0px 4px 6px 'rgba(0,0,0, 0.05)';
    z-index: 1;
    `,
);

const Doctors: React.FC = () => {
  const [patient, setPatient] = useState([])
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const [addPatientsId, setAddPatientsId] = useState<string>("")
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [AddOpenModal , setAddOpenModal] = useState<boolean>(false);

  const token = localStorage.getItem(localStorageKeys.token);
const navigate = useNavigate(); 



const Listbox = styled('ul')(
  () => `
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 12px;
    margin: 12px 0;
    min-width: 150px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background : #fff;
    border: 1px solid #DAE2ED;
    color: #1C2025;
    box-shadow: 0px 4px 6px 'rgba(0,0,0, 0.05)';
    z-index: 1;
    `,
);



const MenuItem = styled(BaseMenuItem)(
  () => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &:focus {
      outline: 3px solid #99CCF3;
      background-color: #E5EAF2;
      color: #1C2025;
    }
  
    &.${menuItemClasses.disabled} {
      color: #B0B8C4;
    }
    `,
);

const MenuButton = styled(BaseMenuButton)(
  () => `
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 3px 6px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    color: #B0B8C4;
  
    &:hover {
      background: #F3F6F9;
      border-color: #C7D0DD;
    }
  
    &:active {
      background: #E5EAF2;
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px #99CCF3;
      outline: none;
    }
    `,
);

const columns = [
  {
    header: 'ID',
    accessorKey: "SrNo",
    enableSorting: false,
    size: 70,
    Cell: ({ row }) =>
      row.index + 1 + pageState.pageIndex * pageState.pageSize,
    enableColumnActions: false,
    enableSorting: false,
  },
  {
    header: 'Name Of Patient',
    accessorKey: 'username',
    enableSorting: true,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Relationship',
    accessorKey: 'relationship',
    enableSorting: true,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Mobile No.',
    accessorKey: 'mobileNo',
    enableSorting: true,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Gender',
    accessorKey: 'sex',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Age',
    accessorKey: 'age',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Address',
    accessorKey: 'address',
    enableSorting: true,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Actions',
    accessorKey: '_id',
    size: 120,
    enableSorting: false,
    Cell: ({ cell }) => {      
      const id = cell.getValue();
      return id ? (
        <Dropdown>
          <MenuButton aria-label="More actions">
            <MoreHorizIcon />
          </MenuButton>
          <Menu slots={{ listbox: Listbox }} className="z-99999">
            <MenuItem onClick={() => navigate(`${ROUTES_CONST.VIEWPATIENT}/${id}`)}>
              View
            </MenuItem>
            <MenuItem 
            onClick={() => {
              setAddOpenModal(prev => !prev);
              setAddPatientsId(cell?.row?.original)
            }}
            >
              Add
            </MenuItem>
            <MenuItem
            onClick={() => {
              handleDelete(cell?.row?.original._id);
            }}
            >Delete</MenuItem>
          </Menu>
        </Dropdown>
      ) : (
        'N/A'
      );
    },
  },
];



  const getPatient = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }


      let url = `${apiEndPoints.patient.get}?search=${searchTerms ?? ""}&sortBy=${sorting[0]?.id ?? ""}&sortOrder=${sorting[0]?.desc ? "desc" : "asc"}&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}`

      const res = await Apiservice.getAuth(url, token);
      
      if (res && res.data.status == 200) {
        
        setPatient(res.data.data)
        setTotalPages(res?.data?.pagination?.totalItems);
      }
    } catch (error) {
      // console.log(error , "eeeerrrrrrrrrr")
      setPatient([]);
        toast.error(error?.response.data.message)
    }
  }

  const handleDelete = async (id: string | null) => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }
      const body = {
        id: id
      }
      const res = await Apiservice.postAuth(apiEndPoints.patient.delete, body, token);      
      if (res && res.data.status == 200) {
        toast.success(res.data.message)
        getPatient()
      }
    } catch (error) {
      console.log(error)
    }
  
  }



  useEffect(() => {
    getPatient();
  }, [pageState, sorting, searchTerms]);

  const AddDoctorModal = () => {
    setAddOpenModal(prev => !prev);
  }


  return (

    <>

      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Patients" />
        <div className="flex gap-3">
          <button
            onClick={AddDoctorModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Patient
          </button>
        </div>
      </div>

      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={patient}
          manualPagination
          manualSorting
          paginationDisplayMode={'pages'}
          rowCount={totalPages}
          onSortingChange={setSorting}
          manualFiltering={true}
          enableColumnFilters={false}
          enableColumnActions={false}
          onGlobalFilterChange={setSearchTerm}
          muiPaginationProps={{
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: false,
            variant: 'outlined',
          }}
          state={{
            pagination: pageState,
            sorting: sorting
          }}
          onPaginationChange={(state) => {
            setPageState(state);
          }}


        />
      </div>
      <AddDoctorRegistration
        openModal={AddOpenModal}
        setOpenAddModal={setAddOpenModal}
        getFunction={getPatient}
        addPatientsId={addPatientsId}
      />
    </>
  )
}

export default Doctors;
