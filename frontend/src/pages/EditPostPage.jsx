import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postAPI } from "../services/api.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const EditPostPage = () => {
  const { id }    = useParams();
  const [form, setForm]           = useState({ title: "", content: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [errors, setErrors]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const { user }  = useAuthContext();
  const navigate  = useNavigate();

  useEffect(() => {
    postAPI.getOne(id)
      .then(({ data }) => {
        const post = data.data;
        if (post.author._id !== user?._id) return navigate("/");
        setForm({ title: post.title, content: post.content });
      })
      .catch(() => navigate("/"))
      .finally(() => setFetching(false));
  }, [id, navigate, user]);

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

      await postAPI.update(id, fd);
      navigate(`/posts/${id}`);
    } catch (err) {
      const msg = err.response?.data?.errors || [err.response?.data?.message || "Update failed."];
      setErrors(Array.isArray(msg) ? msg : [msg]);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="container form-page">
      <h1 className="form-title">Edit Post</h1>

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
                value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea id="content" name="content" className="form-control"
                rows={12} value={form.content} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="thumbnail">Replace Thumbnail (optional)</label>
              <input id="thumbnail" type="file" accept="image/*" className="form-control"
                onChange={(e) => setThumbnail(e.target.files[0])} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving…" : "Save Changes"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate(`/posts/${id}`)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
