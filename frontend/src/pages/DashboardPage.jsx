import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postAPI } from "../services/api.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import { API_BASE } from "../utils/constants.js";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const DashboardPage = () => {
  const [posts, setPosts]           = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [authorFilter, setAuthorFilter] = useState("");
  const [searchInput, setSearchInput]   = useState("");
  const [loading, setLoading]       = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const loadPosts = useCallback(async (page = 1, author = "") => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (author) params.author = author;
      const { data } = await postAPI.getAll(params);
      setPosts(data.data.posts);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(1, authorFilter);
  }, [loadPosts, authorFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAuthorFilter(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setAuthorFilter("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await postAPI.remove(id);
      loadPosts(pagination.page, authorFilter);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">
          {authorFilter ? `Posts by "${authorFilter}"` : "All Posts"}
          {!loading && (
            <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--text-muted)", marginLeft: "8px" }}>
              ({pagination.total})
            </span>
          )}
        </h1>

        <form className="search-row" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by author…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-outline btn-sm">Search</button>
          {authorFilter && (
            <button type="button" className="btn btn-outline btn-sm" onClick={handleClear}>Clear</button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="empty">
          <h3>No posts found</h3>
          <p>{authorFilter ? "Try a different author name." : "Be the first to write something!"}</p>
          {user && (
            <Link to="/create" className="btn btn-primary" style={{ marginTop: "14px" }}>
              + Write a Post
            </Link>
          )}
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post._id} className="post-item">
              {post.thumbnail && (
                <img
                  src={`${API_BASE}${post.thumbnail}`}
                  alt={post.title}
                  className="post-thumb"
                />
              )}
              <div className="post-body">
                <div className="post-meta">
                  {post.author?.name} · {formatDate(post.createdAt)}
                </div>
                <Link to={`/posts/${post._id}`} className="post-title-link">
                  {post.title}
                </Link>
                <p className="post-excerpt">
                  {post.excerpt?.length === 150 ? `${post.excerpt}…` : post.excerpt}
                </p>
                <div className="post-footer">
                  <Link to={`/posts/${post._id}`} className="btn btn-outline btn-sm">Read →</Link>
                  {user?._id === post.author?._id && (
                    <div className="post-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit/${post._id}`)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline btn-sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => loadPosts(pagination.page - 1, authorFilter)}
          >
            ← Prev
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={!pagination.hasNextPage}
            onClick={() => loadPosts(pagination.page + 1, authorFilter)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
