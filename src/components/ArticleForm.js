// src/components/ArticleForm.js
import React, { useState } from 'react';
import './ArticleForm.css'; // Importing CSS for styling

function ArticleForm() {
    const [article, setArticle] = useState({
        title: '',
        titleSize: 'medium',
        showSummary: true,
        summaryContent: '',
        author: '',
        date: new Date().toISOString().slice(0, 10),
        length: '',
        includeMainImage: false,
        mainImage: null,
        mainImageCaption: '',
        showMainImage: false,
        imagePosition: 'bottom',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setArticle(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(article); // Replace with API call to submit the article data
    };

    return (
        <div className="article-form-container">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Title</label>
                    <input type="text" name="title" value={article.title} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Title Size</label>
                    <select name="titleSize" value={article.titleSize} onChange={handleInputChange}>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="big">Big</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Show Summary</label>
                    <input type="checkbox" name="showSummary" checked={article.showSummary} onChange={handleInputChange} />
                </div>
                {article.showSummary && (
                    <div className="input-group">
                        <label>Summary Content</label>
                        <textarea name="summaryContent" value={article.summaryContent} onChange={handleInputChange} />
                    </div>
                )}
                <div className="input-group">
                    <label>Author</label>
                    <input type="text" name="author" value={article.author} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Date</label>
                    <input type="date" name="date" value={article.date} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Length in minutes</label>
                    <input type="number" name="length" value={article.length} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Include Main Image</label>
                    <input type="checkbox" name="includeMainImage" checked={article.includeMainImage} onChange={handleInputChange} />
                </div>
                {article.includeMainImage && (
                    <div className="input-group">
                        <label>Main Image File</label>
                        <input type="file" onChange={(e) => setArticle(prev => ({ ...prev, mainImage: e.target.files[0] }))} />
                        <label>Main Image Caption</label>
                        <input type="text" name="mainImageCaption" value={article.mainImageCaption} onChange={handleInputChange} />
                    </div>
                )}
                <div className="input-group">
                    <label>Show Main Image on Front Page</label>
                    <input type="checkbox" name="showMainImage" checked={article.showMainImage} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Image Position</label>
                    <select name="imagePosition" value={article.imagePosition} onChange={handleInputChange}>
                        <option value="top">Top</option>
                        <option value="side">Side</option>
                        <option value="bottom">Bottom</option>
                    </select>
                </div>
                <button type="submit">Submit Article</button>
            </form>
        </div>
    );
}

export default ArticleForm;
