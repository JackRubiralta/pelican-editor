import React from 'react';
import './ArticleForm.css'; // Importing CSS for styling

function ArticleForm({ articleData, updateArticleData }) {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updateValue = type === 'checkbox' ? checked : value;

        // Handle nested state updates for articleData properties like "title.text"
        if (name.includes('.')) {
            const keys = name.split('.');
            updateArticleData({
                ...articleData,
                [keys[0]]: {
                    ...articleData[keys[0]],
                    [keys[1]]: updateValue
                }
            });
        } else {
            updateArticleData({
                ...articleData,
                [name]: updateValue
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            updateArticleData({
                ...articleData,
                image: {
                    ...articleData.image,
                    file: file, // Store file for upload
                }
            });
        }
    };

    return (
        <div className="article-form-container">
            <section className="form-section">
                <h2>Title Section</h2>
                <div className="input-group">
                    <label>Title</label>
                    <input type="text" name="title.text" value={articleData.title.text} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Title Size</label>
                    <select name="title.size" value={articleData.title.size} onChange={handleInputChange}>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="big">Big</option>
                    </select>
                </div>
            </section>

            <section className="form-section">
                <h2>Summary</h2>
                <div className="input-group">
                    <textarea name="summary.content" value={articleData.summary.content} onChange={handleInputChange} placeholder="Summary content (optional)" />
                </div>
                <div className="input-group">
                    <label>Show Summary</label>
                    <input
                        type="checkbox"
                        name="summary.show"
                        checked={articleData.summary.show}
                        onChange={handleInputChange}
                    />
                </div>
            </section>

            <section className="form-section">
                <h2>Metadata</h2>
                <div className="input-group">
                    <label>Author</label>
                    <input type="text" name="author" value={articleData.author} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Date</label>
                    <input type="date" name="date" value={articleData.date} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Length in minutes</label>
                    <input type="number" name="length" value={articleData.length} onChange={handleInputChange} />
                </div>
            </section>

            <section className="form-section">
                <h2>Main Image (optional)</h2>
                <div className="input-group">
                    <label>Main Image File</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div className="input-group">
                    <label>Main Image Caption</label>
                    <input type="text" name="image.caption" value={articleData.image.caption} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Show Main Image on Front Page</label>
                    <input type="checkbox" name="image.show" checked={articleData.image.show} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Image Position</label>
                    <select name="image.position" value={articleData.image.position} onChange={handleInputChange}>
                        <option value="top">Top</option>
                        <option value="side">Side</option>
                        <option value="bottom">Bottom</option>
                    </select>
                </div>
            </section>
        </div>
    );
}

export default ArticleForm;
