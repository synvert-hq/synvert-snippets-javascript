const snippet = "react/prevent-default";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe('add a function to prevent default', () => {
    const input = `
      const Post = ({ newPost, editPost, doDelete, onPrint, doPop }) => {
        const onEditPost = (event) => {
          event.preventDefault();

          editPost();
        }

        const deletePost = () => {
          doDelete();
        }

        const printIcon = (
          <a href="#" onClick={() => onPrint()}>
            <img src="/svg/print.svg" alt="Print" className="marginlft10" />
          </a>
        );

        return (
          <a href="#" onClick={newPost}>New</a>
          <a href="#" onClick={onEditPost}>Edit</a>
          <a href="#" onClick={deletePost}>Delete</a>
          {printIcon}
          <a href="#" onClick={() => { doPop(false) }}>Pop</a>
        )
      }
      export default Post;
    `;
    const output = `
      const Post = ({ newPost, editPost, doDelete, onPrint, doPop }) => {
        const onEditPost = (event) => {
          event.preventDefault();

          editPost();
        }

        const deletePost = (event) => {
          event.preventDefault();

          doDelete();
        }

        const printIcon = (
          <a href="#" onClick={handlePrint}>
            <img src="/svg/print.svg" alt="Print" className="marginlft10" />
          </a>
        );

        const handlePrint = (event) => {
          event.preventDefault();

          onPrint();
        }

        const onNewPost = (event) => {
          event.preventDefault();

          newPost();
        }

        const onDoPop = (event) => {
          event.preventDefault();

          doPop(false);
        }

        return (
          <a href="#" onClick={onNewPost}>New</a>
          <a href="#" onClick={onEditPost}>Edit</a>
          <a href="#" onClick={deletePost}>Delete</a>
          {printIcon}
          <a href="#" onClick={onDoPop}>Pop</a>
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