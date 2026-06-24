import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Image, Code, Quote, Minus } from 'lucide-react';

const RichTextBuilder = ({ 
  value = '', 
  onChange = () => {},
  placeholder = 'Start typing...',
  className = ''
}) => {
  const editorRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Sync editor content with value prop
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Execute formatting commands
  const executeCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    // Update format state
    setCurrentFormat({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  }, []);

  // Handle selection change to update button states
  const handleSelectionChange = useCallback(() => {
    if (document.activeElement === editorRef.current) {
      setCurrentFormat({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline')
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // Toolbar button component
  const ToolbarButton = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  // Handle special commands
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const insertHorizontalRule = () => {
    executeCommand('insertHorizontalRule');
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => executeCommand('bold')}
          isActive={currentFormat.bold}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('italic')}
          isActive={currentFormat.italic}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('underline')}
          isActive={currentFormat.underline}
          title="Underline"
        >
          <Underline size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <select 
          className="px-2 py-1 border border-gray-300 rounded text-sm"
          onChange={(e) => {
            if (e.target.value) {
              executeCommand('formatBlock', e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
        >
          <option value="">Heading</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="p">Paragraph</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <ToolbarButton
          onClick={() => executeCommand('insertUnorderedList')}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <ToolbarButton
          onClick={() => executeCommand('justifyLeft')}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('justifyCenter')}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('justifyRight')}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Special elements */}
        <ToolbarButton
          onClick={() => executeCommand('formatBlock', 'blockquote')}
          title="Quote"
        >
          <Quote size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('formatBlock', 'pre')}
          title="Code Block"
        >
          <Code size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Links and media */}
        <ToolbarButton
          onClick={insertLink}
          title="Insert Link"
        >
          <Link size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={insertImage}
          title="Insert Image"
        >
          <Image size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={insertHorizontalRule}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={`p-4 min-h-64 max-h-96 overflow-y-auto focus:outline-none ${
          !isEditorFocused && !editorRef.current?.innerHTML ? 'text-gray-400' : ''
        }`}
        onInput={handleInput}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        style={{
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning={true}
      />
      
      {/* Placeholder */}
      {!isEditorFocused && (!value || value === '<br>') && (
        <div className="absolute inset-x-4 top-16 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

// Demo component
const EditorDemo = () => {
  const [content, setContent] = useState('<p>Welcome to the rich text editor!</p><p>Try out the formatting options above.</p>');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Rich Text Editor</h1>
      
      <div className="mb-6">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing your content..."
          className="shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Bold, italic, underline formatting</li>
            <li>• Multiple heading levels</li>
            <li>• Bullet and numbered lists</li>
            <li>• Text alignment options</li>
            <li>• Blockquotes and code blocks</li>
            <li>• Link and image insertion</li>
            <li>• Horizontal rules</li>
            <li>• Real-time content updates</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">HTML Output</h2>
          <div className="bg-gray-100 p-3 rounded border text-sm font-mono overflow-auto max-h-48">
            {content || '<p>No content yet...</p>'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextBuilder;