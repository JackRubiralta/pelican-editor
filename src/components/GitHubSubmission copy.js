import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GitHubSubmission = ({ articleData }) => {
    const [githubToken, setGithubToken] = useState('');
    const [issueNumber, setIssueNumber] = useState('');
    const [section, setSection] = useState('');
    const [sha, setSha] = useState('');
    const [responseData, setResponseData] = useState({});
    const [response, setResponse] = useState('');

    // API constants
    const REPO_NAME = 'JackRubiralta/pelican-api';
    const BRANCH = 'master';
    const IMAGE_DIR = 'data/images';

    useEffect(() => {
        // Fetch the current state of articles.json
        const fetchData = async () => {
            const FILE_PATH = `data/issue${issueNumber}/articles.json`;
            const apiUrl = `https://api.github.com/repos/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;
            try {
                const result = await axios.get(apiUrl, {
                    headers: { Authorization: `token ${githubToken}` }
                });
                setSha(result.data.sha);
                setResponseData(JSON.parse(atob(result.data.content)));
            } catch (error) {
                console.error('Failed to fetch current data:', error);
                setResponse(`Failed to fetch data: ${error.message}`);
            }
        };

        if (githubToken && issueNumber) {
            fetchData();
        }
    }, [githubToken, issueNumber]);
    const uploadImageToGitHub = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                const base64Content = reader.result.split(',')[1];
                const randomFilename = `${Date.now()}-${file.name}`;
                const url = `https://api.github.com/repos/${REPO_NAME}/contents/${IMAGE_DIR}/${randomFilename}`;
                
                try {
                    const response = await axios.put(url, {
                        message: `Upload image ${randomFilename}`,
                        content: base64Content,
                        branch: BRANCH
                    }, {
                        headers: {
                            Authorization: `token ${githubToken}`,
                            Accept: 'application/vnd.github.v3+json'
                        }
                    });
                    resolve(randomFilename);  // Return only the filename
                } catch (error) {
                    console.error('Failed to upload image:', error);
                    reject(error);
                }
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async () => {
        const FILE_PATH = `data/issue${issueNumber}/articles.json`;
        const apiUrl = `https://api.github.com/repos/${REPO_NAME}/contents/${FILE_PATH}`;
    
        // Identify all images that need uploading
        var imagesToUpload = articleData.content.filter(item => item.type === 'image' && item.file);
        if (articleData.image && articleData.image.file) {
            imagesToUpload.push(articleData.image); // Include the main image if it exists
        }        
    
        // Create upload promises for each image
        const uploadPromises = imagesToUpload.map(item => uploadImageToGitHub(item.file));
    
        try {
            // Wait for all images to be uploaded and URLs to be received
            const imageUrls = await Promise.all(uploadPromises);
    
            // Update the articleData with the new image URLs
            const newContent = articleData.content.map(content => {
                if (content.type === 'image' && content.file) {
                    const uploadIndex = imagesToUpload.findIndex(img => img.file === content.file);
                    return {
                        ...content,
                        source: imageUrls[uploadIndex], // Replace source with new URL
                        file: undefined // Remove the file object
                    };
                }
                return content;
            });
    
            // Also update the main image if it was uploaded
            const updatedArticleData = {
                ...articleData,
                content: newContent,
                image: articleData.image && articleData.image.file ? {
                    ...articleData.image,
                    source: imageUrls[imagesToUpload.indexOf(articleData.image)], // Update source with URL
                    file: undefined // Remove the file object
                } : articleData.image
            };
    
            // Serialize the updated article data
            const updatedData = {
                ...responseData,
                [section]: [...responseData[section], updatedArticleData]
            };
    
            const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updatedData))));
    
            // Update the articles.json on GitHub
            const result = await axios.put(apiUrl, {
                message: `Update articles.json with new article in issue ${issueNumber}, section ${section}`,
                content: contentBase64,
                branch: BRANCH,
                sha
            }, {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });
    
            setResponse('Article updated successfully!');
            console.log(result.data);
        } catch (error) {
            console.error('Failed to update article:', error);
            setResponse(`Failed to update article: ${error.message}`);
        }
    };
    

    return (
        <div>
            <input
                type="text"
                placeholder="GitHub Token"
                value={githubToken}
                onChange={e => setGithubToken(e.target.value)}
            />
            <input
                type="text"
                placeholder="Issue Number"
                value={issueNumber}
                onChange={e => setIssueNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Section"
                value={section}
                onChange={e => setSection(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit to GitHub</button>
            {response && <p>{response}</p>}
        </div>
    );
};

export default GitHubSubmission;
