import React from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const CustomizedMenu = ({ report }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [profile, setProfile] = React.useState(user);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{ float: "right", color: "black" }}
        >
          <MoreVertIcon />
        </IconButton>
      </div>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemText primary="Report Post" onClick={report} />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};

export default CustomizedMenu;
