import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, Button, Box, Paper, Grid, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Alert, Tooltip
} from '@mui/material'
import { 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material/'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'
import { boxmain, boxpaper } from '../../config/style'
import { 
  useGetTransfersQuery,
  useApproveTransferMutation,
  useRejectTransferMutation
} from './transferApiSlice'
import { format } from 'date-fns'

const Transactions = () => {
    useTitle('ArecGIS | Transfers')
    const navigate = useNavigate()

    const { username, isManager, isAdmin } = useAuth()
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    
    // State for approval/rejection dialogs
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: '', // 'approve' or 'reject'
        transferId: null,
        transferData: null
    })
    const [notes, setNotes] = useState('')
    const [responseMessage, setResponseMessage] = useState({ message: '', severity: '' })

    // API mutations
    const [approveTransfer, { isLoading: isApproving }] = useApproveTransferMutation()
    const [rejectTransfer, { isLoading: isRejecting }] = useRejectTransferMutation()

    // Protected, paginated API call - different endpoints based on role
    const { data, isLoading, isError, error } = useGetTransfersQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        username: username,
        isAdmin: isAdmin || isManager // Pass a boolean flag for role-based filtering
    })

    const transfers = useMemo(() => {
        if (!data?.data) return []
        return data.data.map(row => ({ 
            ...row, 
            id: row._id,
            createdAtFormatted: format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm')
        }))
    }, [data])

    const meta = data?.meta || { page: 1, total: 0, limit: paginationModel.pageSize, totalPages: 1 }

    // Handle dialog opening and closing
    const openConfirmDialog = (type, transferId, transferData) => {
        setConfirmDialog({
            open: true,
            type,
            transferId,
            transferData
        })
        setNotes('')
        setResponseMessage({ message: '', severity: '' })
    }

    const closeConfirmDialog = () => {
        setConfirmDialog({
            open: false,
            type: '',
            transferId: null,
            transferData: null
        })
        setNotes('')
    }

    // Handle approve/reject actions
    const handleApproveReject = async () => {
        try {
            const { type, transferId } = confirmDialog
            
            if (type === 'approve') {
                await approveTransfer({ id: transferId, notes }).unwrap()
                setResponseMessage({ 
                    message: 'Transfer approved successfully!', 
                    severity: 'success' 
                })
            } else {
                await rejectTransfer({ id: transferId, notes }).unwrap()
                setResponseMessage({ 
                    message: 'Transfer rejected successfully!', 
                    severity: 'success' 
                })
            }
            
            // Close dialog after a short delay to show the success message
            setTimeout(() => {
                closeConfirmDialog()
            }, 1500)
        } catch (err) {
            setResponseMessage({ 
                message: err?.data?.message || 'An error occurred', 
                severity: 'error' 
            })
        }
    }

    // Handle view transfer details
    const handleViewDetails = (params) => {
        navigate(`/dashboard/transfers/${params.id}`)
    }

    // Render status as a colored chip
    const renderStatus = (params) => {
        const status = params.value
        let color = 'default'
        
        switch(status) {
            case 'pending':
                color = 'warning'
                break
            case 'approved':
                color = 'success'
                break
            case 'rejected':
                color = 'error'
                break
            default:
                color = 'default'
        }
        
        return <Chip label={status} color={color} size="small" />
    }

    // Render action buttons based on role and status
    const renderActionButtons = (params) => {
        const status = params.row.status
        
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(params)}
                >
                    View
                </Button>
                
                {(isAdmin || isManager) && status === 'pending' && (
                    <>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => openConfirmDialog('approve', params.row.id, params.row)}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => openConfirmDialog('reject', params.row.id, params.row)}
                        >
                            Reject
                        </Button>
                    </>
                )}
            </Box>
        )
    }

    const columns = [
    {
        field: 'action',
        headerName: 'Actions',
        headerAlign: 'center',
        width: 300,
        sortable: false,
        filterable: false,
        disableClickEventBubbling: true,
        renderCell: renderActionButtons,
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: renderStatus,
        disableClickEventBubbling: true,
    },
    {
        field: 'inventoryId',
        headerName: 'Inventory Details',
        width: 250,
        valueGetter: (params) => {
            const inventory = params.row.inventoryId || {}
            if (!inventory.properties) return 'N/A'
            return `${inventory.properties.ownerName} - ${inventory.properties.reCat}`
        },
        disableClickEventBubbling: true,
    },
    {
        field: 'previousInstallerId',
        headerName: 'Current Installer',
        width: 150,
        valueGetter: (params) => {
            // Handle different data structures
            const installer = params.row.previousInstallerId
            return (installer && installer.username) ? installer.username : 'N/A'
        },
        disableClickEventBubbling: true,
    },
    {
        field: 'newInstallerId',
        headerName: 'New Installer',
        width: 150,
        valueGetter: (params) => {
            // Handle different data structures
            const installer = params.row.newInstallerId
            return (installer && installer.username) ? installer.username : 'N/A'
        },
        disableClickEventBubbling: true,
    },
    {
        field: 'reason',
        headerName: 'Reason',
        width: 200,
        valueGetter: (params) => {
            const reason = params.row.reason || ''
            return reason.length > 50 ? `${reason.substring(0, 50)}...` : reason
        },
        disableClickEventBubbling: true,
    },
    {
        field: 'createdAtFormatted',
        headerName: 'Submitted Date',
        width: 150,
        disableClickEventBubbling: true,
    },
    {
        field: 'approvalDate',
        headerName: 'Processed Date',
        width: 150,
        valueGetter: (params) => params.row.approvalDate ? 
            format(new Date(params.row.approvalDate), 'yyyy-MM-dd HH:mm') : '',
        disableClickEventBubbling: true,
    },
    {
        field: 'processedBy',  // Renamed for clarity
        headerName: 'Processed By',
        width: 150,
        valueGetter: (params) => {
            // More robust approach to handle different data structures
            const approver = params.row.approvedBy;
            
            // If approvedBy exists
            if (approver) {
                // If it's an object with username property
                if (typeof approver === 'object' && approver.username) {
                    return approver.username;
                }
                // If it's just an ID or something else
                return String(approver);
            }
            return '';  // Return empty string if no approver
        },
        disableClickEventBubbling: true,
    },
    {
        field: 'notes',
        headerName: 'Notes',
        width: 200,
        disableClickEventBubbling: true,
    }
]

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error?.data?.message || 'Unknown error'}</div>

    return (
        <Container maxWidth="lg">
            <Box sx={boxmain}>
                <Box sx={boxpaper}>
                    <Paper elevation={3}>
                        <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
                            <Grid item>
                                <IconButton onClick={() => navigate(-1)}>
                                    <ArrowBackIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs>
                                <Typography component="h1" variant="h5">
                                    Transfer Requests
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Coming soon">
                                    <span>
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            disabled={true}
                                            startIcon={<AddIcon />}
                                        >
                                            New Transaction
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Box sx={{ mx: 2, mb: 2 }}>
                            <Box sx={{ height: '70vh', width: '100%' }}>
                                <DataGrid
                                    rows={transfers}
                                    columns={columns}
                                    pagination
                                    paginationMode="server"
                                    rowCount={meta.total}
                                    paginationModel={paginationModel}
                                    onPaginationModelChange={setPaginationModel}
                                    pageSizeOptions={[10, 20, 50, 100]}
                                    density="compact"
                                    disableRowSelectionOnClick
                                    slots={{ toolbar: GridToolbar }}
                                    slotProps={{
                                        toolbar: {
                                            printOptions: { disableToolbarButton: true },
                                            showQuickFilter: true,
                                            quickFilterProps: { debounceMs: 500 },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Approval/Rejection Dialog */}
            <Dialog 
                open={confirmDialog.open} 
                onClose={closeConfirmDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {confirmDialog.type === 'approve' ? 'Approve Transfer Request' : 'Reject Transfer Request'}
                </DialogTitle>
                <DialogContent>
                    {responseMessage.message && (
                        <Alert severity={responseMessage.severity} sx={{ mb: 2 }}>
                            {responseMessage.message}
                        </Alert>
                    )}
                    
                    {confirmDialog.transferData && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Transfer Details:
                            </Typography>
                            <Typography variant="body2">
                                <strong>From:</strong> {confirmDialog.transferData.previousInstallerId?.username || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>To:</strong> {confirmDialog.transferData.newInstallerId?.username || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Inventory:</strong> {confirmDialog.transferData.inventoryId?.properties?.ownerName || 'N/A'}
                            </Typography>
                        </Box>
                    )}
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        id="notes"
                        label={confirmDialog.type === 'approve' ? "Approval Notes (Optional)" : "Rejection Reason (Optional)"}
                        fullWidth
                        multiline
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleApproveReject} 
                        color={confirmDialog.type === 'approve' ? "success" : "error"}
                        variant="contained"
                        disabled={isApproving || isRejecting}
                    >
                        {confirmDialog.type === 'approve' ? "Approve" : "Reject"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Transactions