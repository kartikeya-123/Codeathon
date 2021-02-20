import React, { Component, useEffect } from "react";
import axios from "axios";
import UserContext from "./../../hoc/Context/UserContext";
import classes from "./NewPost.css";
import Aux from "./../../hoc/Auxil/Auxil";
import Modal from "./../../components/UI/Modal/Modal";
// import Button from "./../../components/UI/Button/Button";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import { Button, Chip } from "@material-ui/core";

class NewPost extends Component {
  state = {
    title: "",
    // body: "",
    author: "",
    isLoading: true,
    show: false,
    continued: false,
    tags: [],
  };
  static contextType = UserContext;

  newPostHandler = () => {
    const html = this.getContents();

    const data = {
      title: this.state.title,
      // body: this.state.body,
      author: this.state.author,
      data: html,
      tags: this.state.tags,
    };
    // console.log(data);
    axios
      .post("/api/v1/posts", data, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response);
        this.setState({ show: true });
        // this.props.history.push("/");
        // window.location.reload(false);
      });
  };
  continue = () => {
    this.props.history.push("/");
    window.location.reload(false);
  };

  constructor(props) {
    super(props);
    this.state = { text: "" }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
    this.quillRef = null; // Quill instance
    this.reactQuillRef = null;
  }

  componentDidMount() {
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (this.reactQuillRef) {
      if (typeof this.reactQuillRef.getEditor !== "function") return;
      this.quillRef = this.reactQuillRef.getEditor();
    }
  };

  handleChange(value) {
    this.setState({ text: value });
  }

  getContents = () => {
    // var range = this.quillRef.getSelection();
    // let position = range ? range.index : 0;
    let content = this.quillRef.getContents();
    console.log(content);
    var cfg = {};

    var converter = new QuillDeltaToHtmlConverter(content.ops, cfg);

    var html = converter.convert();

    return html;
  };

  selectedTags = (tags) => {
    console.log(tags);
  };

  removeTags = (indexToRemove) => {
    this.setState({
      tags: [...this.state.tags.filter((_, index) => index !== indexToRemove)],
    });
  };

  addTags = (event) => {
    console.log(event.target.value);
    console.log(this.state.tags);
    if (this.state.tags === undefined && event.target.value !== "") {
      this.setState({ tags: [event.target.value] });
      // props.selectedTags([...tags, event.target.value]);
      event.target.value = "";
    } else if (event.target.value !== "") {
      this.setState({ tags: [...this.state.tags, event.target.value] });
      // props.selectedTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };

  render() {
    const newPostmessage = (
      <div>
        <p>Successfully a new post created</p>
        <Button
          onClick={this.continue}
          variant="contained"
          style={{ backgroundColor: "green", color: "white" }}
        >
          Continue
        </Button>
      </div>
    );

    if (!this.state.continued)
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
                {/* <label>Content</label>
                <textarea
                  placeholder="Write your post"
                  value={this.state.body}
                  rows="10"
                  onChange={(event) =>
                    this.setState({ body: event.target.value })
                  }
                /> */}
                <div style={{ width: "100%" }}>
                  <h4>Add Tags</h4>
                  <ul id="tags" style={{ width: "80%" }}>
                    {this.state.tags !== undefined && this.state.tags.length > 0
                      ? this.state.tags.map((tag, index) => (
                          // <li key={index} className="tag">
                          //   <span className="tag-title">{tag}</span>
                          //   <span
                          //     className="tag-close-icon"
                          //     onClick={() => this.removeTags(index)}
                          //   >
                          //     x
                          //   </span>
                          // </li>
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => this.removeTags(index)}
                            color="primary"
                          />
                        ))
                      : null}
                  </ul>
                  <input
                    type="text"
                    style={{ padding: "10px" }}
                    onKeyUp={(event) =>
                      event.key === "Enter" ? this.addTags(event) : null
                    }
                    placeholder="Press enter to add tags"
                  />
                </div>

                <Button
                  onClick={() => {
                    this.setState({ continued: true });
                  }}
                  variant="contained"
                  color="primary"
                  style={{ margin: 20 }}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <h1>Login to write a post </h1>
            )}
          </div>
        </Aux>
      );
    return (
      <Aux>
        <Modal show={this.state.show}>{newPostmessage}</Modal>
        <div className={classes.NewPost}>
          <div style={{ height: "400px", padding: "20px" }}>
            <ReactQuill
              ref={(el) => {
                this.reactQuillRef = el;
              }}
              theme={"snow"}
              style={{ minHeight: "100px" }}
            >
              <div className="editing-area" style={{ height: "300px" }}></div>
            </ReactQuill>
          </div>
          <Button
            onClick={() => {
              this.setState({ continued: false });
            }}
            variant="outlined"
            color="primary"
            style={{ margin: 20 }}
          >
            Back
          </Button>
          <Button
            onClick={this.newPostHandler}
            variant="contained"
            color="primary"
            style={{ margin: 20 }}
          >
            Publish
          </Button>
        </div>
      </Aux>
    );
  }
}

export default NewPost;
