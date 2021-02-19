import React, { Component } from 'react';
import axios from 'axios';
import UserContext from './../../../hoc/Context/UserContext';
import classes from './../../../containers/NewPost/NewPost.css';
import Aux from './../../../hoc/Auxil/Auxil';
import Button from './../../../components/UI/Button/Button';
import Modal from './../../UI/Modal/Modal';
import Spinner from './../../UI/Spinner/Spinner';
class EditPost extends Component {
  state = {
    title: '',
    body: '',
    author: '',
    isLoading: true,
    isLoggedin: false,
    show: false,
  };
  static contextType = UserContext;
  componentDidMount = () => {
    this.setState({ isLoggedin: this.context.isLoggedin, isLoading: true });
    axios
      .get(`http://localhost:7000/api/v1/posts/${this.props.match.params.id}`)
      .then((response) => {
        console.log(response.data.data.doc);
        this.setState({
          title: response.data.data.doc.title,
          body: response.data.data.doc.body,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };
  updatePostHandler = () => {
    const data = {
      title: this.state.title,
      body: this.state.body,
    };
    console.log(data);
    axios
      .patch(
        `http://localhost:7000/api/v1/posts/edit/${this.props.match.params.id}`,
        data,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        this.setState({ show: true });
        // this.props.history.push("/");
        // window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('request');
  };
  continue = () => {
    this.props.history.push('/my-posts');
    window.location.reload(false);
  };

  render() {
    const newPostmessage = (
      <div>
        <p>Successfully your post has been updated</p>
        <Button btnType="Success" clicked={this.continue}>
          Continue
        </Button>
      </div>
    );

    //   const  oldPost = (
    //       <Aux>
    //     <div className={classes.NewPost}>
    //     <div>
    //             <h1>Update your Post</h1>
    //             <label>Title</label>
    //             <textarea
    //               rows="3"
    //               placeholder="Title of the post"
    //               value={this.state.title}
    //               onChange={(event) =>
    //                 this.setState({ title: event.target.value })
    //               }
    //             />
    //             <label>Content</label>
    //             <textarea
    //               placeholder="Write your post"
    //               value={this.state.body}
    //               rows="10"
    //               onChange={(event) =>
    //                 this.setState({ body: event.target.value })
    //               }
    //             />
    //           </div>
    //           </div>
    //     </Aux>
    //   )

    return (
      <Aux>
        <Modal show={this.state.show}>{newPostmessage}</Modal>
        {!this.state.isLoading ? (
          <div className={classes.NewPost}>
            {this.state.isLoggedin ? (
              <div>
                <h1>Update Post</h1>
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
                <Button clicked={this.updatePostHandler} btnType="Success">
                  Update Post
                </Button>
              </div>
            ) : (
              <h1>Login to write a post </h1>
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </Aux>
    );
  }
}

export default EditPost;
