import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import { MaterialReactTable, MRT_SortingState } from 'material-react-table';
import { useSelector } from 'react-redux';

const Patient: React.FC = () => {
    const [patient, setPatient] = useState([])
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [searchTerms, setSearchTerm] = useState<string>("")
    const [totalPages, setTotalPages] = useState<number>(1);
    const Tokendfddfd = useSelector((state) => state.auth.accessToken);
    const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
    const token = localStorage.getItem(localStorageKeys.token);
//    console.log("TokendfddfdTokendfddfd" , Tokendfddfd);
   
    const columns = [
        {
            header: 'ID',
            accessorKey: "SrNo",
            enableSorting: false,
            size: 70
        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableSorting: true,
            size: 120
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            size: 120,
            Cell: ({ cell }: { cell: { getValue: () => string } }) => {
                const date = new Date(cell.getValue());
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            },
            enableSorting: true,
        },
        {
            header: 'Update At',
            accessorKey: 'updatedAt',
            size: 120,
            Cell: ({ cell }: { cell: { getValue: () => string } }) => {
                const date = new Date(cell.getValue());
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            },
            enableSorting: false,
        }
    ];

    const getPatient = async () => {
        try {
            if (!token) {
                throw new Error("Token is missing.")
            }


            let url = `${apiEndPoints.patient.list}?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&role=patient`

            if (sorting.length) {
                url = url + `&sortBy=${sorting[0]?.id}&sortOrder=${sorting[0]?.desc ? "desc" : "asc"}`
            }
            if (searchTerms) {
                url = url + `&search=${searchTerms}`
            }

            const res = await Apiservice.getAuth(url, token)
            if (res && res.data.success) {
                const newarr = res.data.data.documents.map((obj: object, index: number) => {
                    return { ...obj, SrNo: index + 1 + pageState.pageIndex * pageState.pageSize }
                })
                setPatient(newarr)
                setTotalPages(res.data.data.pagination?.totalChildrenCount);
            }
            else{
                setPatient([])
            }
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getPatient()
    }, [pageState, sorting, searchTerms])
    return (
        <>
            <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
                <Breadcrumb pageName="Patient" />
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
        </>
    )
}

export default Patient