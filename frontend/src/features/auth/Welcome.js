import { Box, Button, Card, CardActions, CardContent, CardMedia, CssBaseline, Divider, Grid, Typography } from '@mui/material'
import { Container, Stack, Paper } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { styled } from '@mui/material/styles'
import Carousel from 'react-material-ui-carousel'
import MainFeaturedPost from '../../config/MainFeaturedPost'
import FeaturedPost from '../../config/FeaturedPost'


const Copyright = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)
    return (
        <Typography variant='body2' color='text.secondary' align='center' component={'div'} >
            {'Copyright © '}
            <Link color='inherit' href='https://localhost:3000/'>
                A<small>REC</small>GIS
            </Link>{''}
            {new Date().getFullYear()}
            {'.'}
            <p>{today}</p>
        </Typography>
    );
}


const mainFeaturedPost = {
    title: '𝗡𝗘𝗪𝗦 | 𝗠𝗠𝗦𝗨 𝗲𝗾𝘂𝗶𝗽𝘀 𝘁𝗿𝗮𝗶𝗻𝗲𝗿𝘀 𝗳𝗼𝗿 𝗿𝗲𝗻𝗲𝘄𝗮𝗯𝗹𝗲 𝗲𝗻𝗲𝗿𝗴𝘆 𝗰𝗼𝗺𝗽𝗲𝘁𝗲𝗻𝗰𝘆 𝗽𝗿𝗼𝗴𝗿𝗮𝗺',
    description:
        "True to its commitment to championing renewable energy development, Mariano Marcos State University (MMSU) has equipped a pool of trainers with executive competency skills on renewable energy.",
    image: '/mmsu-reecp.jpg',
    imageText: 'main image description',
    linkText: 'Continue reading…',
};

const featuredPosts = [
    {
        title: 'Benguet State University',
        date: 'Nov 12',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut   .',
        image: '/bsu.jpg',
        imageLabel: 'Image Text',
    },
    {
        title: 'DMMSU',
        date: 'Nov 11',
        description:
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        image: '/dmmsu.jpg',
        imageLabel: 'Image Text',
    },
];


const Welcome = () => {
    const navigate = useNavigate()
    const { username, isManager, isAdmin } = useAuth()
    
    const content = (
        <>
            <CssBaseline />

            <Container disableGutters maxWidth='sm' component='main' sx={{ pt: 8, pb: 6 }}>
                <Typography
                    component='h1'
                    variant='h2'
                    align='center'
                    color='text.primary'
                    gutterBottom
                >
                    Hello {username}!
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" component="p">
                Welcome to Affiliated Renewable Energy Center Geographic Information System (A<small>REC</small>GIS) <br/>
                 We are currently developing a GIS-based multi-platform application that can gather, manage, and analyze data of Renewable Energy Systems.
                </Typography>
                <Container maxWidth='md' sx={{ pt: 8, pb: 6 }} >
                    <Stack spacing={2} alignItems='center' justifyContent='center' direction='row' divider={<Divider orientation='vertical' flexItem />}>
                        <Button fullWidth variant='contained' sx = {{backgroundColor: "custom.error"}} onClick={() => navigate('/dashboard/inventories')}>Map Dashboard</Button>
                        <Button fullWidth variant='contained'  onClick={() => navigate('/dashboard/inventories/new')}>Assessment form</Button>
                    </Stack>

                </Container>
            </Container>
            {/* End hero unit */}
                {/* <Container maxWidth="lg"  sx={{
                        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                        mt: 8,
                        py: [3, 6],
                    }}>
                    <MainFeaturedPost post={mainFeaturedPost} />
                    <Grid container spacing={4}>
                        {featuredPosts.map((post) => (
                            <FeaturedPost key={post.title} post={post} />
                        ))}
                    </Grid>
                </Container> */}
            <Container
                maxWidth='md'
                component='footer'
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    mt: 8,
                    py: [3, 6],
                }}
            >
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </>
    )
    return content
}
export default Welcome