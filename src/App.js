import React, { useState } from "react";
import ArticleForm from "./components/ArticleForm";
import GitHubSubmission from "./components/GitHubSubmission";
import ContentManager from "./components/ContentManager";

const App = () => {
  const [articleData, setArticleData] = useState({
    title: { text: "", size: "medium" },
    summary: { content: "", show: false },
    author: "",
    date: new Date().toISOString().slice(0, 10),
    length: 3,
    content: [],
    image: { source: "", caption: "", show: true, position: "bottom" },
  });

  const updateArticleData = (data) => {
    setArticleData(data);
  };

  const updateArticleContent = (newContent) => {
    setArticleData((prevData) => ({
      ...prevData,
      content: newContent,
    }));
  };

  return (
    <div className="app">
      <GitHubSubmission articleData={articleData} />
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",  // Align items to the top
        height: "100vh",
        marginTop: "20px",
      }}>
        <ArticleForm
          articleData={articleData}
          updateArticleData={updateArticleData}
          style={{ flex: 1 }}  // Takes up 50% of the space
        />
        <ContentManager
          updateArticleContent={updateArticleContent}
          style={{ flex: 1 }}  // Takes up 50% of the space
        />
      </div>
    </div>
  );
};

export default App;
