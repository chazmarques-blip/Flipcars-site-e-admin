'use client';

import { ReactNode, useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import clsx from 'clsx';

export interface FilterPanelProps {
  children: ReactNode;
  onClear?: () => void;
  activeFiltersCount?: number;
  title?: string;
}

export function FilterPanel({
  children,
  onClear,
  activeFiltersCount = 0,
  title = 'Filters',
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<Filter className="w-4 h-4" />}
      >
        {title}
        {activeFiltersCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <Card
            variant="elevated"
            padding="lg"
            className={clsx(
              'absolute right-0 mt-2 w-96 z-50',
              'animate-in fade-in slide-in-from-top-2 duration-200'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <div className="flex items-center gap-2">
                {onClear && activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                  >
                    Clear all
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="space-y-4">
              {children}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
}: FilterSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
