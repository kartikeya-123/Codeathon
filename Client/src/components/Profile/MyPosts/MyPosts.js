import React, { Component } from "react";
import Post from "./../../../components/Post/Post";
// import { UpvoteOrDisvoteHandler } from "./../../../containers/Posts/Posts";
import Aux from "./../../../hoc/Auxil/Auxil";
// import FullPost from "./../FullPost/FullPost";
import classes from "./../../../containers/Posts/Posts.css";
import axios from "axios";
import Spinner from "./../../../components/UI/Spinner/Spinner";
import NavigationItem from "../../Navigation/NavigationItem/NavigationItem";
import Modal from "./../../UI/Modal/Modal";
import UserContext from "./../../../hoc/Context/UserContext";

// import {Link} from 'react-router-dom'
// import Button from "./../../../components/UI/Button/Button";
// import Profile from "./../../Profile/Profile";

import { Grid, Container, Button } from "@material-ui/core";

class MyPosts extends Component {
  state = {
    posts: [],
    isLoading: true,
    show: false,
    confirm: false,
    deleted: false,
    upvoted: false,
    downvoted: false,
  };
  static contextType = UserContext;
  componentDidMount() {
    // connecting with server
    console.log(this.props);
    this.setState({ isLoading: true });
    axios
      .get("/api/v1/posts/my-posts", {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data.data.docs);
        // console.log(response.data.data);
        const posts = response.data.data.docs;
        this.setState({ posts: posts, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  UpvoteOrDisvoteHandler = (vote, id, upvotes, downvotes) => {
    const data = {
      postId: id,
    };

    axios
      .patch(`/api/v1/posts/${vote}/${id}`, data, {
        withCredentials: true,
      })
      .then((response) => {
        // updating post upvotes and downvotes//
        var up = false;
        var down = false;
        const updatePosts = [...this.state.posts];
        const postIndex = updatePosts.findIndex((post) => post._id === id);
        const postElement = updatePosts[postIndex];
        postElement.upvotes = response.data.upvotes;
        postElement.downvotes = response.data.downvotes;
        postElement.upvotedBy = response.data.upvotedBy;
        postElement.downvotedBy = response.data.downvotedBy;
        updatePosts[postIndex] = postElement;
        if (upvotes < response.data.upvotes) up = true;
        if (downvotes < response.data.downvotes) down = true;
        this.setState({ posts: updatePosts, upvoted: up, downvoted: down });
      })
      .catch((err) => console.log(err));
  };
  editPostHandler = (id, userId) => {
    this.props.history.push("/edit/" + id);
  };
  // deleting posts//
  deletePostHandler = (id, userId) => {
    axios
      .delete(`/api/v1/posts/delete/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        // window.location.reload(false);
        const updatedPosts = [...this.state.posts];
        const myPostIndex = updatedPosts.indexOf(
          updatedPosts.find((x) => x._id === id)
        );
        updatedPosts.splice(myPostIndex, 1);
        this.setState({
          posts: updatedPosts,
          show: false,
          deleted: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  checkconfirmDelete = () => {
    this.setState({ show: true });
  };
  checkconfirmUpdate = () => {
    this.setState({ confirm: true });
  };
  closeModal = () => {
    this.setState({ show: false, confirm: false });
  };
  continue = () => {
    this.setState({ deleted: false });
  };
  render() {
    const deletedMessage = (
      <div>
        <h2>Post successfully deleted</h2>
        <br></br>
        <Button color="primary" clicked={this.continue}>
          Continue
        </Button>
      </div>
    );
    let posts;
    if (this.state.isLoading) {
      posts = <Spinner />;
    } else if (this.state.posts.length === 0) {
      return (
        <Container style={{ textAlign: "center", marginTop: 100 }}>
          <div>
            <h2>You haven't published any posts yet</h2>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              style={{ color: "white" }}
            >
              <NavigationItem link="/new-post" classProperty="my-posts">
                Create A Post
              </NavigationItem>
            </Button>
          </div>
        </Container>
      );
    } else {
      posts = this.state.posts.map((currPost) => {
        return (
          <Grid item xs={12} md={10} key={`${currPost.createdAt}`}>
            <Post
              title={currPost.title}
              author={currPost.author}
              date={currPost.createdAt}
              upvotes={currPost.upvotes}
              downvotes={currPost.downvotes}
              // body={currPost.body}
              comments={currPost.Comments}
              postId={currPost._id}
              data={currPost.data}
              key={currPost._id}
              upvotedBy={currPost.upvotedBy}
              downvotedBy={currPost.downvotedBy}
              delete="true"
              confirm={this.state.confirm}
              show={this.state.show}
              checkdelete={this.checkconfirmDelete}
              checkUpdate={this.checkconfirmUpdate}
              goBack={this.closeModal}
              deletePost={() =>
                this.deletePostHandler(currPost._id, currPost.User)
              }
              isLoggedin={this.state.isLoggedin}
              upvoted={this.state.upvoted}
              downvoted={this.state.downvoted}
              editPost={() => this.editPostHandler(currPost._id, currPost.User)}
              upvote={() =>
                this.UpvoteOrDisvoteHandler(
                  "upvote",
                  currPost._id,
                  currPost.upvotes,
                  currPost.downvotes
                )
              }
              downvote={() =>
                this.UpvoteOrDisvoteHandler(
                  "downvote",
                  currPost._id,
                  currPost.upvotes,
                  currPost.downvotes
                )
              }
            />
          </Grid>
        );
      });
    }

    return (
      <Aux>
        <Modal show={this.state.deleted}>{deletedMessage}</Modal>
        <article>
          <section className={classes.Posts}>
            <div className={classes.Header}>
              <h1>
                {/* {this.context.user.name
                  ? this.context.user.name.charAt(0).toUpperCase() +
                    this.context.user.name.slice(1) +
                    "'s "
                  : null}{" "} */}
                Your posts
              </h1>
            </div>
          </section>
          {/* <section className={classes.Posts}>{posts}</section> */}
          <Grid
            container
            spacing={5}
            style={{
              margin: "auto",
              maxWidth: "100vw",
              justifyContent: "center",
            }}
          >
            {posts}
          </Grid>
        </article>
      </Aux>
    );
  }
}

export default MyPosts;
