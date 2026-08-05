import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle2, Check, Filter, Plus } from 'lucide-react';
import { updateItemProgress } from '../api/client';
import AddItemModal from './AddItemModal';

export default function ExcelDataTable({
  items = [],
  activeCategory = 'Indoor Work',
  onCategoryChange,
  onItemUpdated,
  projectId,
  timelineProgress = 0,
}) {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLaggingOnly, setFilterLaggingOnly] = useState(false);
  const [savingItemIds, setSavingItemIds] = useState(new Set());
  const [savedSuccessIds, setSavedSuccessIds] = useState(new Set());
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  const categories = ['Indoor Work', 'Outdoor Work', 'Cables', 'Telecom'];

  useEffect(() => {
    setTableData(items);
  }, [items]);

  const handleExecutedQuantityChange = (itemId, newValue) => {
    const numericValue = newValue === '' ? 0 : Math.max(0, Number(newValue));

    setTableData((prevItems) =>
      prevItems.map((item) => {
        if (item._id === itemId) {
          const scope = item.scopeQuantity || 0;
          const balance = Math.max(0, scope - numericValue);
          const percentProgress = scope > 0 ? (numericValue / scope) * 100 : 0;
          const weightage = item.weightageFactor || 0;
          const earnedProgress = percentProgress * weightage;
          const isLagging = timelineProgress - percentProgress > 15;

          return {
            ...item,
            executedQuantity: numericValue,
            balanceQuantity: Number(balance.toFixed(2)),
            percentProgress: Number(percentProgress.toFixed(2)),
            earnedProgress: Number(earnedProgress.toFixed(4)),
            isLagging,
          };
        }
        return item;
      })
    );
  };

  const handleSaveExecutedQuantity = async (itemId, finalValue) => {
    setSavingItemIds((prev) => new Set(prev).add(itemId));
    try {
      const response = await updateItemProgress(itemId, finalValue);
      setSavedSuccessIds((prev) => new Set(prev).add(itemId));
      setTimeout(() => {
        setSavedSuccessIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }, 1500);

      if (onItemUpdated) {
        onItemUpdated(response.item);
      }
    } catch (error) {
      console.error('Failed to update executed quantity:', error);
    } finally {
      setSavingItemIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const filteredItems = tableData.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLagging = filterLaggingOnly ? item.isLagging : true;
    return matchesSearch && matchesLagging;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((catName) => {
              const isActive = activeCategory === catName;
              return (
                <button
                  key={catName}
                  onClick={() => onCategoryChange(catName)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Item
            </button>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setFilterLaggingOnly(!filterLaggingOnly)}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                filterLaggingOnly
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5 mr-1" />
              {filterLaggingOnly ? 'Show All' : 'Lagging Only'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-3 w-12 text-center">S.No</th>
              <th className="py-3 px-4 min-w-[240px]">Description of Item</th>
              <th className="py-3 px-3 min-w-[80px]">UOM</th>
              <th className="py-3 px-3 text-right min-w-[90px]">Scope Qty</th>
              <th className="py-3 px-4 text-center min-w-[140px] bg-blue-50/70 border-x border-blue-100 text-blue-900">
                Executed Qty (Editable)
              </th>
              <th className="py-3 px-3 text-right min-w-[90px]">Balance</th>
              <th className="py-3 px-3 text-right min-w-[100px]">% Progress</th>
              <th className="py-3 px-3 text-right min-w-[80px]">Weightage</th>
              <th className="py-3 px-3 text-right min-w-[100px]">Earned %</th>
              <th className="py-3 px-4 text-center min-w-[120px]">Pace Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 font-normal">
                  No matching items found for {activeCategory}. Click "+ Add Item" above to add items.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const isSaving = savingItemIds.has(item._id);
                const isSaved = savedSuccessIds.has(item._id);
                const isLagging = item.isLagging;

                return (
                  <tr
                    key={item._id}
                    className={`transition-colors duration-150 ${
                      isLagging ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                      {item.sNo || index + 1}
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {item.description}
                    </td>

                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {item.uom}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                      {item.scopeQuantity}
                    </td>

                    <td className="py-2 px-3 text-center bg-blue-50/30 border-x border-blue-100">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="number"
                          min="0"
                          max={item.scopeQuantity * 2}
                          value={item.executedQuantity}
                          onChange={(e) =>
                            handleExecutedQuantityChange(item._id, e.target.value)
                          }
                          onBlur={(e) =>
                            handleSaveExecutedQuantity(item._id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur();
                            }
                          }}
                          className={`w-24 text-center px-2 py-1 bg-white border font-mono font-bold rounded text-sm focus:outline-none transition ${
                            isSaved
                              ? 'border-emerald-500 ring-2 ring-emerald-200 text-emerald-700'
                              : isSaving
                              ? 'border-blue-400 ring-2 ring-blue-100'
                              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-blue-700'
                          }`}
                        />
                        {isSaved && (
                          <Check className="w-4 h-4 text-emerald-600 absolute right-1.5" />
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {item.balanceQuantity}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <span
                        className={
                          item.percentProgress >= 100
                            ? 'text-emerald-600'
                            : isLagging
                            ? 'text-amber-600'
                            : 'text-slate-800'
                        }
                      >
                        {item.percentProgress}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                      {item.weightageFactor}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">
                      {item.earnedProgress}%
                    </td>

                    <td className="py-2.5 px-4 text-center">
                      {isLagging ? (
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs cursor-help"
                          title={`Lagging: ${item.lagPercentage}% behind expected timeline pace (${timelineProgress}%)`}
                        >
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                          Lagging (&gt;15%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        projectId={projectId}
        categoryName={activeCategory}
        onItemAdded={onItemUpdated}
      />

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>Showing {filteredItems.length} of {tableData.length} items</span>
        <span className="italic">Click any "Executed Qty" cell to edit &amp; sync automatically</span>
      </div>
    </div>
  );
}
