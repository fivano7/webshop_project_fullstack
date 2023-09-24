import { useState } from "react";

function CreateFaqForm({ onCreate }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      onCreate(question, answer);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      // console.log(`ERROR: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-faq-form">
      <div className="form-group">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <label>Question</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <label>Answer</label>
      </div>
      <button className="primary-button" type="submit">
        Create FAQ
      </button>
    </form>
  );
}

export default CreateFaqForm;
