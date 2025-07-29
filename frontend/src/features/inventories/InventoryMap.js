import { Container, CssBaseline, Grid } from "@mui/material"
import { useGetInventoriesQuery } from "./inventoriesApiSlice"
import Inventory from "./Inventory"
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'
import { MoonLoader } from 'react-spinners'

const InventoriesMap = () => {
    useTitle('ArecGIS | Map Dashboard')

    const {
        data: inventories,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetInventoriesQuery('REList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let content

    if (isLoading) content = 
    (
        <>
        <CssBaseline/>
        <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item >
                <MoonLoader color={"#fffdd0"} />
            </Grid>
        </Grid>
        </>
    )

    if (isError) {
        content = (
            <>
            <CssBaseline/>
            <Grid
                spacing={0}
                direction="row"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item >
                    <p>{error?.data?.message}</p>
                </Grid>
            </Grid>
            </>
        )
        
    }


    if (isSuccess) {
        
        const { ids, entities } = inventories

        const tableContent = ids?.length
            ? <Inventory />
            : null
    
        content = (
            <>
               
                    {tableContent}
              
            </>
        )
    }

    return content
}
export default InventoriesMap