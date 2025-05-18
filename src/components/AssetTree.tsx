import React from 'react';
import { type AssetNode, type AssetType } from '../types.ts';

interface AssetTreeProps {
  node: AssetNode;
  selectedId: string | null;
  editingId: string | null;
  newName: string;
  onSelect: (id: string) => void;
  onStartRename: (id: string, name: string) => void;
  onConfirmRename: (id: string) => void;
  onCancelRename: () => void;
  onChangeName: (name: string) => void;
  onDelete: (id: string) => void;
  onAdd: (parentId: string, type: AssetType) => void;
  MoveDropdown: React.FC<{ nodeId: string }>;
}

const AssetTree: React.FC<AssetTreeProps> = ({
  node,
  selectedId,
  editingId,
  newName,
  onSelect,
  onStartRename,
  onConfirmRename,
  onCancelRename,
  onChangeName,
  onDelete,
  onAdd,
  MoveDropdown,
}) => (
  <div className={`asset-node ${selectedId === node.id ? 'selected' : ''}`} key={node.id}>
    <div className={
      `flex items-center gap-1 pl-4 py-1 rounded-md transition-colors duration-150 ` +
      (selectedId === node.id
        ? 'bg-blue-100 dark:bg-blue-900 shadow-sm'
        : 'hover:bg-blue-50 dark:hover:bg-gray-800')
    }>
      <span
        className={`text-xl ${node.type === 'folder' ? 'text-blue-500' : 'text-gray-400'}`}
        onClick={() => onSelect(node.id)}
        style={{ cursor: 'pointer', fontWeight: node.id === 'root' ? 'bold' : undefined }}
      >
        {node.type === 'folder' ? '📁' : '📄'}
      </span>
      {editingId === node.id ? (
        <>
          <input
            value={newName}
            onChange={e => onChangeName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') onConfirmRename(node.id);
              if (e.key === 'Escape') onCancelRename();
            }}
            autoFocus
            className="ml-2 px-2 py-1 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow"
            style={{ minWidth: 120 }}
          />
          <button className="ml-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded px-1 transition" onClick={() => onConfirmRename(node.id)}>✔️</button>
          <button className="ml-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded px-1 transition" onClick={onCancelRename}>✖️</button>
        </>
      ) : (
        <span
          className="ml-2 text-base cursor-pointer select-none font-medium"
          onDoubleClick={() => onStartRename(node.id, node.name)}
        >
          {node.name}
        </span>
      )}
      {node.id !== 'root' && (
        <>
          <button className="icon-btn text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded px-1 transition" title="Rename" onClick={() => onStartRename(node.id, node.name)}>✏️</button>
          <button className="icon-btn text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded px-1 transition" title="Delete" onClick={() => onDelete(node.id)}>🗑️</button>
          {node.type === 'folder' && (
            <button className="icon-btn text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded px-1 transition" title="Add Folder" onClick={() => onAdd(node.id, 'folder')}>➕📁</button>
          )}
          {node.type === 'folder' && (
            <button className="icon-btn text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded px-1 transition" title="Add File" onClick={() => onAdd(node.id, 'file')}>➕📄</button>
          )}
          <MoveDropdown nodeId={node.id} />
        </>
      )}
      {node.id === 'root' && (
        <>
          <button className="icon-btn text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded px-1 transition" title="Add Folder" onClick={() => onAdd(node.id, 'folder')}>➕📁</button>
          <button className="icon-btn text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded px-1 transition" title="Add File" onClick={() => onAdd(node.id, 'file')}>➕📄</button>
        </>
      )}
    </div>
    {node.type === 'folder' && node.children && node.children.length > 0 && (
      <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-3 mt-1">
        {node.children.map((child: AssetNode) => (
          <AssetTree
            key={child.id}
            node={child}
            selectedId={selectedId}
            editingId={editingId}
            newName={newName}
            onSelect={onSelect}
            onStartRename={onStartRename}
            onConfirmRename={onConfirmRename}
            onCancelRename={onCancelRename}
            onChangeName={onChangeName}
            onDelete={onDelete}
            onAdd={onAdd}
            MoveDropdown={MoveDropdown}
          />
        ))}
      </div>
    )}
  </div>
);

export default AssetTree;
