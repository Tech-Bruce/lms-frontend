import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Image, Code, Quote, Minus } from 'lucide-react';

const RichTextEditor = ({ 
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
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      const normalizedValue = value || '';
      const normalizedCurrent = currentContent || '';
      
      // Only update if content is actually different
      if (normalizedValue !== normalizedCurrent) {
        editorRef.current.innerHTML = normalizedValue;
      }
    }
  }, [value]);

  // Handle content changes with debouncing and sanitization
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      let content = editorRef.current.innerHTML;
      
      // Handle empty content cases
      if (!content || content === '<br>' || content === '<div><br></div>' || content.trim() === '') {
        content = '';
        editorRef.current.innerHTML = '';
      }
      
      // Sanitize content - remove potentially harmful elements
      content = sanitizeHTML(content);
      
      onChange(content);
    }
  }, [onChange]);

  // Simple HTML sanitization
  const sanitizeHTML = (html) => {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove script tags and other potentially harmful elements
    const scripts = temp.querySelectorAll('script, object, embed, iframe');
    scripts.forEach(script => script.remove());
    
    // Remove event handlers
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(element => {
      // Remove all event attributes
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      });
    });
    
    return temp.innerHTML;
  };

  // Execute formatting commands with error handling
  const executeCommand = useCallback((command, value = null) => {
    try {
      // Ensure the editor is focused
      if (editorRef.current) {
        editorRef.current.focus();
      }
      
      const success = document.execCommand(command, false, value);
      
      if (!success) {
        console.warn(`Command ${command} failed to execute`);
      }
      
      // Update format state
      setTimeout(() => {
        setCurrentFormat({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline')
        });
      }, 0);
      
      // Trigger onChange after command execution
      setTimeout(handleInput, 0);
    } catch (error) {
      console.error('Error executing command:', error);
    }
  }, [handleInput]);

  // Handle selection change to update button states
  const handleSelectionChange = useCallback(() => {
    if (document.activeElement === editorRef.current || isEditorFocused) {
      try {
        setCurrentFormat({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline')
        });
      } catch (error) {
        // Ignore errors when querying command state
      }
    }
  }, [isEditorFocused]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // Toolbar button component
  const ToolbarButton = ({ onClick, isActive, children, title, disabled = false }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  // Handle special commands with better error handling
  const insertLink = () => {
    try {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) {
        alert('Please select some text first');
        return;
      }
      
      const url = prompt('Enter URL:');
      if (url) {
        // Basic URL validation
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(url)) {
          const confirmUrl = confirm('The URL should start with http:// or https://. Continue anyway?');
          if (!confirmUrl) return;
        }
        executeCommand('createLink', url);
      }
    } catch (error) {
      console.error('Error inserting link:', error);
      alert('Error inserting link. Please try again.');
    }
  };

  const insertImage = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file.');
          return;
        }
        
        // Validate file size (500KB = 500 * 1024 bytes)
        const maxSize = 500 * 1024;
        if (file.size > maxSize) {
          alert(`Image file is too large. Please select an image under 500KB. Current size: ${(file.size / 1024).toFixed(1)}KB`);
          return;
        }
        
        try {
          // Focus editor and get current selection
          editorRef.current.focus();
          const selection = window.getSelection();
          
          let range;
          if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
          } else {
            // If no selection, create range at end of content
            range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          
          // Show loading state
          const loadingSpan = document.createElement('span');
          loadingSpan.textContent = 'Loading image...';
          loadingSpan.style.color = '#666';
          loadingSpan.style.fontStyle = 'italic';
          range.insertNode(loadingSpan);
          
          const reader = new FileReader();
          
          reader.onload = () => {
            try {
              // Remove loading text
              loadingSpan.remove();
              
              // Insert image
              const img = document.createElement('img');
              img.src = reader.result;
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.borderRadius = '4px';
              img.style.display = 'block';
              img.style.margin = '8px 0';
              img.alt = file.name;
              
              range.insertNode(img);
              
              // Move cursor after image
              range.setStartAfter(img);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
              
              // Trigger onChange
              handleInput();
            } catch (error) {
              console.error('Error inserting image:', error);
              alert('Error inserting image. Please try again.');
            }
          };
          
          reader.onerror = () => {
            loadingSpan.remove();
            alert('Error reading image file. Please try again.');
          };
          
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error processing image:', error);
          alert('Error processing image. Please try again.');
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Error opening file dialog:', error);
      alert('Error opening file dialog. Please try again.');
    }
  };

  const insertHorizontalRule = () => {
    try {
      executeCommand('insertHorizontalRule');
    } catch (error) {
      // Fallback method for browsers that don't support insertHorizontalRule
      const hr = document.createElement('hr');
      hr.style.margin = '16px 0';
      hr.style.border = 'none';
      hr.style.borderTop = '1px solid #ccc';
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(hr);
        range.setStartAfter(hr);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      handleInput();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          insertLink();
          break;
      }
    }
  };

  // Handle paste events to clean pasted content
  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    if (text) {
      // Insert as plain text to avoid formatting issues
      document.execCommand('insertText', false, text);
      handleInput();
    }
  };

  const showPlaceholder = !isEditorFocused && (!value || value === '<br>' || value === '<div><br></div>' || value.trim() === '');

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white relative ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => executeCommand('bold')}
          isActive={currentFormat.bold}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('italic')}
          isActive={currentFormat.italic}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => executeCommand('underline')}
          isActive={currentFormat.underline}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <select 
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
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
          title="Insert Link (Ctrl+K)"
        >
          <Link size={16} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={insertImage}
          title="Upload Image (max 500KB)"
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
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className="p-4 min-h-64 max-h-96 overflow-y-auto focus:outline-none"
          onInput={handleInput}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          style={{
            lineHeight: '1.6'
          }}
          suppressContentEditableWarning={true}
          role="textbox"
          aria-multiline="true"
          aria-label="Rich text editor"
        />
        
        {/* Placeholder */}
        {showPlaceholder && (
          <div className="absolute inset-x-4 top-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;