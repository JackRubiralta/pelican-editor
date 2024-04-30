import React, { useState } from 'react';
import './ContentManager.css'; // Importing CSS for styling

function ContentManager({ updateArticleContent }) {
    const [contents, setContents] = useState([]);

    const handleContentChange = (index, value, field = 'text') => {
        const newContents = contents.map((content, i) => {
            if (i === index) {
                return { ...content, [field]: value };
            }
            return content;
        });
        setContents(newContents);
        updateArticleContent(newContents);
        console.log(newContents)
    };

    const handleDeleteContent = (index) => {
        const newContents = contents.filter((_, i) => i !== index);
        setContents(newContents);
        updateArticleContent(newContents);
    };

    const addContent = (type) => {
        let newContent = { type};
        if (type === 'image') {
            newContent = { ...newContent, source: '', caption: '', file: null };
        } else if (type === 'list') {
            newContent = { ...newContent, items: [''] };
        }
        setContents([...contents, newContent]);
        updateArticleContent([...contents, newContent]);
    };

    const handleImageChange = (index, file) => {
        handleContentChange(index, '', 'source');
        handleContentChange(index, file, 'file'); // Store the file object directlyw
    };

    return (
        <div className="content-manager">
            <div className="content-list">
                {contents.map((content, index) => (
                    <div key={index} className="content-item">
                        {content.type === 'image' ? (
                            <>
                                <input
                                    type="file"
                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                    accept="image/*"
                                />
                                <input
                                    type="text"
                                    value={content.caption}
                                    onChange={(e) => handleContentChange(index, e.target.value, 'caption')}
                                    placeholder="Image caption"
                                />
                            </>
                        ) : content.type === 'list' ? (
                            <textarea
                                onChange={(e) => handleContentChange(index, e.target.value.split(',').map(item => item.trim()), 'items')}
                                placeholder="Enter list items separated by commas"
                            />
                        ) : (
                            <textarea
                                value={content.text}
                                onChange={(e) => handleContentChange(index, e.target.value)}
                                placeholder={`Type ${content.type} here... (**bold text**, \\iitalic text\\i)`}
                            />
                        )}
                        <button onClick={() => handleDeleteContent(index)}>Delete</button>
                    </div>
                ))}
            </div>
            <div className="content-controls">
                <button onClick={() => addContent('header')}>Add Header</button>
                <button onClick={() => addContent('paragraph')}>Add Paragraph</button>
                <button onClick={() => addContent('image')}>Add Image</button>
                <button onClick={() => addContent('list')}>Add List</button>
                {/*<button onClick={() => addContent('quote')}>Add Quote</button>*/}
            </div>
        </div>
    );
}

export default ContentManager;
