import React, { Component } from "react";
import classes1 from "./Post.css";
import Modal from "./../UI/Modal/Modal";
import Aux from "./../../hoc/Auxil/Auxil";
import Button from "./../UI/Button/Button";
import UserContext from "./../../hoc/Context/UserContext";
import { FaUserEdit } from "react-icons/fa";

import { Card } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import {
  AiFillLike,
  AiFillDislike,
  AiFillDelete,
  AiOutlineLike,
  AiOutlineDislike,
  AiTwotoneEdit,
} from "react-icons/ai";

const useStyles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  root1: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
});

class Post extends Component {
  state = {
    showMore: false,
  };

  static contextType = UserContext;
  // const value = useContext(UserContext);
  // let dropdown;
  // if (this.props.userRole === "admin") {
  //   dropdown = (
  //     <span>
  //       <Button btnType="Danger" clicked={props.blacklistPost}>
  //         Blacklist
  //       </Button>
  //     </span>
  //   );
  // }

  showMoreHandler = () => {
    this.setState({ showMore: !this.state.showMore });
  };
  classes1;
  render() {
    const { classes } = this.props;
    let date = new Date(this.props.date).toDateString();
    let day = date.slice(0, 3);
    let date1 = date.slice(3);
    date = day + "," + date1;

    let like = (
      <AiOutlineLike
        onClick={this.context.isLoggedin ? this.props.upvote : null}
        cursor={this.context.isLoggedin ? "pointer" : null}
        color="rgba(151, 146, 146, 0.609)"
        size="24px"
        style={{ transform: "translateY(-2px)" }}
      />
    );
    let Dislike = (
      <AiOutlineDislike
        onClick={this.context.isLoggedin ? this.props.downvote : null}
        cursor={this.context.isLoggedin ? "pointer" : null}
        color="rgba(151, 146, 146, 0.609)"
        size="24px"
        style={{ transform: "translateY(2px)" }}
      />
    );
    for (let i = 0; i < this.props.upvotedBy.length; i++) {
      if (this.props.upvotedBy[i].id === this.context.user._id) {
        like = (
          <AiFillLike
            onClick={this.context.isLoggedin ? this.props.upvote : null}
            cursor={this.context.isLoggedin ? "pointer" : null}
            color={this.context.isLoggedin ? "rgb(107, 210, 245)" : null}
            size="24px"
          />
        );
      }
    }
    for (let i = 0; i < this.props.downvotedBy.length; i++) {
      if (this.props.downvotedBy[i].id === this.context.user._id) {
        Dislike = (
          <AiFillDislike
            onClick={this.context.isLoggedin ? this.props.downvote : null}
            cursor={this.contextisLoggedin ? "pointer" : null}
            color={this.context.isLoggedin ? "rgb(151, 100, 100)" : null}
            size="24px"
          />
        );
      }
    }
    const deletePostmessage = (
      <div>
        <h2>Delete Post</h2>
        <p style={{ fontSize: "18px" }}>
          Are you sure you wish to delete this answer? This action can be
          undone.
        </p>
        <Button btnType="Cancel" clicked={this.props.goBack}>
          Cancel
        </Button>
        <Button btnType="Danger" clicked={this.props.deletePost}>
          Delete Post
        </Button>
      </div>
    );
    const updatePostmessage = (
      <div>
        <h2>Update Post</h2>
        <p style={{ fontSize: "18px" }}>
          If you wish to edit your post , please click on update
        </p>
        <Button btnType="Cancel" clicked={this.props.goBack}>
          Cancel
        </Button>
        <Button btnType="Danger" clicked={this.props.editPost}>
          Update
        </Button>
      </div>
    );
    const blacklistPostmessage = (
      <div>
        <h2>Blacklist Post</h2>
        <p>
          Are you sure you wish to blacklist thispost? This action can be
          undone.
        </p>
        <Button btnType="Cancel" clicked={this.props.goBack}>
          Cancel
        </Button>
        <Button btnType="Danger" clicked={this.props.blacklistPost}>
          Blacklist Post
        </Button>
      </div>
    );

    const allComments = this.props.comments.map((value, key) => {
      return (
        <ListItem alignItems="flex-start" key={key}>
          <ListItemText
            primary={
              <div style={{ textTransform: "capitalize" }}>{value.author}</div>
            }
            secondary={<React.Fragment>{value.comment}</React.Fragment>}
          />
        </ListItem>
      );
    });

    return (
      <Aux>
        <Modal show={this.props.show}>{deletePostmessage}</Modal>
        <Modal show={this.props.confirm}>{updatePostmessage}</Modal>
        <Modal show={this.props.showConfirmMessage}>
          {blacklistPostmessage}
        </Modal>
        <Card style={{ padding: "30px", borderRadius: "0px" }}>
          {/* <h1 className={classes1.Heading}>{this.props.title}</h1> */}
          <div className={classes1.SecondHeader}>
            <p className={classes1.Author}>
              <FaUserEdit color="rgb(104, 146, 76)" size="22px" />
              <span
                className={classes1.HeadSpace}
                // style={{ marginBottom: '60px' }}
              >
                {this.props.author}
              </span>
            </p>
            <p className={classes1.Date}>{date}</p>
          </div>
          <div className={classes1.Body}>
            {this.props.body.length > 200 ? (
              !this.state.showMore ? (
                <p>
                  {this.props.body.slice(0, 200)}
                  <span
                    className={classes1.Read}
                    onClick={this.showMoreHandler}
                  >
                    ...Read More
                  </span>
                </p>
              ) : (
                <p>
                  {this.props.body}
                  <span
                    className={classes1.Read}
                    onClick={this.showMoreHandler}
                  >
                    ...Show Less
                  </span>
                </p>
              )
            ) : (
              <p>{this.props.body}</p>
            )}
          </div>

          <hr></hr>
          {/* <br></br> */}

          <div className={classes1.Properties}>
            <div style={{ display: "flex" }}>
              <p className={classes1.Votes}>
                {like}
                <span className={classes1.Spacing}>{this.props.upvotes}</span>
              </p>
              <p className={classes1.Votes}>
                {Dislike}
                <span className={classes1.Spacing}>{this.props.downvotes}</span>
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p className={classes1.Votes}>
                {this.props.userRole === "admin" ? (
                  <Button btnType="Danger" clicked={this.props.blacklistPost}>
                    Blacklist
                  </Button>
                ) : null}
              </p>
              <p className={classes1.Votes}>
                {this.props.editPost ? (
                  <AiTwotoneEdit
                    onClick={this.props.checkUpdate}
                    // selected={this.state.upvoted}
                    cursor="pointer"
                    color="grey"
                    size="32px"
                    style={{ marginRight: "10px" }}
                  />
                ) : null}
              </p>
              <p className={classes1.Votes}>
                {this.props.deletePost ? (
                  <AiFillDelete
                    onClick={this.props.checkdelete}
                    // selected={this.state.upvoted}
                    cursor="pointer"
                    color="grey"
                    size="26px"
                    style={{ marginLeft: "10px" }}
                  />
                ) : null}
              </p>
            </div>
          </div>
        </Card>
        <div className={classes.root}>
          <Accordion style={{ borderRadius: "0px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Comments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {this.props.comments.length != 0 ? (
                <List className={classes.root1}>{allComments}</List>
              ) : (
                <Typography>No comments for the post</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </Aux>
    );
  }
}

export default withStyles(useStyles)(Post);
