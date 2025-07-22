import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { MaterialReactTable } from 'material-react-table';
import { Apiservice, imgBaseUrl } from '../../service/apiservice';
import localStorageKeys from '../../constant/localStorageKeys';
import apiEndPoints from '../../constant/apiendpoints';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';
import { MRT_SortingState } from 'material-react-table';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AddDoctorRegistration from '../Doctors/AddDoctorRegistration';


interface UpdateRow {
  _id: string;
  image: string | null;
  specialization: string;
  createdAt: string;
  updatedAt: string;
}

const ViewPatients: React.FC = () => {
  const [data, setData] = useState<object[]>([]);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [updateRow, setUpdateRow] = useState<UpdateRow | undefined>(undefined);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const [AddOpenModal , setAddOpenModal] = useState<boolean>(false);
  const [addPatientsId, setAddPatientsId] = useState<string>("")
  const token = localStorage.getItem(localStorageKeys.token);  
  const param = useParams();
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
      size: 70,
      enableColumnActions: false,
      enableSorting: false,
      Cell: ({ row }: { row: { index: number } }) =>
        row.index + 1 + pageState.pageIndex * pageState.pageSize,
    },
    {
      header: 'Note',
      accessorKey: 'note', // Correct accessor key for "Note"
      enableSorting: true,
      size: 120,
    },
    {
      header: 'Ticket Date',
      accessorKey: 'ticketDate', // Correct accessor key for "Ticket Date"
      enableSorting: true,
      size: 120,
    },
    {
      header: 'Test Name',
      accessorKey: 'DiagnosticName', // Correct accessor key for "Test Name"
      enableSorting: true,
      size: 120,
    },
    {
      header: 'Medicine Name',
      accessorKey: 'medicineName', 
      Cell: ({ cell }: { cell: { getValue: () => any } }) => {
        const value = cell.getValue();
    
        if (Array.isArray(value)) {
          return value.length > 0 ? value.join(', ') : 'N/A';
        }
        return 'N/A';
      },
      enableSorting: true,
      size: 120,
    },
    {
      header: 'Medicine Doses',
      accessorKey: 'doses',
      Cell: ({ cell }: { cell: { getValue: () => any } }) => {
        const value = cell.getValue();
    
        if (Array.isArray(value)) {
          return value.length > 0 ? value.join(', ') : 'N/A';
        } else if (typeof value === 'object' && value !== null) {
          return Object.entries(value)
            .map(([key, val]) => `${key}: ${val}`)
            .join(', ') || 'N/A';
        } else if (value) {
          return value;
        }
        return 'N/A';
      },
      enableSorting: true,
      size: 120,
    },    
    {
      header: 'Final Diagnostics',
      accessorKey: 'finalDiagnostics', 
      Cell: ({ cell }: { cell: { getValue: () => string | null } }) =>
        cell.getValue() || 'N/A',
      enableSorting: true,
      size: 120,
    },
    
    {
      header: 'Amount',
      accessorKey: 'amount', 
      enableSorting: true,
      size: 120,
    },
    {
      accessorKey: '_id',
      header: 'Actions',
      size: 120,
      enableSorting: false,
      Cell: ({ cell, row }: { cell: { getValue: () => string | null }; row: any }) => (
        <Dropdown>
          <MenuButton aria-label="More actions">
            <MoreHorizIcon />
          </MenuButton>
          <Menu slots={{ listbox: Listbox }} className="z-99999">
            <MenuItem
              onClick={() => {
                setUpdateRow(row.original);
                // handleToggelModal();
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                const rowData = row.original; // Accessing the whole object of the row
                navigate(`/viewPrescription/${rowData._id}`, { state: rowData });
              }}
            >
              View prescription
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDelete(row?.original._id);
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
    }
    
  ];

  const getPatient = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }
      let url = `${apiEndPoints.patient.get}?flag=0`
      const res = await Apiservice.getAuth(url, token);

      if (res && res.data.status == 200) {
        const filterData = res.data.data.filter((item) => item._id == param.patientId);
        setAddPatientsId(filterData?.[0]);
      }
    } catch (error) {
      console.log(error)
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
      const res = await Apiservice.postAuth(apiEndPoints.ticket.delete, body, token);      
      if (res && res.data.status == 200) {
        toast.success("Delete Success")
        getSpecailization();
      }
    } catch (error) {
      console.log(error)
    }

  }
  const getSpecailization = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }

      let url = `${apiEndPoints.ticket.checkPatientsTickets}?_id=${param.patientId}&search=${searchTerms ?? ""}&sortBy=${sorting[0]?.id ?? ""}&sortOrder=${sorting[0]?.desc ? "desc" : "asc"}&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}`
      
      const res = await Apiservice.getAuth(url, token);      
      if (res && res.status == 200) {

        // alert("hii");
        setData(res.data.data);
        setTotalPages(res.data.pagination.totalItems)
       
      }else{
        setData([]);
      }
    } catch (error) {

      console.log(error)
    }
  }
  useEffect(() => {
    getSpecailization()
  }, [param.patientId , pageState, sorting, searchTerms]);
  useEffect(() => {
    getPatient()
  },[param.patientId]);
  const handleToggelModal = () => {
    setAddOpenModal(prev => !prev);
  }


  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Patients Details" />
        <div className="flex gap-3">
          <button
            onClick={handleToggelModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Patients Details
          </button>
        </div>
      </div>
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={data}
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
        getFunction={getSpecailization}
        addPatientsId={addPatientsId}
        updateRow={updateRow}
      />
    </>

    
  )
}

export default ViewPatients