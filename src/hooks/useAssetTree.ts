import { useCallback, useState, useEffect } from 'react';
import { type AssetNode, type AssetType } from '../types';
import { useAsyncLocalStorage } from './useAsyncLocalStorage';

const STORAGE_KEY = 'asset-manager-tree';
const uuid = () => Math.random().toString(36).slice(2, 10);

export function useAssetTree(initialTree: AssetNode) {
  const { loadAsync, saveAsync } = useAsyncLocalStorage<AssetNode>();
  const [tree, setTree] = useState<AssetNode>(initialTree);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const loaded = await loadAsync(STORAGE_KEY);
      if (loaded) setTree(loaded);
    })();
  }, [loadAsync]);

  const saveTree = useCallback((nextTree: AssetNode) => {
    setTree(nextTree);
    saveAsync(STORAGE_KEY, nextTree);
  }, [saveAsync]);

  const findNode = useCallback((node: AssetNode, id: string): AssetNode | null => {
    if (node.id === id) return node;
    if (node.type === 'folder' && node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const updateNode = useCallback((node: AssetNode, id: string, updater: (n: AssetNode) => AssetNode): AssetNode => {
    if (node.id === id) return updater(node);
    if (node.type === 'folder' && node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNode(child, id, updater)),
      };
    }
    return node;
  }, []);

  const removeNode = useCallback((node: AssetNode, id: string): AssetNode => {
    if (node.type === 'folder' && node.children) {
      return {
        ...node,
        children: node.children.filter(child => child.id !== id).map(child => removeNode(child, id)),
      };
    }
    return node;
  }, []);

  const moveNode = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === 'root' || sourceId === targetId) return;
    const sourceNode = findNode(tree, sourceId);
    if (!sourceNode) return;
    let newTree = removeNode(tree, sourceId);
    newTree = updateNode(newTree, targetId, (parent) => {
      if (parent.type !== 'folder') return parent;
      if (parent.children?.some(c => c.name === sourceNode.name)) {
        setError('Name must be unique within the same folder.');
        return parent;
      }
      return {
        ...parent,
        children: [...(parent.children || []), { ...sourceNode, parentId: parent.id }],
      };
    });
    saveTree(newTree);
    setError('');
  }, [tree, findNode, removeNode, updateNode, saveTree]);

  const addAsset = useCallback((parentId: string, type: AssetType) => {
    const name = type === 'folder' ? 'New Folder' : 'New File';
    saveTree(updateNode(tree, parentId, (parent) => {
      if (parent.type !== 'folder') return parent;
      if (parent.children?.some(c => c.name === name)) {
        setError('Name must be unique within the same folder.');
        return parent;
      }
      return {
        ...parent,
        children: [...(parent.children || []), { id: uuid(), name, type, children: type === 'folder' ? [] : undefined, parentId }],
      };
    }));
    setError('');
  }, [tree, updateNode, saveTree]);

  const deleteAsset = useCallback((id: string) => {
    if (id === 'root') return;
    saveTree(removeNode(tree, id));
    setSelectedId(null);
    setError('');
  }, [tree, removeNode, saveTree]);

  const startRename = useCallback((id: string, currentName: string) => {
    setEditingId(id);
    setNewName(currentName);
    setError('');
  }, []);

  const findParent = useCallback((node: AssetNode, childId: string): AssetNode | null => {
    if (node.type === 'folder' && node.children) {
      for (const child of node.children) {
        if (child.id === childId) return node;
        const found = findParent(child, childId);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const confirmRename = useCallback((id: string) => {
    if (!newName.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    const parent = findParent(tree, id);
    if (parent && parent.children?.some(c => c.name === newName && c.id !== id)) {
      setError('Name must be unique within the same folder.');
      return;
    }
    saveTree(updateNode(tree, id, n => ({ ...n, name: newName })));
    setEditingId(null);
    setNewName('');
    setError('');
  }, [newName, tree, updateNode, findParent, saveTree]);

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setNewName('');
    setError('');
  }, []);

  return {
    tree,
    selectedId,
    setSelectedId,
    editingId,
    setEditingId,
    newName,
    setNewName,
    error,
    setError,
    findNode,
    updateNode,
    removeNode,
    moveNode,
    addAsset,
    deleteAsset,
    startRename,
    confirmRename,
    cancelRename,
    findParent,
  };
}
