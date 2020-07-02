import React, { Fragment, useState } from 'react';
import Message from './Message';
import axios from 'axios';
import SvgEditor from "./SvgEditor"
import {
  Paper, 
  Grid, 
  LinearProgress,
  Button,
  CircularProgress
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles'

const styles = makeStyles(theme=>({
    paper:{
      padding: '15px',
      textAlign: 'center',
      color:'white',
      fontWeight: 'bold'
    },

    colors:{
      marginTop: "10px",
      marginBottom: "10px"
    }

}))
const FileUpload = () => {
  const classes = styles()
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [colors, setColors] = useState([]);
  const [message, setMessage] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [paths, setPaths] = useState([])

  const sumReducer=(total, num)=>{
    return total + num
  }
  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const sentPaths = e =>{
    setUploadPercentage(0)
    setFile('');
    setFilename('Choose File');
  }

  const onSubmit = async e => {
    setPaths([])
    setColors([])
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        }
      });
      const { colors, paths } = res.data;
      setColors(colors)
      setPaths(paths)
      setMessage({msg:'File Uploaded'});
    } catch (err) {
      if (err.response.status === 500) {
        setMessage({msg:'There was a problem with the server', type:'err'});
      } else {
        setMessage({msg:err.response.data.msg, type:'err'});
      }
    }
  };

  return (
    <Fragment>
      {message['msg'] && <Message msg={message} /> }
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <LinearProgress variant="determinate" value={uploadPercentage}  />

        <Button
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
          variant="contained"
          color="primary"
          disabled={uploadPercentage!==0 || filename.length === 0 || filename === 'Choose File'}
        >Upload</Button>
      </form>
      <Grid container spacing={2} className={classes.colors}>
      {
        colors.length > 0  && colors.map((color, i)=>{
          return(
            <Grid item xs={2} key={i}>
              <Paper className={classes.paper} style={{'backgroundColor':`rgb(${color})`, 
                'color': color.split(",").map(x=>parseInt(x)).reduce(sumReducer) < 600 ?('white'):('black')}}>
                {
                color
                }
              </Paper>
            </Grid>
          )
        })
      }
      </Grid>
      <Grid container justify='center'>
        {
          // paths.length > 0 && <SvgEditor paths={paths} got={sentPaths}/>
          <SvgEditor paths={paths} got={sentPaths}/>
        }
        {
          uploadPercentage === 100 && <CircularProgress/>
        }

      </Grid>
    </Fragment>
  );
};

export default FileUpload;
