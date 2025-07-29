import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
  FormGroup,
} from "@mui/material"
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
}
  from "@mui/icons-material"

import { MoonLoader } from 'react-spinners'
import { boxstyle } from '../../config/style'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Terms from '../misc/Terms'

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [openTerms, setOpenTerms] = useState(false)
  const [checkedTerms, setCheckedTerms] = useState(false)
  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [username, password])


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password, checkedTerms }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/dashboard')
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response')
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.status === 401) {
        setErrMsg(err.data?.message)
      } else {
        setErrMsg(err.data?.message)
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  const errClass = errMsg ? "errmsg" : "offscreen"

  if (isLoading) return (
    <>
      <CssBaseline />
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

  const content = (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item >
            <Box sx={boxstyle}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src='/AREC.png'
                  style={{height: 120}}
                  alt="AREC logo"
                />    
            <Typography
                variant="h6"
                noWrap
                component="div"
              >
                A<small>FFILIATED</small> R<small>ENEWABLE</small> E<small>NERGY</small> C<small>ENTER</small>
              </Typography>
            <Typography
             
             variant="subtitle1"
             noWrap
             component="div"
             sx={{ marginTop: '-8px' }}
           >
             G<small>EOGRAPHIC</small> I<small>NFORMATION</small> S<small>YSTEM</small>
           </Typography>
                {/* <LazyLoadImage
                  src='/AREC4.webp'
                  height={120}
                  alt="Image Alt"
                  PlaceholderSrc='/AREC4sm.webp'
                  effect="blur"
                /> */}
                {/* <img
              style={{ height: 120 }}
              src="/AREC4.webp"
              loading="lazy"
              alt='Arec Logo'
            /> */}
                {/* <Typography component="h1" variant="h5">
            Log in
          </Typography> */}
                {errMsg ? <Alert ref={errRef} severity="error">{errMsg}</Alert> : null}
                <p ref={errRef} className={errClass} aria-live="assertive"></p>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    id="username"
                    ref={userRef}
                    value={username}
                    onChange={handleUserInput}
                    autoFocus
                  />
                  <TextField
                    margin="dense"
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={handlePwdInput}
                    value={password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <FormControlLabel
                    control={<Checkbox color="primary" id="persist" hidden onChange={handleToggle} checked={persist} />}
                    label="Remember me"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, color: '#fff806' }}
                  >
                    Sign In
                  </Button>
                  <FormGroup>
                    <FormControlLabel required control={<Checkbox size='small' checked={checkedTerms} onChange={(prev)=>setCheckedTerms(prev=>!prev)} />} label={<><small>I have read and understood the <Link onClick={()=>setOpenTerms(true)}>Terms of Use, Conditions and Privacy Policy</Link>.</small></>}/>
                  </FormGroup>
                  <Terms openTerms={openTerms} setOpenTerms={setOpenTerms}/>
                  <Grid container>
                    <Grid item xs>
                      {/* <Link href="#" style={{textDecoration: 'none'}} variant="body2">
                        Forgot password?
                      </Link> */}
                    </Grid>
                    <Grid item>
                      <Link to="/" style={{textDecoration: 'none'}} variant="body2">
                        {"Back"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

      </Container>
    </>
  )

  return content
}
export default Login