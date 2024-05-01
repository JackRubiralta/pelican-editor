import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GitHubSubmission = ({ articleData }) => {
    const [githubToken, setGithubToken] = useState('');
    const [issueNumber, setIssueNumber] = useState('');
    const [section, setSection] = useState('');
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
        try {
            const reader = new FileReader();
    
            // Helper function to read the file
            const readFile = (file) => {
                return new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            };
    
            // Wait for the file to be read
            const base64Content = await readFile(file);
            const contentWithoutPrefix = base64Content.split(',')[1]; // Remove the base64 prefix
            const randomFilename = `${Date.now()}-${file.name}`;
            const url = `https://api.github.com/repos/${REPO_NAME}/contents/${IMAGE_DIR}/${randomFilename}`;
    
            // Upload the image
            const response = await axios.put(url, {
                message: `Upload image ${randomFilename}`,
                content: contentWithoutPrefix,
                branch: BRANCH
            }, {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });
    
            return randomFilename;  // Returning the filename instead of the full URL
        } catch (error) {
            console.error('Failed to upload image:', error);
            throw error;  // Rethrow the error to handle it further up the call stack
        }
    };
    

    const handleSubmit = async () => {
        const FILE_PATH = `data/issue${issueNumber}/articles.json`;
        const apiUrl = `https://api.github.com/repos/${REPO_NAME}/contents/${FILE_PATH}`;
    
        try {
            // Fetch latest sha right before updating to avoid conflicts
           
    
            var imagesToUpload = articleData.content.filter(item => item.type === 'image' && item.file);
            if (articleData.image && articleData.image.file) {
                imagesToUpload.push(articleData.image);
            }
            const imageUrls = [];

            for (const item of imagesToUpload) {
                const filename = await uploadImageToGitHub(item.file);
                imageUrls.push(filename);
            }
    
            // Update article data with uploaded image URLs
            const updatedContent = articleData.content.map((content, idx) => {
                if (content.type === 'image' && content.file) {
                    const imageUrlIndex = imagesToUpload.findIndex(upload => upload.file === content.file);
                    return {...content, source: imageUrls[imageUrlIndex], file: undefined};
                }
                return content;
            });
    
            let updatedMainImage = articleData.image;
            
            if (articleData.image && articleData.image.file) {
                const mainImageUploadIndex = imagesToUpload.indexOf(articleData.image);
                updatedMainImage = {
                    ...articleData.image,
                    source: imageUrls[mainImageUploadIndex], // Update source with URL
                    file: undefined // Remove the file object
                };
            }
            const updatedArticleData = {
                ...articleData,
                content: updatedContent,
                image: updatedMainImage
            };    

            const response1 = await axios.get(apiUrl, {
                headers: { Authorization: `token ${githubToken}` }
            });

            const responseData = JSON.parse(atob(response1.data.content));
            const latestSha = response1.data.sha;

            const updatedData = {
                ...responseData,
                [section]: [...responseData[section], updatedArticleData]
            };
    
            const contentBase64 = encodeURIComponent(JSON.stringify(updatedData));
    
            const updateResponse = await axios.put(apiUrl, {
                message: `Update articles.json with new article in issue ${issueNumber}, section ${section}`,
                content: contentBase64,
                branch: BRANCH,
                sha: latestSha  // Use the latest sha
            }, {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });
    
            setResponse('Article updated successfully!');
            console.log(updateResponse.data);
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
