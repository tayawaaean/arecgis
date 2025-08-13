import { CssBaseline, Grid } from "@mui/material"
import { useGetBlogsQuery } from "./blogsApiSlice"
import Blog from "./Blog"
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'
import SectionLoading from '../../components/SectionLoading'

const BlogsMap = () => {
    useTitle('ArecGIS | Map Dashboard')

    const {
        data: blogs,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBlogsQuery('BlogList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let content

    if (isLoading) content = <SectionLoading label="Loading blogs…" />

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
        
        const { ids, entities } = blogs

        const tableContent = ids?.length
            ? <Blog />
            : null
    
        content = (
            <div>
            {tableContent}
            </div>

        )
    }

    return content
}
export default BlogsMap