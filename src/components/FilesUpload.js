/**
 * PWA FinDeFes
 * update 06/2022
 * By Sergio Sam 
 */

import React, { useState, useEffect, useRef } from "react";
import UploadService from "../services/user.service";
import AuthService from "../services/auth.service";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import UserService from "../services/user.service";

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { mdiFileDocumentEditOutline } from "@mdi/js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400,
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
}));

const UploadFiles = ({ id, documento }) => {
  //console.log(id);
  //console.log(documento);
  const classes = useStyles();
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [progressInfos, setProgressInfos] = useState({ val: [] });
  const [message, setMessage] = useState([]);
  const [fileInfos, setFileInfos] = useState([]);
  const progressInfosRef = useRef(null)
  const [showClienteBoard, setShowClienteBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setShowClienteBoard(user.roles.includes("ROLE_CLIENTE"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    UploadService.getFiles(id, documento).then((response) => {
      setFileInfos(response.data);
    });


  }, []);

  const selectFiles = (event) => {
    setSelectedFiles(event.target.files);
    setProgressInfos({ val: [] });
  };

  const upload = async (idx, file) => {
    let _progressInfos = [...progressInfosRef.current.val];
    try {
      await UploadService.upload(id, file, documento, (event) => {
        _progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total
        );
        setProgressInfos({ val: _progressInfos });
      });
      setMessage((prevMessage) => ([
        ...prevMessage,
        "Archivo subido...: " + file.name,
      ]));
    } catch {
      _progressInfos[idx].percentage = 0;
      setProgressInfos({ val: _progressInfos });

      setMessage((prevMessage_1) => ([
        ...prevMessage_1,
        "No pudimos subir el archivo: " + file.name,
      ]));
    }
  };

  const eliminar = async (key,documento, id) => {
    const response = await UserService.delImage(id,documento, key);
    setData(data.concat(response.data))
    //cerrarEditar()

    UploadService.getFiles(id, documento).then((response) => {
      setFileInfos(response.data);
    })

  }


  const uploadFiles = () => {
    const files = Array.from(selectedFiles);

    let _progressInfos = files.map(file => ({ percentage: 0, fileName: file.name }));

    progressInfosRef.current = {
      val: _progressInfos,
    }

    const uploadPromises = files.map((file, i) => upload(i, file));

    Promise.all(uploadPromises)
      .then(() => UploadService.getFiles(id, documento))
      .then((files) => {
        setFileInfos(files.data);
      });

    setMessage([]);
  };

  return (
    <Paper>
      {progressInfos && progressInfos.val.length > 0 &&
        progressInfos.val.map((progressInfo, index) => (

          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" key={index} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(progressInfo.percentage,)}%`}</Typography>
            </Box>
          </Box>
        ))}

      <div className="row my-3">

        {showAdminBoard && (
          <div className="col-8">
            <label className="btn btn-default p-0">
              <input type="file" multiple onChange={selectFiles} />
            </label>
          </div>
        )}

        {showAdminBoard && (
          <div className="col-4">
            <Button
              color="primary"
              type="submit"
              disabled={!selectedFiles}
              onClick={uploadFiles}
            >
              Subir archivo
            </Button>
          </div>
        )}

      </div>

      {message.length > 0 && (
        <div className="alert alert-secondary" role="alert">
          <ul>
            {message.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        </div>
      )}

      <div className={classes.root}>
        <List component="nav" aria-label="main mailbox folders" dense={true}>
          {fileInfos &&
            fileInfos.map((file, index) => (
              <ListItem id={index}>
                <Link href={file.url}>
                  {file.real
                    ? <ListItemText primary={file.real} />
                    : <ListItemText primary={file.name} />
                  }
                </Link>

                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <Link onClick={() => eliminar(file.name,documento, id)}>
                      {showAdminBoard && (
                        <DeleteIcon />
                      )}
                    </Link>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
        <Divider />
      </div>

    </Paper>
  );
};

export default UploadFiles;
