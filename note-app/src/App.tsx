import React, { useState, useCallback, useRef, memo } from 'react';
import { 
  Folder, File, ChevronRight, ChevronDown, Plus, 
  Trash2, Globe, ArrowLeft, ArrowRight, RotateCw, Search 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Reusable Button Component
const IconButton = memo(({ onClick, icon: Icon, title, className = '', ...props }) => (
  <button 
    onClick={onClick}
    title={title}
    className={`p-2 hover:bg-gray-200 rounded ${className}`}
    {...props}
  >
    <Icon size={16} />
  </button>
));

// WebBrowser Component
const WebBrowser = ({ url, onUrlChange }) => {
  const [inputUrl, setInputUrl] = useState(url);
  const iframeRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    let processedUrl = inputUrl;

    if (!inputUrl.includes('.') || inputUrl.includes(' ')) {
      processedUrl = `https://www.google.com/search?q=${encodeURIComponent(inputUrl)}`;
    } else if (!inputUrl.startsWith('http')) {
      processedUrl = `https://${inputUrl}`;
    }

    onUrlChange(processedUrl);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 bg-white shadow">
        <div className="flex gap-1">
          <IconButton onClick={() => iframeRef.current?.contentWindow?.history.back()} icon={ArrowLeft} title="Back" />
          <IconButton onClick={() => iframeRef.current?.contentWindow?.history.forward()} icon={ArrowRight} title="Forward" />
          <IconButton onClick={handleRefresh} icon={RotateCw} title="Refresh" />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full px-3 py-1.5 pr-8 border rounded"
              placeholder="Search or enter URL"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <button 
            type="submit"
            className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go
          </button>
        </form>
      </div>

      <div className="flex-1 bg-gray-50">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          title="Web content"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

// TreeItem Component
const TreeItem = memo(({ 
  item, 
  level,
  onSelect,
  onAddItem,
  onDeleteItem,
  onUpdateTitle,
  onMoveItem,
  isSelected,
  expanded,
  onToggle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isEditing) {
      onUpdateTitle(item.id, editTitle);
      setIsEditing(false);
    } else if (e.key === 'Escape' && isEditing) {
      setIsEditing(false);
      setEditTitle(item.title);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    if (draggedItemId !== item.id) {
      onMoveItem(draggedItemId, item.id);
      if (!expanded) onToggle(item.id);
    }
    setIsDragOver(false);
  };

  return (
    <div
      role="treeitem"
      aria-expanded={expanded}
      aria-selected={isSelected}
      tabIndex={0}
      className="outline-none"
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <div 
        className={`flex items-center p-2 rounded-lg cursor-move ${
          isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
        } ${isDragOver ? 'bg-blue-50 border-2 border-blue-500' : ''}`}
        style={{ paddingLeft: `${(level * 20) + 4}px` }}
        onClick={() => onSelect(item.id)}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggle(item.id);
          }}
          icon={expanded ? ChevronDown : ChevronRight}
          title={expanded ? 'Collapse' : 'Expand'}
        />
        <span 
          className="flex-1" 
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => {
                onUpdateTitle(item.id, editTitle);
                setIsEditing(false);
              }}
              onKeyDown={handleKeyDown}
              className="px-1 py-0.5 border rounded text-sm"
              autoFocus
            />
          ) : (
            item.title
          )}
        </span>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onAddItem({
              id: Date.now().toString(),
              title: 'New Item',
              parentId: item.id,
              type: 'note'
            });
          }}
          icon={Plus}
          title="Add Note"
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDeleteItem(item.id);
          }}
          icon={Trash2}
          title="Delete"
          className="text-red-500"
        />
      </div>
    </div>
  );
});

const NoteApp = () => {
  const [items, setItems] = useState([
    { id: '1', title: 'Root', parentId: null, type: 'note' },
    { id: '2', title: 'Welcome Note', parentId: '1', type: 'note' },
  ]);
  const [expandedItems, setExpandedItems] = useState(['1']);
  const [selectedItem, setSelectedItem] = useState('2');

  const handleAddItem = useCallback((newItem) => {
    setItems((prev) => [...prev, newItem]);
    setExpandedItems((prev) => [...new Set([...prev, newItem.parentId])]);
    setSelectedItem(newItem.id);
  }, []);

  const handleDeleteItem = useCallback((id) => {
    const deleteRecursive = (itemId) => {
      const childrenIds = items
        .filter((item) => item.parentId === itemId)
        .map((item) => item.id);
      childrenIds.forEach(deleteRecursive);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    };
    deleteRecursive(id);
  }, [items]);

  const renderTree = useCallback((parentId = null, level = 0) => {
    const children = items.filter((item) => item.parentId === parentId);
    return children.map((item) => (
      <React.Fragment key={item.id}>
        <TreeItem
          item={item}
          level={level}
          onSelect={setSelectedItem}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onUpdateTitle={(id, title) =>
            setItems((prev) =>
              prev.map((item) => (item.id === id ? { ...item, title } : item))
            )
          }
          onMoveItem={(draggedId, targetId) =>
            setItems((prev) =>
              prev.map((item) =>
                item.id === draggedId ? { ...item, parentId: targetId } : item
              )
            )
          }
          isSelected={selectedItem === item.id}
          expanded={expandedItems.includes(item.id)}
          onToggle={(id) =>
            setExpandedItems((prev) =>
              prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
            )
          }
        />
        {expandedItems.includes(item.id) && renderTree(item.id, level + 1)}
      </React.Fragment>
    ));
  }, [items, expandedItems, selectedItem, handleAddItem, handleDeleteItem]);

  const selected = items.find((item) => item.id === selectedItem);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* LEFT: The Tree (sidebar) */}
      <div className="w-64 border-r-4 border-gray-300 p-4 overflow-y-auto bg-white">
        <div role="tree" aria-label="Note hierarchy">
          {renderTree()}
        </div>
      </div>

      {/* RIGHT: The Editor or WebBrowser */}
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto border-l-4 border-gray-300">
        {selected ? (
          selected.type === 'note' ? (
            <div className="p-4">
              <Card>
                <CardContent className="p-4">
                  <textarea
                    className="w-full h-96 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selected.content || ''}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((item) =>
                          item.id === selected.id
                            ? { ...item, content: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Type your note here..."
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <WebBrowser 
              url={selected.url || ''}
              onUrlChange={(url) =>
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === selected.id ? { ...item, url } : item
                  )
                )
              }
            />
          )
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Select a note or web tab to view
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteApp;
