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
import { ROUTES_CONST } from '../../constant/routeConstant';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_GET_ALL_USER, API_ROOM_DELETE, API_ROOM_GET } from '../../utils/APIConstant';
import { useSelector } from 'react-redux';
import AddRoomsBooking from './AddRoomsBooking';


interface UserData {
  _id: string;
  firstname: string;
  phone: string | number;
  isBlocked: boolean;
  // Add other fields as needed
}

const GetAllUser: React.FC = () => {
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [updateRow, setUpdateRow] = useState<UpdateRow | undefined>(undefined);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [data, setData] = useState<object[]>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  // const token = localStorage.getItem(TOKEN_NAME);
  const token = useSelector((state: any) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
console.log("openModalopenModalopenModal" , openModal);

  const { data: roomData } = useQuery({
    queryKey: ["get-all-users"],
    queryFn: () =>
      Apiservice.getAuth(`${API_GET_ALL_USER}`, token ?? ""),
    staleTime: 5 * 60 * 1000,
  });

  console.log("roomDataroomData", roomData);
  useEffect(() => {
    if (roomData) {
      setData(roomData?.data?.data?.users);
      setTotalPages(roomData?.data?.pagination?.totalItems ?? 0)
    }
  }, [roomData]);

  // here is the delete function 
  const checkBoxRoomMutation = useMutation({
    mutationFn: async (id: string) => {
      return await Apiservice.postAuth(`${API_ROOM_DELETE}/${id}`, {}, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-roomData"] });
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

  // Define a type for user data to avoid lint errors and for type safety


  const columns: MRT_ColumnDef<UserData>[] = [
    {
      header: 'ID',
      accessorKey: 'SrNo',
      enableSorting: false,
      size: 70,
      Cell: ({ row }) => row.index + 1,
    },
    {
      header: 'First Name',
      accessorKey: 'firstname',
      enableSorting: true,
      size: 120,
      Cell: ({ cell }) => {
        const value = cell.getValue<string | null>();
        return value || 'N/A';
      },
    },
    {
      header: 'Mobile No.',
      accessorKey: 'phone',
      enableSorting: true,
      size: 120,
      Cell: ({ cell }) => {
        const value = cell.getValue<string | number | null>();
        return value ?? 'N/A';
      },
    },
    {
      header: 'Blocked',
      accessorKey: 'isBlocked',
      enableSorting: false,
      size: 100,
      Cell: ({ cell, row }) => {
        const isBlocked = cell.getValue<boolean>();
        const userId = row.original._id;
        return (
          <input
            type="checkbox"
            checked={!!isBlocked}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
            aria-label={isBlocked ? "Blocked" : "Active"}
            onClick={() => {
              if (userId) {
                checkBoxRoomMutation.mutate(userId);
              }
            }}
            readOnly={false}
          />
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
                  // Navigate to room-type/:id with _id
                  navigate(`${ROUTES_CONST.VIEW_USER_BOOKING}/${id}`);
                }}
              >
                View Booking
              </MenuItem>
              
            </Menu>
          </Dropdown>
        );
      },
    },
  ];


  const handleToggelModal = () => {
    console.log("handleToggelModalhandleToggelModalhandleToggelModal");
    
    setOpenModal(prv => !prv)
  }

  const handleClearRow = () => {
    setUpdateRow(undefined)
  }

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Users" />
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
    </>
  )
}

export default GetAllUser