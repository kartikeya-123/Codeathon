import React, { Component } from "react";
import classes1 from "./Post.css";
import Modal from "./../UI/Modal/Modal";
import Aux from "./../../hoc/Auxil/Auxil";
import Button from "./../UI/Button/Button";
import UserContext from "./../../hoc/Context/UserContext";
import { FaUserEdit } from "react-icons/fa";
import axios from "axios";
import {
  AiFillLike,
  AiFillDislike,
  AiFillDelete,
  AiOutlineLike,
  AiOutlineDislike,
  AiTwotoneEdit,
} from "react-icons/ai";

import { Card, Button as Button2, IconButton } from "@material-ui/core";
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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import CommentIcon from "@material-ui/icons/Comment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  FacebookButton,
  FacebookCount,
  LinkedInButton,
  LinkedInCount,
  TwitterButton,
  TwitterCount,
} from "react-social";
import CustomizedMenu from "./dots";

const getStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgb(0,0,0,0.03)",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

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
  root2: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgb(0,0,0,0.03)",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});

class Post extends Component {
  state = {
    showMore: false,
    comments: [],
    commentMessage: " ",
    url: " ",
    data: "",
    anchorEl: null,
  };

  componentDidMount() {
    // let url = window.location.href;
    // url = url + "/post/" + this.props.postId;
    let url = "https://material-ui.com/components/accordion/";
    this.setState({ comments: this.props.comments, url: url });
  }

  commentPost = (comment) => {
    if (comment.length != " ") {
      const data = {
        comment: comment,
      };
      axios
        .post(`/api/v1/posts/comment/${this.props.postId}`, data, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data.updatedPost);
          this.setState({
            comments: response.data.updatedPost.Comments,
            commentMessage: " ",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  reportPost = () => {
    let data = [];
    axios
      .patch(`/api/v1/posts/report/${this.props.postId}`, data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status == "Reported")
          alert("You have already reported this post");
        else alert("Successfully reported the post");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  static contextType = UserContext;

  showMoreHandler = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  onChange = (event) => {
    this.setState({ commentMessage: event.target.value });
  };
  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;

    let date = "";
    let time = this.props.date;
    let length = (new Date().getTime() - new Date(time).getTime()) / 1000;

    if (length / 60 < 1440) {
      if (length < 60) date = `just now`;
      else if (length < 120) date = `a min ago`;
      else {
        length = length / 60;

        if (length < 60) date = `${parseInt(length)} mins ago`;
        else {
          length = length / 60;

          if (length < 2) date = `an hour ago`;
          else if (length < 24) date = `${parseInt(length)} hours ago`;
        }
      }
    } else {
      date = new Date(this.props.date).toDateString();
      let day = date.slice(0, 3);
      let date1 = date.slice(3);
      date = day + "," + date1;
    }

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
            color={this.context.isLoggedin ? "rgb(17, 112, 214)" : null}
            size="24px"
            style={{ transform: "translateY(-2px)" }}
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
            color={this.context.isLoggedin ? "red" : null}
            size="24px"
            style={{ transform: "translateY(2px)" }}
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

    const allComments = this.state.comments.map((value, key) => {
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

    // const CommentInputField = () => {
    //   return (
    //     <Paper component="form" className={classes.root2} elevation={0}>
    //       <CommentIcon />
    //       <InputBase
    //         className={classes.input}
    //         placeholder="Add your comment ..."
    //         inputProps={{ "aria-label": "search google maps" }}
    //         onChange={(event) =>
    //           this.setState({ commentMessage: event.target.value })
    //         }
    //         value={this.state.commentMessage}
    //       />
    //       <Divider className={classes.divider} orientation="vertical" />
    //       <Button2
    //         type="submit"
    //         className={classes.iconButton}
    //         aria-label="search"
    //         onClick={console.log(this.state.commentMessage)}
    //       >
    //         POST
    //       </Button2>
    //     </Paper>
    //   );
    // };
    const appId = 1055338171618150;

    return (
      <Aux>
        <Modal show={this.props.show}>{deletePostmessage}</Modal>
        <Modal show={this.props.confirm}>{updatePostmessage}</Modal>
        <Modal show={this.props.showConfirmMessage}>
          {blacklistPostmessage}
        </Modal>
        <Card style={{ padding: "30px 30px 0px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 className={classes.Heading}>{this.props.title}</h1>
            <CustomizedMenu report={this.reportPost} />
          </div>
          <div
            className={classes.SecondHeader}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p className={classes.Author}>
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
          {/* <div className={classes1.Body}>
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
          </div> */}
          <div>
            {this.props.data !== undefined ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.data.replace(/&lt;/g, "<"),
                }}
              />
            ) : null}
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
              <p className={classes1.Votes}>
                <FacebookButton
                  url={this.state.url}
                  appId={appId}
                  element={Button2}
                >
                  {/* <FacebookCount url={this.state.url} /> */}
                  {"Facebook"}
                </FacebookButton>
              </p>
              <p className={classes1.Votes}>
                <LinkedInButton
                  url={this.state.url}
                  appId={appId}
                  element={Button2}
                >
                  {/* <LinkedInCount url={this.state.url} /> */}
                  {"LinkedIn"}
                </LinkedInButton>
              </p>

              <p className={classes1.Votes}>
                <TwitterButton
                  url={this.state.url}
                  appId={appId}
                  element={Button2}
                >
                  {/* <TwitterCount url={this.state.url} /> */}
                  {"Twitter"}
                </TwitterButton>
              </p>
            </div>
          </div>
          <Paper component="form" className={classes.root2} elevation={0}>
            <CommentIcon />
            <InputBase
              className={classes.input}
              placeholder="Add your comment ..."
              inputProps={{ "aria-label": "search google maps" }}
              onChange={(event) =>
                this.setState({ commentMessage: event.target.value })
              }
              value={this.state.commentMessage}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <Button2
              className={classes.iconButton}
              aria-label="search"
              onClick={() => this.commentPost(this.state.commentMessage)}
            >
              POST
            </Button2>
          </Paper>
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
              {this.state.comments.length != 0 ? (
                <List className={classes.root1}>
                  {this.state.comments.map((value, key) => {
                    return (
                      <ListItem alignItems="flex-start" key={key}>
                        <ListItemText
                          primary={
                            <div style={{ textTransform: "capitalize" }}>
                              {value.author}
                            </div>
                          }
                          secondary={
                            <React.Fragment>{value.comment}</React.Fragment>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
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
