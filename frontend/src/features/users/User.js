import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersApiSlice'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box } from '@mui/material'
import { memo } from 'react'
import EditIcon from '@mui/icons-material/Edit'

const User = ({ userId }) => {

    const userS = useSelector(selectAllUsers)

    const navigate = useNavigate()

    if (userS) {
        const handleEdit = (params) => navigate(`/dashboard/users/${params.id}`)
        const renderEditButton = (params) => {
            
            return (
                    <Button
                        variant="contained"
                        sx = {{backgroundColor: "primary"}}
                        size="small"
                        style={{ margin: 'auto' }}
                        onClick={()=>{handleEdit(params)}}
                        endIcon={<EditIcon fontSize='large' />}
                    >
                        Edit
                    </Button>
            )
        }
        const columns = [
            {
                field: 'username',
                headerName: 'Username',
                width: 130,
                disableClickEventBubbling: true,
            },
            {
                field: 'roles',
                headerName: 'Roles',
                width: 230,
                disableClickEventBubbling: true,
            },
            {
                field: 'action',
                headerName: 'Action',
                headerAlign: 'center',
                width: 130,
                sortable: false,
                renderCell: renderEditButton,
                disableClickEventBubbling: true,
            },
          ];
        
        // const userRolesString = user.roles.toString().replaceAll(',', ', ')

        // const cellStatus = user.active ? '' : 'table__cell--inactive'

        return (
            <>
            <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={userS}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            
            {/* <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr> */}
            </>
        )

    } else return null
}
const memoizedUser = memo(User)

export default memoizedUser