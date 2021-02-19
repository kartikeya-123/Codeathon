import React, { Component } from 'react';
import axios from 'axios';
import UserContext from './../../hoc/Context/UserContext';
import classes from './NewPost.css';
import Aux from './../../hoc/Auxil/Auxil';
import Modal from './../../components/UI/Modal/Modal';
import Button from './../../components/UI/Button/Button';
class NewPost extends Component {
  state = {
    title: '',
    body: '',
    author: '',
    isLoading: true,
    show: false,
  };
  static contextType = UserContext;

  newPostHandler = () => {
    const data = {
      title: this.state.title,
      body: this.state.body,
      author: this.state.author,
    };
    console.log(data);
    axios
      .post('http://localhost:7000/api/v1/posts', data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        this.setState({ show: true });
        // this.props.history.push("/");
        // window.location.reload(false);
      });
  };
  continue = () => {
    this.props.history.push('/');
    window.location.reload(false);
  };
  render() {
    const newPostmessage = (
      <div>
        <p>Successfully a new post created</p>
        <Button btnType="Success" clicked={this.continue}>
          Continue
        </Button>
      </div>
    );

    return (
      <Aux>
        <Modal show={this.state.show}>{newPostmessage}</Modal>
        <div className={classes.NewPost}>
          {this.context.isLoggedin ? (
            <div>
              <h1>Add a Post</h1>
              <label>Title</label>
              <textarea
                rows="3"
                placeholder="Title of the post"
                value={this.state.title}
                onChange={(event) =>
                  this.setState({ title: event.target.value })
                }
              />
              <label>Content</label>
              <textarea
                placeholder="Write your post"
                value={this.state.body}
                rows="10"
                onChange={(event) =>
                  this.setState({ body: event.target.value })
                }
              />
              {/* <label>Author</label>
            <textarea
              value={this.state.author}
              onChange={(event) =>
                this.setState({ author: event.target.value })
              }  */}
              {/* /* /> */}
              <Button clicked={this.newPostHandler} btnType="Success">
                Add Post
              </Button>
            </div>
          ) : (
            <h1>Login to write a post </h1>
          )}
        </div>
      </Aux>
    );
  }
}

export default NewPost;
