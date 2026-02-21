import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { postAPI } from "../services/api.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import { API_BASE } from "../utils/constants.js";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const PostDetailPage = () => {
  const { id }    = useParams();
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const { user }  = useAuthContext();
  const navigate  = useNavigate();

  useEffect(() => {
    postAPI.getOne(id)
      .then(({ data }) => setPost(data.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await postAPI.remove(id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!post) return null;

  const isOwner = user?._id === post.author?._id;

  return (
    <div className="container page">
      <Link to="/" className="back-link">← Back to posts</Link>

      {post.thumbnail && (
        <img src={`${API_BASE}${post.thumbnail}`} alt={post.title} className="detail-thumb" />
      )}

      <h1 className="detail-title">{post.title}</h1>
      <p className="detail-meta">
        By <strong>{post.author?.name}</strong> · {formatDate(post.createdAt)}
        {post.updatedAt !== post.createdAt && ` · Updated ${formatDate(post.updatedAt)}`}
      </p>

      <hr className="detail-divider" />
      <p className="detail-content">{post.content}</p>

      {isOwner && (
        <div className="detail-actions">
          <Link to={`/edit/${post._id}`} className="btn btn-outline">Edit Post</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Delete Post</button>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
