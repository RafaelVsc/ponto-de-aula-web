import ReactQuill from 'react-quill-new';

type Props = {
  value: string | undefined;
  onChange: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
};

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, false] }],
    ['blockquote', 'code'],
    ['link'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

const formats = [
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'header',
  'blockquote',
  'code',
  'link',
  'color',
  'background',
];

export function RichTextEditor({ value, onChange, placeholder, readOnly, className }: Props) {
  return (
    <ReactQuill
      theme="snow"
      value={value ?? ''}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
      className={className ?? 'rich-editor'}
    />
  );
}
