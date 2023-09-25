import { useState } from "react";

const FaqGrid = ({ faq }) => {
  const [itemOpened, setItemOpened] = useState(false);

  return (
    <div className={`faq-item`} onClick={() => setItemOpened(!itemOpened)}>
      <h5>{faq.question}</h5>
      <h5>{itemOpened ? "-" : "+"}</h5>
      {itemOpened && <p>{faq.answer}</p>}
    </div>
  );
};

export default FaqGrid;
