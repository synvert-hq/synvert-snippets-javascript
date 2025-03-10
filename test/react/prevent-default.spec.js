const snippet = "react/prevent-default";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe('add a function to prevent default', () => {
    const input = `
      const Post = ({ newPost, editPost, doDelete }) => {
        const onEditPost = (event) => {
          event.preventDefault();

          editPost();
        }

        const deletePost = () => {
          doDelete();
        }

        return (
          <a href="#" onClick={newPost}>New</a>
          <a href="#" onClick={onEditPost}>Edit</a>
          <a href="#" onClick={deletePost}>Delete</a>
        )
      }
      export default Post;
    `;
    const output = `
      const Post = ({ newPost, editPost, doDelete }) => {
        const onEditPost = (event) => {
          event.preventDefault();

          editPost();
        }

        const deletePost = (event) => {
          event.preventDefault();

          doDelete();
        }

        const onNewPost = (event) => {
          event.preventDefault();

          newPost();
        }

        return (
          <a href="#" onClick={onNewPost}>New</a>
          <a href="#" onClick={onEditPost}>Edit</a>
          <a href="#" onClick={deletePost}>Delete</a>
        )
      }
      export default Post;
    `;

    assertConvert({
      input,
      output,
      snippet,
      path: "code.jsx",
      helpers: ["helpers/find-react-component"],
    });
  });
});