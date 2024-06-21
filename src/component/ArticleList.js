import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import categories from './Categories';
import './ArticleList.css'; 

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('general'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 6; 

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const allArticles = [];
        let totalResults = 0;
        let page = 1;
        let moreArticles = true;

        while (moreArticles) {
          const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&page=${page}&pageSize=${pageSize}&apiKey=706b76042e5e4c34b956cc2b4bd5edc5`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
          allArticles.push(...jsonData.articles);
          totalResults = jsonData.totalResults;
          page++;
          moreArticles = (page - 1) * pageSize < totalResults;
        }

        setArticles(allArticles);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const filteredArticles = searchQuery
    ? articles.filter(article => article.author && article.author.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles;

  const displayedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredArticles.length / pageSize);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Top Headlines</h2>
      <div className="mb-4">
        <select className="form-select" value={selectedCategory} onChange={(e) => {
          setSelectedCategory(e.target.value);
          setCurrentPage(1); 
        }}>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by author"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {displayedArticles.map(article => (
            <div key={article.title} className="col-md-6 mb-4">
              <div className="card">
                <img src={article.urlToImage} className="card-img-top" alt="Article" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.description}</p>
                  <p><b>Author Name:</b> {article.author}</p>
                  <a href={article.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ArticleList;
