import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { saveLocalPost } from '../utils/storage';

type Errors = { title?: string; body?: string };

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const validate = (): Errors => {
    const e: Errors = {};
    if (!title.trim()) e.title = 'Tiêu đề không được để trống';
    else if (title.trim().length < 5) e.title = 'Tiêu đề phải có ít nhất 5 ký tự';
    else if (title.length > 200) e.title = 'Tiêu đề tối đa 200 ký tự';

    if (!body.trim()) e.body = 'Nội dung không được để trống';
    else if (body.trim().length < 10) e.body = 'Nội dung phải có ít nhất 10 ký tự';

    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const newPost: Post = {
      id: Date.now(),
      userId: 9999,
      title: title.trim(),
      body: body.trim(),
      isLocal: true,
    };
    saveLocalPost(newPost);
    navigate(`/posts/${newPost.id}`);
  };

  return (
    <div className="form-box">
      <h1>Viết bài mới</h1>
      <form onSubmit={onSubmit}>
        <label>Tiêu đề</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />
        {errors.title && <span className="error">{errors.title}</span>}

        <label>Nội dung</label>
        <textarea rows={8} value={body} onChange={e => setBody(e.target.value)} />
        {errors.body && <span className="error">{errors.body}</span>}

        <button type="submit" className="btn">Đăng bài</button>
      </form>
    </div>
  );
}