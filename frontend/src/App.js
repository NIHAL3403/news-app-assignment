import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const response = await axios.get('/api/news');
        setHeadlines(response.data.articles);
      } catch (error) {
        setError('Error fetching news headlines. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHeadlines();
  }, []);

  return (
    <div className="App">
      <h1>Latest News Headlines</h1>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {headlines.slice(0, 5).map((article, index) => (
          <li key={index} className="headline">
            <h2>{article.title}</h2>
            <p>{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
