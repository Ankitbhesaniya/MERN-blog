import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../services/api.js";

const CreatePostPage = () => {
  const [form, setForm]       = useState({ title: "", content: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [errors, setErrors]   = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      if (thumbnail) fd.append("thumbnail", thumbnail);

      const { data } = await postAPI.create(fd);
      navigate(`/posts/${data.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.errors || [err.response?.data?.message || "Failed to create post."];
      setErrors(Array.isArray(msg) ? msg : [msg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page">
      <h1 className="form-title">Create New Post</h1>

      <div className="card">
        <div className="card-body">
          {errors.length > 0 && (
            <div className="alert alert-error">
              <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input id="title" type="text" name="title" className="form-control"
                placeholder="Post title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea id="content" name="content" className="form-control"
                placeholder="Write your post…" rows={12}
                value={form.content} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail (optional)</label>
              <input id="thumbnail" type="file" accept="image/*" className="form-control"
                onChange={(e) => setThumbnail(e.target.files[0])} />
              <p className="form-hint">JPG, PNG, WebP — max 5 MB</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Publishing…" : "Publish Post"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
