import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core'
import {Alert} from '@material-ui/lab'

const styles = makeStyles(()=>({
  root:{
    marginBottom: "1.5rem",
    width: '100%',
  }
}))

const Message = ({ msg }) => {
  const classes = styles()
  const [open, setOpen] = useState(true)
  return (
    <div className={open ? (classes.root):(undefined)}>
      {
        open && msg["type"] && msg["type"] === "err" && <Alert severity="error" variant="filled" onClose={() => {setOpen(false)}}>{msg["msg"]}</Alert>
      }
      {
        open && !msg["type"] && <Alert  variant="filled" onClose={() => {setOpen(false)}}>{msg["msg"]}</Alert>
      }
    </div>
  );
};

export default Message;
