import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Strikethrough, 
  Link2,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Highlighter,
  Undo,
  Redo
} from 'lucide-react';

const TiptapBlogWriter = ({onSave,initialContent=""}) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'my-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'my-ordered-list',
        },
      }),
      ListItem,
      Blockquote,
      CodeBlock,
      HardBreak,
      History,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-cyan underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-primary-cyan/20 px-1 rounded text-primary-cyan',
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onSave(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
        style: 'white-space: pre-wrap;',
      },
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || '');

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
      className={`p-2 rounded-md transition-colors duration-200 border ${
        isActive
          ? 'bg-primary-cyan/20 text-primary-cyan border-primary-cyan/50'
          : 'bg-surface text-slate-400 border-white/10 hover:bg-white/5 hover:text-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-surface border border-white/10 rounded-xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Blog Writer</h2>
        <p className="text-text-muted">Create and edit your blog posts with rich text formatting</p>
      </div>

      {/* Toolbar */}
      <div className="border border-white/10 rounded-t-lg bg-surface2 p-3">
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-white/10 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <BoldIcon size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <ItalicIcon size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive('highlight')}
              title="Highlight"
            >
              <Highlighter size={16} />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-white/10 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <span className="text-lg font-bold">H1</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <span className="text-base font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <span className="text-sm font-bold">H3</span>
            </ToolbarButton>
          </div>

          {/* Text Alignment */}
          <div className="flex gap-1 border-r border-white/10 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight size={16} />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-white/10 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote size={16} />
            </ToolbarButton>
          </div>

          {/* Media & Links */}
          <div className="flex gap-1 border-r border-white/10 pr-2 mr-2">
            <ToolbarButton
              onClick={setLink}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              <Link2 size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={addImage}
              title="Add Image"
            >
              <ImageIcon size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              title="Code Block"
            >
              <Code size={16} />
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo (Ctrl+Z)"
            >
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo (Ctrl+Y)"
            >
              <Redo size={16} />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="border-x border-b border-white/10 rounded-b-lg bg-background min-h-[500px] text-slate-300">
        <EditorContent 
          editor={editor}
        />
       
        <style jsx>{`
          .ProseMirror {
            outline: none;
            padding: 16px;
            min-height: 400px;
          }
          .ProseMirror h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
            line-height: 1.2;
          }
          .ProseMirror h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.75em 0;
            line-height: 1.3;
          }
          .ProseMirror h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 0.83em 0;
            line-height: 1.4;
          }
          .ProseMirror ul, .ProseMirror ol {
            padding-left: 2em;
            margin: 1em 0;
          }
          .ProseMirror ul {
            list-style-type: disc;
          }
          .ProseMirror ol {
            list-style-type: decimal;
          }
          .ProseMirror li {
            margin: 0.5em 0;
          }
          .ProseMirror blockquote {
            border-left: 4px solid #334155;
            margin: 1em 0;
            padding-left: 1em;
            color: #94a3b8;
            font-style: italic;
          }
          .ProseMirror pre {
            background: #020617;
            border-radius: 4px;
            padding: 1em;
            margin: 1em 0;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .ProseMirror p {
            margin: 1em 0;
            line-height: 1.6;
          }
        `}</style>
      </div>

      {/* Status Bar */}
      {/* <button
          onClick={() => onSave && onSave(editor.getHTML())}
          className="mt-4 mb-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save Content
        </button> */}
    </div>
  );
};

export default TiptapBlogWriter;