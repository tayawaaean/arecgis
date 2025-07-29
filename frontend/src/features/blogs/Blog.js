import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAllBlogs } from './blogsApiSlice'

import { useSelector } from 'react-redux'
import { Container, Grid } from '@mui/material'
import FeaturedPost from './FeaturedPost'


const Blog = () => {

  const blogs = useSelector(selectAllBlogs)
  const navigate = useNavigate()
  const onAddClicked = () => navigate("/dashboard/blogs/new")
  console.log(blogs)

  if (blogs) {
    
      // const handleEdit = () => navigate(`/dashboard/blog/${blogId}`)
    return (
      <>
      <div>haha</div>
        <Container maxWidth="lg" sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}>
          {/* <MainFeaturedPost post={mainFeaturedPost} /> */}
          <Grid container spacing={4}>
            {blogs.map((post) => (
              <FeaturedPost key={post.blogTitle} post={post} />
            ))}
          </Grid>
        </Container>
      </>
    )
  } else return null
}
const memoizedBlog = memo(Blog)
export default memoizedBlog