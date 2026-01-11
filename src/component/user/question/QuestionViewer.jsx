import ReactQuill from "react-quill-new";

const QuestionViewer = ({ question }) => {
  const modulesNone = {
    toolbar: false, // No toolbar at all
  };

  return (
    <ReactQuill
      modules={modulesNone}
      value={question}
      readOnly={true}
      style={{
        marginBottom: "10px",
        borderRadius: "4px",
      }}
    />
  );
};

export default QuestionViewer;
