import 'react-quill/dist/quill.snow.css'
import React, { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewBlogMutation } from "./blogsApiSlice"

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
  Grid,
  Typography,
  IconButton,
} from "@mui/material"
import { boxstyle } from '../../config/style'
import useAuth from "../../hooks/useAuth"
import {
  Upload as UploadFileIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import ReactQuill from "react-quill"

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
}
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

const NewBlogForm = ({ allUsers }) => {

  const [addNewBlog, { isLoading, isSuccess, isError, error }] = useAddNewBlogMutation()
  const { username, isManager, isAdmin, } = useAuth()
  const getUserId = allUsers.filter(user => user.username === username)
  const getFilteredID = Object.values(getUserId).map((user) => user.id).toString()

  useEffect(() => {
    if (!isManager || !isAdmin) {
      setUserId(getFilteredID)
    }
  }, [getFilteredID])

  const navigate = useNavigate()

  const [blogTitle, setBlogTitle] = useState("")
  const [blogSummary, setBlogSummary] = useState("")
  const [blogContent, setBlogContent] = useState("")
  const [myUploads, setmyUploads] = useState("")
  const [filenames, setFilenames] = useState([])
  const [userId, setUserId] = useState("")

  useEffect(() => {
    if (isSuccess) {
      setBlogTitle("")
      setBlogSummary("")
      setFilenames("")
      setmyUploads("")
      navigate("/dashboard/blogs")
    }
  }, [isSuccess, navigate])

  const onBlogTitleChanged = (e) => setBlogTitle(e.target.value)
  const onBlogSummaryChanged = (e) => setBlogSummary(e.target.value)
  const onBlogContentChanged = (e) => setBlogContent(e)
  const onmyUploadsChanged = (e) => setmyUploads(e.target.files)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const canSave =
    [
      blogTitle,
      blogSummary,
      blogContent,
      userId,
    ].every(Boolean) && !isLoading

  const onSaveBlogClicked = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("user", userId)
    data.append("blogTitle", blogTitle)
    data.append("blogSummary", blogSummary)
    data.append("blogContent", blogContent)


    const files = e.target.myUploads.files
    if (files.length != 0) {
      for (const file of files) {
        data.append("myUploads", file)

      }

    }
    

    if (canSave) {
      await addNewBlog(data)
      // await addNewBlog({ type, coordinates, myUploads, properties: { user: userId, title, reCat, address:{country, region, province, city, brgy} } })
    }
  }

    useEffect(()=>{
      setFilenames(Object.values(myUploads).map( (item)=>item.name))
    },[myUploads])




  // const errClass = isError ? "errmsg" : "offscreen"
  // const validTitleClass = !title
  //   ? "form__input--incomplete"
  //   : ""
  // const validCountryClass = !country ? "form__input--incomplete" : ""

  const content = (
    <>
      <p>{error?.data?.message}</p>
      <Container maxWidth="sm" sx={{ bgcolor: 'primary' }}>

        <form onSubmit={onSaveBlogClicked}>
          <Box
            sx={{
              minHeight: "100vh",
              maxWidth: "100%",
              "& .MuiTextField-root": { my: 1 },
            }}
          >
            <Box
              sx={boxstyle}
            >
              <Grid container>
                <Grid item xs>
                  <Typography component="h1" variant="h5">
                    New Blog
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => navigate("/dashboard")}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <TextField
                fullWidth
                size="small"
                label="Title"
                id="blogTitle"
                name="blogTitle"
                type="text"
                value={blogTitle}
                onChange={onBlogTitleChanged}
              />
              <TextField
                fullWidth
                size="small"
                id="blogSummary"
                name="blogSummary"
                label="Blog Summary"
                type="text"
                value={blogSummary}
                onChange={onBlogSummaryChanged}
              />

              <ReactQuill value={blogContent} onChange={onBlogContentChanged} modules={modules} formats={formats}/>

              {isManager || isAdmin ?
                <TextField
                  fullWidth
                  size="small"
                  id="user"
                  select
                  label="Assigned to:"
                  value={userId || ""}
                  onChange={onUserIdChanged}
                >
                  {allUsers.map((users) => (
                    <MenuItem key={users.id} value={users.id}>
                      {users.username}
                    </MenuItem>
                  ))}
                </TextField> : ""
              }
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >
                Add Images
                <input
                  type="file"
                  id="myUploads"
                  name="myUploads"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={onmyUploadsChanged}
                />
              </Button>
              {filenames}
            </Box>
            
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{ my: 1 }}
                disabled={!canSave}
              >
                Save
              </Button>

             
            </Box>
          </Box>
        </form>
      </Container>
    </>
  )
  return content
}

export default NewBlogForm
