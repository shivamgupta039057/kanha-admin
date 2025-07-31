import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { MaterialReactTable } from 'material-react-table';
import { Apiservice, imgBaseUrl } from '../../service/apiservice';
import localStorageKeys, { TOKEN_NAME } from '../../constant/localStorageKeys';
import apiEndPoints from '../../constant/apiendpoints';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';
import { MRT_SortingState } from 'material-react-table';
import { MRT_ColumnDef } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BANQUET_DELETE, API_BANQUET_GET, API_DELETE_GALLERY, API_GET_ALL_ENQUIRY, API_GET_GALLERY, API_ROOM_DELETE, API_ROOM_GET } from '../../utils/APIConstant';
import { useSelector } from 'react-redux';
import AddEnquiryPageModal from './AddEnquiryPageModal';


interface UpdateRow {
  _id: string;
  image: string | null;
  specialization: string;
  createdAt: string;
  updatedAt: string;
}
interface EnquiryData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  // Add other fields if needed
}
const EnquiryPage: React.FC = () => {
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [AddBookingModal , setAddBookingModal] = useState<boolean>(false);
  const [updateRow, setUpdateRow] = useState<UpdateRow | undefined>(undefined);
  const [UpdateBookingRow, setUpdateBookingRow] = useState<UpdateRow | undefined>(undefined);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [data, setData] = useState<object[]>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  // const token = localStorage.getItem(TOKEN_NAME);
  const token = useSelector((state: any) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
console.log("openModalopenModalopenModal" , openModal);

  const { data: roomData } = useQuery({
    queryKey: ["get-enquiry-list"],
    queryFn: () =>
      Apiservice.getAuth(`${API_GET_ALL_ENQUIRY}`, token ?? ""),
    staleTime: 5 * 60 * 1000,
  });

  console.log("roomDataroomData", roomData);
  useEffect(() => {
    if (roomData) {
      setData(roomData.data.data);
      setTotalPages(roomData?.data?.pagination?.totalItems ?? 0)
    }
  }, [roomData]);

  // here is the delete function 
  const deleteRoomMutation = useMutation({
    mutationFn: async (id: string) => {
      return await Apiservice.postAuth(`${API_DELETE_GALLERY}/${id}`, {}, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-enquiry-list"] });
        toast.success("Room deleted successfully");
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to delete room.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while deleting the room.");
    },
  });
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

  // Define the type for Enquiry data


  const columns: MRT_ColumnDef<EnquiryData>[] = [
    {
      header: 'ID',
      accessorKey: 'SrNo',
      enableSorting: false,
      size: 70,
      Cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      enableSorting: true,
      size: 140,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Email',
      accessorKey: 'email',
      enableSorting: true,
      size: 180,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      enableSorting: true,
      size: 140,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      enableSorting: true,
      size: 180,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Message',
      accessorKey: 'message',
      enableSorting: false,
      size: 220,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableSorting: false,
      size: 220,
      Cell: ({ cell }) => {
        const value = cell.getValue() as string;
        let color = '';
        switch (value) {
          case 'new':
            color = '#1976d2'; // blue
            break;
          case 'responded':
            color = '#388e3c'; // green
            break;
          case 'closed':
            color = '#d32f2f'; // red
            break;
          default:
            color = '#757575'; // grey
        }
        return (
          <span
            style={{
              color: '#fff',
              backgroundColor: color,
              borderRadius: '12px',
              padding: '4px 12px',
              fontWeight: 500,
              fontSize: '0.95em',
              display: 'inline-block',
              minWidth: 80,
              textAlign: 'center',
            }}
          >
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: '_id',
      size: 120,
      enableSorting: false,
      Cell: (props: any) => {
        const { cell, row } = props;
        const id = cell.getValue();
        return (
          <Dropdown>
            <MenuButton aria-label="More actions">
              <MoreHorizIcon />
            </MenuButton>
            <Menu slots={{ listbox: Listbox }} className="z-99999">
              <MenuItem
                onClick={() => {
                  setUpdateRow(row.original || undefined);
                  handleToggelModal();
                }}
              >
                Change Status
              </MenuItem>
            </Menu>
          </Dropdown>
        );
      },
    },
  ];


  const handleDelete = (id: string | null) => {
    if (!token) {
      toast.error("Token is missing.");
      return;
    }
    if (!id) {
      toast.error("Invalid room id.");
      return;
    }
    deleteRoomMutation.mutate(id);
  }
  const handleToggelModal = () => {
    console.log("handleToggelModalhandleToggelModalhandleToggelModal");
    
    setOpenModal(prv => !prv)
  }

  const hendleToogleBookingModel = () => {  
    setAddBookingModal(prev => !prev)
  }

  const handleClearRow = () => {
    setUpdateRow(undefined)
  }

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Enquiry" />
        <div className="flex gap-3">

          {/*  */}
          {/* <button
            onClick={handleToggelModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Gallery
          </button> */}
          {/*  */}
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

      <AddEnquiryPageModal
        handleToggelModal={handleToggelModal}
        openModal={openModal}
        updateRow={updateRow}
        handleClearRow={handleClearRow}
      />
  
    </>
  )
}

export default EnquiryPage