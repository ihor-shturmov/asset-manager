// Types for asset nodes
export type AssetType = 'folder' | 'file';

export interface AssetNode {
  id: string;
  name: string;
  type: AssetType;
  children?: AssetNode[];
  parentId?: string | null;
}
