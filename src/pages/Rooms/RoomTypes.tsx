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
import AddRoomsNumber from './AddRoomNumber';
import { useSelector } from 'react-redux';
import { API_ROOM_DELETE, API_ROOM_DELETE_NUMBER, API_ROOM_GET, API_UPDATE_ROOM_STATUS, API_VIEW_ROOM } from '../../utils/APIConstant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AddRoomsBooking from './AddRoomBooking';
import { ROUTES_CONST } from '../../constant/routeConstant';


interface UpdateRow {
  _id: string;
  image: string | null;
  specialization: string;
  createdAt: string;
  updatedAt: string;
}

const RoomTypes: React.FC = () => {
  const [data, setData] = useState<object[]>([]);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [updateRow, setUpdateRow] = useState<UpdateRow | undefined>(undefined);
  const [UpdateBookingRow, setUpdateBookingRow] = useState<UpdateRow | undefined>(undefined);

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const [AddOpenModal , setAddOpenModal] = useState<boolean>(false);
  
  const [AddBookingModal , setAddBookingModal] = useState<boolean>(false);
  // const token = localStorage.getItem(localStorageKeys.token);
  const token = useSelector((state: any) => state.auth.accessToken);  
  const param = useParams();
  const navigate = useNavigate();  
  const queryClient = useQueryClient();

  console.log("updateRowupdateRowupdateRow", param);


  const { data: roomData } = useQuery({
    queryKey: ["get-room-view"],
    queryFn: () =>
      Apiservice.getAuth(`${`${API_VIEW_ROOM}/${param?.roomId}`}?search=${""}`, token ?? ""),
    staleTime: 5 * 60 * 1000,
  });

  console.log("roomDataroomData", roomData);
  useEffect(() => {
    if (roomData) {
      setData(roomData?.data?.data?.rooms);
      setTotalPages(roomData?.data?.pagination?.total ?? 0);
    }
  }, [roomData]);

  // React Query mutation for updating room status
  const updateRoomStatusMutation = useMutation({
    mutationFn: async ({ roomId, status }: { roomId: string, status: boolean }) => {
      return await Apiservice.postAuth(
        `${API_UPDATE_ROOM_STATUS}/${roomId}`,
        { isAvailable: status },
        token
      );
    },
    onSuccess: (res: any, variables) => {
      if (res && res.data.status) {
        toast.success("Room status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["get-room-view"] });
      } else {
        toast.error(res?.data?.message || "Failed to update room status.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while updating the room status.");
    },
  });

  // Usage: call this function from your UI event handler, passing the roomId and new status
  const handleStatusChange = (roomId: string, checked: boolean) => {
    const newStatus = checked ? 'active' : 'inactive';
    console.log("newStatusnewStatusnewStatus",checked, newStatus, roomId);
    
    updateRoomStatusMutation.mutate({ roomId, status: checked });
  };
  
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
      header: 'Room ID',
      accessorKey: "roomNumber",
      size: 70,
      enableColumnActions: false,
    },
    {
      header: 'Status',
      accessorKey: 'isAvailable',
      size: 100,
      enableColumnActions: false,
      enableSorting: false,
      Cell: ({ row }: { row: any }) => {
        const checked = row.original.isAvailable === true || row.original.isAvailable === 'active';
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => handleStatusChange(row.original._id, event.target.checked)}
            style={{ width: 20, height: 20 }}
          />
        );
      },
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
                setAddOpenModal(true);
                // handleToggelModal();
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(`${ROUTES_CONST.ROOM_BOOKING_VIEW}/${row.original._id}`)
              }}
            >
              View Booking
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAddBookingModal(true);
                setUpdateBookingRow(row.original)
              }}
            >
              Add Booking
            </MenuItem>
          
            <MenuItem
              onClick={() => {
                handleDelete.mutate(row?.original._id);
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
    }
    
  ];


  
  const handleDelete = useMutation({
    mutationFn: async (id: string) => {
      return await Apiservice.postAuth(`${API_ROOM_DELETE_NUMBER}/${id}`, {}, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-room-view"] });
        toast.success("Room deleted successfully");
      } else {
        toast.error(res?.data?.message || "Failed to delete room.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while deleting the room.");
    },
  });
 
  const handleToggelModal = () => {
    setAddOpenModal(prev => !prev);
  }

  const hendleToogleBookingModel = () => {
    setAddBookingModal(prev => !prev)
  }


  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Rooms" />
        <div className="flex gap-3">
          <button
            onClick={handleToggelModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Rooms
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

      <AddRoomsNumber
        openModal={AddOpenModal}
        setOpenAddModal={setAddOpenModal}
        handleToggelModal={handleToggelModal}
        setUpdateRow={setUpdateRow}
        updateRow={updateRow}
        param={param?.roomId ?? ""}
      />
      <AddRoomsBooking
      handleToggelModal = {hendleToogleBookingModel}
      openModal = {AddBookingModal}
      UpdateBookingRow={UpdateBookingRow}
      />
    </>

    
  )
}

export default RoomTypes