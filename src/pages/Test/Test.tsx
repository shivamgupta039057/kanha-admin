import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { MaterialReactTable } from 'material-react-table';
import { Apiservice, imgBaseUrl } from '../../service/apiservice';
import localStorageKeys from '../../constant/localStorageKeys';
import apiEndPoints from '../../constant/apiendpoints';
import AddTestModal from './AddTestModal';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';
import { MRT_SortingState } from 'material-react-table';

interface UpdateRow {
  _id: string;
  image: string | null;
  specialization: string;
  createdAt: string;
  updatedAt: string;
}

const TestPage: React.FC = () => {
  const [specializationList, setSpecializationList] = useState<object[]>([]);
  const [data, setData] = useState<object[]>([]);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [updateRow, setUpdateRow] = useState<UpdateRow | undefined>(undefined);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const token = localStorage.getItem(localStorageKeys.token)
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
      header: 'Test Name',
      accessorKey: 'diagnosticName',
      enableSorting: true,
      size: 120
    },
    {
      header: 'Test Approx Price',
      accessorKey: 'TestAmount',
      enableSorting: true,
      size: 120,
      Cell: ({ cell }: { cell: { getValue: () => string | null } }) =>
        cell.getValue() || 'N/A',
    },
    {
      header: 'Image',
      accessorKey: 'diagnosticImages',
      enableSorting: false,
      size: 120,
      Cell: ({ cell }: { cell: { getValue: () => string | null } }) => {
        const imageUrl = cell.getValue();
        const fullImageUrl = imageUrl ? `${imgBaseUrl}/${imageUrl}` : 'http://www.listercarterhomes.com/wp-content/uploads/2013/11/dummy-image-square.jpg';
    
        return (
          <img
            src={fullImageUrl}
            alt="Medicine"
            style={{ width: 50, height: 50, borderRadius: '4px' }}
          />
        );
      },
    },
    {
      accessorKey: '_id',
      header: 'Actions',
      size: 120,
      enableSorting: false,
      Cell: ({ cell }: { cell: { getValue: () => string | null } }) => (
        <Dropdown>
          <MenuButton
            aria-label="More actions"
          >
            <MoreHorizIcon />
          </MenuButton>
          <Menu slots={{ listbox: Listbox }} className="z-99999">
            <MenuItem onClick={() => {
              const findObj = specializationList.find((obj: any) => obj._id === cell.getValue()) as UpdateRow | undefined;
              setUpdateRow(findObj || undefined);
              handleToggelModal()
            }}>
              Edit
            </MenuItem>
            <MenuItem onClick={() => {
              handleDelete(cell.getValue())
            }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
    },
  ];
  const handleDelete = async (id: string | null) => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }
      const body = {
        id: id
      }
      const res = await Apiservice.postAuth(apiEndPoints.diagnostic.delete, body, token);      
      if (res && res.data.status == 200) {
        toast.success("Delete Success")
        getSpecailization()
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

      let url = `${apiEndPoints.diagnostic.list}?search=${searchTerms ?? ""}&sortBy=${sorting[0]?.id ?? ""}&sortOrder=${sorting[0]?.desc ? "desc" : "asc"}&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}`
      
      const res = await Apiservice.getAuth(url, token);      
      if (res && res.data.status == 200) {
          
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
  }, [pageState, sorting, searchTerms]);
  const handleToggelModal = () => {
    setOpenModal(prv => !prv)
  }

  const handleClearRow = () => {
    setUpdateRow(undefined)
  }

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Test" />
        <div className="flex gap-3">
          <button
            onClick={handleToggelModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Test
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

      <AddTestModal
        handleToggelModal={handleToggelModal}
        openModal={openModal}
        updateRow={updateRow}
        handleClearRow={handleClearRow}
        getSpecailization={getSpecailization}
      />
    </>
  )
}

export default TestPage