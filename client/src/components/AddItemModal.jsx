import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { addItemToProject } from '../api/client';

export default function AddItemModal({ isOpen, onClose, projectId, categoryName, onItemAdded }) {
  const [description, setDescription] = useState('');
  const [uom, setUom] = useState('Numbers');
  const [scopeQuantity, setScopeQuantity] = useState(10);
  const [executedQuantity, setExecutedQuantity] = useState(0);
  const [weightageFactor, setWeightageFactor] = useState(0.05);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newItem = await addItemToProject(projectId, {
        categoryName,
        description: description.trim(),
        uom,
        scopeQuantity: Number(scopeQuantity),
        executedQuantity: Number(executedQuantity),
        weightageFactor: Number(weightageFactor),
      });

      setDescription('');
      setScopeQuantity(10);
      setExecutedQuantity(0);
      onItemAdded(newItem);
      onClose();
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">Add Item to {categoryName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Item Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Signal Junction Box Type-A"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                UOM (Unit)
              </label>
              <input
                type="text"
                required
                placeholder="Numbers / Metre"
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Weightage Factor
              </label>
              <input
                type="number"
                step="0.01"
                min="0.001"
                max="1.0"
                value={weightageFactor}
                onChange={(e) => setWeightageFactor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Scope Quantity
              </label>
              <input
                type="number"
                min="1"
                value={scopeQuantity}
                onChange={(e) => setScopeQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Executed Quantity
              </label>
              <input
                type="number"
                min="0"
                value={executedQuantity}
                onChange={(e) => setExecutedQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
