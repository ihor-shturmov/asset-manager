import { type AssetNode } from '../types';
import { useAssetTree } from '../hooks/useAssetTree';
import AssetTree from './AssetTree';
import MoveDropdown from './MoveDropdown';

const initialTree: AssetNode = {
  id: 'root',
  name: 'Root',
  type: 'folder',
  children: [],
  parentId: null,
};

function AssetManager() {
  const {
    tree,
    selectedId,
    setSelectedId,
    editingId,
    newName,
    setNewName,
    error,
    moveNode,
    addAsset,
    deleteAsset,
    startRename,
    confirmRename,
    cancelRename,
  } = useAssetTree(initialTree);

  return (
    <div className="fixed inset-0 min-h-screen min-w-full bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700 dark:text-blue-300 drop-shadow">Asset Manager</h1>
        <div className="tree-container">
          <AssetTree
            node={tree}
            selectedId={selectedId}
            editingId={editingId}
            newName={newName}
            onSelect={setSelectedId}
            onStartRename={startRename}
            onConfirmRename={confirmRename}
            onCancelRename={cancelRename}
            onChangeName={setNewName}
            onDelete={deleteAsset}
            onAdd={addAsset}
            MoveDropdown={({ nodeId }) => (
              <MoveDropdown nodeId={nodeId} tree={tree} moveNode={moveNode} />
            )}
          />
        </div>
        {error && <div className="text-red-700 bg-red-100 border border-red-300 rounded px-4 py-2 mt-6 text-center font-medium shadow">{error}</div>}
      </div>
    </div>
  );
}

export default AssetManager;
