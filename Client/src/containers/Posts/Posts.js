import React, { Component } from 'react';
import Post from './../../components/Post/Post';
import Aux from './../../hoc/Auxil/Auxil';
// import FullPost from "./../FullPost/FullPost";
import classes from './Posts.css';
import axios from 'axios';
import Spinner from './../../components/UI/Spinner/Spinner';
import UserContext from './../../hoc/Context/UserContext';
// import { AiFillWindows } from 'react-icons/ai';
// import {Link} from 'react-router-dom'
// import Button from './../../components/UI/Button/Button'
class Posts extends Component {
  state = {
    posts: [],
    isLoading: true,
    showConfirmMessage: false,
    blacklisted: false,
  };
  static contextType = UserContext;
  componentDidMount() {
    // connecting with server
    console.log(this.props);
    this.setState({ isLoading: true });
    axios
      .get('http://localhost:7000/api/v1/posts')
      .then((response) => {
        // console.log(response.data.data.docs);
        const posts = response.data.data.docs.slice(0, 20);
        this.setState({ posts: posts, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  upovoteOrDisvote = (id, vote) => {
    const data = {
      id: id,
    };
    axios
      .patch(`http://localhost:7000/api/v1/posts/${vote}/${id}`, data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const oldPosts = [...this.state.posts];
        const postIndex = oldPosts.indexOf(
          oldPosts.find((post) => post._id === id)
        );
        const updatedPost = oldPosts[postIndex];
        updatedPost.upvotes = response.data.upvotes;
        updatedPost.downvotes = response.data.downvotes;
        updatedPost.upvotedBy = response.data.upvotedBy;
        updatedPost.downvotedBy = response.data.downvotedBy;
        oldPosts[postIndex] = updatedPost;
        this.setState({ posts: oldPosts });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fullPostHandler = (id) => {
    // window.alert("post clicked");
    this.props.history.push('/posts/' + id);
  };

  confirmBlacklist = () => {
    this.setState({ showConfirmMessage: true });
  };
  closeModal = () => {
    this.setState({ showConfirmMessage: false });
  };

  blacklistPostHandler = (id) => {
    // console.log("blacklisted");
    const data = {
      Blacklist: true,
    };
    axios
      .patch(`http://localhost:7000/api/v1/posts/blacklist/${id}`, data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        // window.location.reload(false);
        this.setState({ showConfirmMessage: false, blacklisted: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let posts;
    if (this.state.isLoading) {
      posts = <Spinner />;
    } else {
      posts = this.state.posts.map((currPost) => {
        return (
          <Post
            title={currPost.title}
            author={currPost.author}
            date={currPost.createdAt}
            upvotes={currPost.upvotes}
            downvotes={currPost.downvotes}
            body={currPost.body}
            key={currPost._id}
            clicked={() => this.fullPostHandler(currPost._id)}
            isLoggedin={this.state.isLoggedin}
            userRole={this.context.role}
            confirmBlacklist={this.confirmBlacklist}
            showConfirmMessage={this.state.showConfirmMessage}
            goBack={this.closeModal}
            blacklistPost={() => this.blacklistPostHandler(currPost._id)}
            upvote={() => this.upovoteOrDisvote(currPost._id, 'upvote')}
            downvote={() => this.upovoteOrDisvote(currPost._id, 'downvote')}
            upvotedBy={currPost.upvotedBy}
            downvotedBy={currPost.downvotedBy}
          />
        );
      });
    }

    return (
      <Aux>
        <article>
          {/* <section className={classes.Posts}>
            <div className={classes.Header}>
              <h1>
                <strong>Welcome to Postbox</strong>
              </h1>
            </div>
          </section> */}
          <section className={classes.Posts}>
            <div className={classes.Header}>
              <h1>
                <strong>Recent Posts</strong>
              </h1>
            </div>
          </section>
          <section className={classes.Posts}>{posts}</section>
        </article>
      </Aux>
    );
  }
}

export default Posts;
