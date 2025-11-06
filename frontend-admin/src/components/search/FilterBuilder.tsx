'use client'

import { Plus, Trash2 } from 'lucide-react'
import {
  FilterGroup,
  FilterCondition,
  FilterOperator,
  FilterLogic,
  FieldType,
  FilterField,
  getOperatorLabel,
} from '@/types/search'

interface FilterBuilderProps {
  fields: FilterField[]
  filterGroup: FilterGroup
  onChange: (filterGroup: FilterGroup) => void
}

export function FilterBuilder({ fields, filterGroup, onChange }: FilterBuilderProps) {
  const addCondition = (groupId: string) => {
    const newCondition: FilterCondition = {
      id: Date.now().toString(),
      field: fields[0]?.key || '',
      operator: FilterOperator.EQUALS,
      value: null,
    }

    const updateGroup = (group: FilterGroup): FilterGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [...group.conditions, newCondition],
        }
      }
      if (group.groups) {
        return {
          ...group,
          groups: group.groups.map(updateGroup),
        }
      }
      return group
    }

    onChange(updateGroup(filterGroup))
  }

  const updateCondition = (conditionId: string, updates: Partial<FilterCondition>) => {
    const updateGroup = (group: FilterGroup): FilterGroup => {
      return {
        ...group,
        conditions: group.conditions.map((c) =>
          c.id === conditionId ? { ...c, ...updates } : c
        ),
        groups: group.groups?.map(updateGroup),
      }
    }

    onChange(updateGroup(filterGroup))
  }

  const removeCondition = (conditionId: string) => {
    const updateGroup = (group: FilterGroup): FilterGroup => {
      return {
        ...group,
        conditions: group.conditions.filter((c) => c.id !== conditionId),
        groups: group.groups?.map(updateGroup),
      }
    }

    onChange(updateGroup(filterGroup))
  }

  const toggleLogic = (groupId: string) => {
    const updateGroup = (group: FilterGroup): FilterGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          logic: group.logic === FilterLogic.AND ? FilterLogic.OR : FilterLogic.AND,
        }
      }
      if (group.groups) {
        return {
          ...group,
          groups: group.groups.map(updateGroup),
        }
      }
      return group
    }

    onChange(updateGroup(filterGroup))
  }

  const renderCondition = (condition: FilterCondition) => {
    const field = fields.find((f) => f.key === condition.field)
    if (!field) return null

    const availableOperators = field.operators || [
      FilterOperator.EQUALS,
      FilterOperator.NOT_EQUALS,
      FilterOperator.CONTAINS,
    ]

    return (
      <div key={condition.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
        {/* Field Selector */}
        <select
          value={condition.field}
          onChange={(e) => {
            const newField = fields.find((f) => f.key === e.target.value)
            updateCondition(condition.id, {
              field: e.target.value,
              operator: newField?.operators?.[0] || FilterOperator.EQUALS,
              value: null,
            })
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {fields.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Operator Selector */}
        <select
          value={condition.operator}
          onChange={(e) =>
            updateCondition(condition.id, { operator: e.target.value as FilterOperator })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {availableOperators.map((op) => (
            <option key={op} value={op}>
              {getOperatorLabel(op)}
            </option>
          ))}
        </select>

        {/* Value Input */}
        {condition.operator !== FilterOperator.IS_NULL &&
          condition.operator !== FilterOperator.IS_NOT_NULL && (
          <>
            {field.type === FieldType.SELECT && field.options && (
              <select
                value={condition.value as string}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select value...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === FieldType.TEXT && (
              <input
                type="text"
                value={(condition.value as string) || ''}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                placeholder="Enter value..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.type === FieldType.NUMBER && (
              <input
                type="number"
                value={(condition.value as number) || ''}
                onChange={(e) => updateCondition(condition.id, { value: parseFloat(e.target.value) })}
                placeholder="Enter number..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.type === FieldType.DATE && (
              <input
                type="date"
                value={(condition.value as string) || ''}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.type === FieldType.BOOLEAN && (
              <select
                value={(condition.value as string) || 'true'}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value === 'true' })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}
          </>
        )}

        {/* Remove Button */}
        <button
          onClick={() => removeCondition(condition.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove condition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const renderGroup = (group: FilterGroup, level = 0) => {
    return (
      <div
        key={group.id}
        className={`border-l-2 border-blue-300 pl-4 ${level > 0 ? 'mt-3' : ''}`}
      >
        {/* Logic Toggle */}
        {group.conditions.length > 1 && (
          <div className="mb-3">
            <button
              onClick={() => toggleLogic(group.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                group.logic === FilterLogic.AND
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              Match {group.logic === FilterLogic.AND ? 'ALL' : 'ANY'} conditions
            </button>
          </div>
        )}

        {/* Conditions */}
        <div className="space-y-2">
          {group.conditions.map(renderCondition)}
        </div>

        {/* Nested Groups */}
        {group.groups && group.groups.length > 0 && (
          <div className="mt-3 space-y-3">
            {group.groups.map((nestedGroup) => renderGroup(nestedGroup, level + 1))}
          </div>
        )}

        {/* Add Condition Button */}
        <button
          onClick={() => addCondition(group.id)}
          className="mt-3 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add condition</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filterGroup.conditions.length === 0 && (!filterGroup.groups || filterGroup.groups.length === 0) ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500 mb-3">No filters applied</p>
          <button
            onClick={() => addCondition(filterGroup.id)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add your first filter</span>
          </button>
        </div>
      ) : (
        renderGroup(filterGroup)
      )}
    </div>
  )
}
