/**
 * PWA FinDeFes
 * update 07/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useOnlineStatus } from "./useOnlineStatus";
import WifiIcon from '@mui/icons-material/Wifi';
import { green } from '@mui/material/colors';
import { red } from '@mui/material/colors';

export default function Online() {

  const isOnline = useOnlineStatus();

  return (
    <>
      {isOnline ? (
        <span>
          <WifiIcon
            style={{ color: green[500] }}
          />Online
        </span>
      ) : (
        <span>
          <WifiIcon
            style={{ color: red[500] }}
          />Offline
        </span>
      )}
    </>

  );
}
