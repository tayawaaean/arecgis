import { styled, TableRow } from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
}
export const boxwrapstyle = {
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 2,
  my: 1,
  // border: 1,
  // borderColor: 'primary.grey',
}

export const boxstyle = {
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 2,
  my: 1,
  boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)'
  // border: 1,
  // borderColor: 'primary.grey',

}

export const boxmain = {
  marginTop: 8,
  marginBottom: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
}

export const boxpaper = {
  '& > :not(style)': {
    m: 1,
    p: 2,
  },
}

export const scrollbarStyle = {
  overflow: "auto",
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: '0.3em',
  },
  '&::-webkit-scrollbar-track': {
    background: "#f1f1f1",

  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    background: "#4E4E62",
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555'
  }
}

export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow:'scroll',
  height: 580, 
  width: '90vw',
 
}

export const listItemStyle = {
  py: '0',
  textAlign: 'justify',
  justifyText: 'inter-word',
 
}

//table start
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))
//table end
