import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export type ServerList = {
  tag: string;
  url: string;
};

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [serverList, setServerList] = useState<Array<ServerList>>(
    JSON.parse(localStorage.getItem("serverList")) || []
  );

  const [tag, setTag] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [serverListString, setServerListString] = useState<string>(JSON.stringify(serverList, null, 2));

  const handleAddServer = () => {
    const newServerList = [...serverList, { tag, url }];
    setServerList(newServerList);
    setServerListString(JSON.stringify(newServerList, null, 2));
    setTag("");
    setUrl("");
  };

  const handleSave = () => {
    setServerList(JSON.parse(serverListString));
    localStorage.setItem("serverList", JSON.stringify(serverList));
    setOpen(false);
    window.location.reload();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        color: "transparent",
        "&:hover": {
          color: "grey",
        },
        transition: "color 0.1s ease-in-out",
      }}
    >
      <IconButton
        onClick={() => setOpen(true)}
        color="inherit"
        sx={{ position: "absolute", top: 0, left: 0 }}
      >
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
        <Box sx={{ p: 1 }}>
          <Typography
            variant="button"
            sx={{
              position: "absolute",
              top: 7,
              right: 40,
              "&:hover": {
                color: "slateblue",
              },
              transition: "color 0.1s ease-in-out",
              cursor: "pointer",
              zIndex: 1,
            }}
            onClick={handleSave}
          >
            SAVE
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Box>
              <TextField
                label="Server Tag"
                variant="standard"
                size="small"
                fullWidth
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <TextField
                label="Server URL"
                variant="standard"
                size="small"
                fullWidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button size="small" onClick={handleAddServer}>
                Add Server
              </Button>
            </Box>

            <TextField
              label="Raw"
              variant="standard"
              multiline
              rows={4}
              fullWidth
              value={serverListString}
              onChange={(e) => setServerListString(e.target.value)}
            />
          </Box>
          <IconButton
            sx={{ position: "absolute", top: 1, right: 1 }}
            onClick={() => setOpen(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Settings;
