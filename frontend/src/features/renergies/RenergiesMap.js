import { CssBaseline, Grid } from "@mui/material"
import { useGetRenergiesQuery } from "./renergiesApiSlice"
import Renergy from "./Renergy"
import useTitle from '../../hooks/useTitle'
import { MoonLoader } from 'react-spinners'

const RenergiesMap = () => {
    useTitle('ArecGIS | Map Dashboard')

    const {
        data: renergies,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetRenergiesQuery('REList', {
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
                container
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
        
        const { ids } = renergies

        const tableContent = ids?.length
            ? <Renergy />
            : null
    
        content = (
            <div>
            {tableContent}
            </div>

        )
    }

    return content
}
export default RenergiesMap