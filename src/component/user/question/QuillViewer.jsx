import ReactQuill from "react-quill-new";
import "./QuillViewer.css";

const QuillViewer = ({ question, evenOdd }) => {
  const modulesNone = {
    toolbar: false, // No toolbar at all
  };

  return (
    <ReactQuill
      modules={modulesNone}
      value={question}
      readOnly={true}
      className={evenOdd}
    />
  );
};

export default QuillViewer;
