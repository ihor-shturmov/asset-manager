import React, { useState } from 'react';
import { type AssetNode } from '../types';

interface MoveDropdownProps {
  nodeId: string;
  tree: AssetNode;
  moveNode: (sourceId: string, targetId: string) => void;
}

const MoveDropdown: React.FC<MoveDropdownProps> = ({ nodeId, tree, moveNode }) => {
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState('');
  
  const getFolders = (node: AssetNode, excludeId: string, excludeDescendants: Set<string> = new Set()): AssetNode[] => {
    let folders: AssetNode[] = [];
    if (node.type === 'folder' && node.id !== excludeId && !excludeDescendants.has(node.id)) {
      folders.push(node);
    }
    if (node.type === 'folder' && node.children) {
      for (const child of node.children) {
        if (child.id === excludeId) continue;
        const descendants = getDescendants(child);
        folders = folders.concat(getFolders(child, excludeId, new Set([...excludeDescendants, ...descendants])));
      }
    }
    return folders;
  };
  
  const getDescendants = (node: AssetNode): string[] => {
    const ids: string[] = [];
    if (node.type === 'folder' && node.children) {
      for (const child of node.children) {
        ids.push(child.id, ...getDescendants(child));
      }
    }
    return ids;
  };
  const folders = getFolders(tree, nodeId);
  return (
    <span className="move-dropdown">
      <span className="inline-block">
        <button className="icon-btn text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded px-1 transition" title="Move" onClick={() => setOpen(o => !o)}>📦</button>
        {open && (
          <select
            value={targetId}
            onChange={e => {
              setTargetId(e.target.value);
            }}
            className="ml-1 px-2 py-1 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow"
          >
            <option value="">Move to...</option>
            {folders.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        )}
        {open && targetId && (
          <button
            className="ml-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded px-1 transition"
            onClick={() => {
              moveNode(nodeId, targetId);
              setOpen(false);
              setTargetId('');
            }}
          >Move</button>
        )}
      </span>
    </span>
  );
};

export default MoveDropdown;
