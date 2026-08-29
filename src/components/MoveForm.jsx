import React, { useState } from 'react';

const TEAM_OPTIONS = ['red', 'blue', 'pivot', 'neutral'];
const SIDE_OPTIONS = ['BLOCKER', 'BUILDER', 'MIXED', 'UNKNOWN'];
const THEATER_OPTIONS = [
  'ROOT',
  'DEEP',
  'PRE',
  'PROLOGUE',
  'MIDDLE_EAST',
  'WESTERN_HEM',
  'SOUTH_ASIA',
  'CAUCASUS',
  'HORN_AFRICA',
  'INDO_PACIFIC',
];

const emptyForm = {
  id: '',
  team: 'red',
  date: '',
  actor: '',
  title: '',
  desc: '',
  impact: '',
  side: 'BLOCKER',
  theater: 'MIDDLE_EAST',
  year: 2024,
};

export default function MoveForm({ move, onSave, onClose }) {
  const isEditing = Boolean(move);

  const [form, setForm] = useState(() => {
    if (move) {
      return {
        id: move.id || '',
        team: move.team || 'red',
        date: move.date || '',
        actor: move.actor || '',
        title: move.title || '',
        desc: move.desc || '',
        impact: move.impact || '',
        side: move.side || 'BLOCKER',
        theater: move.theater || 'MIDDLE_EAST',
        year: move.year || 2024,
      };
    }
    return { ...emptyForm };
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  function validate() {
    const required = { id: 'ID', actor: 'Actor', title: 'Title', desc: 'Description', year: 'Year' };
    const newErrors = {};
    for (const [field, label] of Object.entries(required)) {
      const val = form[field];
      if (val === '' || val === null || val === undefined) {
        newErrors[field] = `${label} is required`;
      }
    }
    if (form.year && (form.year < 2003 || form.year > 2030)) {
      newErrors.year = 'Year must be between 2003 and 2030';
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(form);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  const inputClass =
    'w-full bg-gray-50 text-gray-900 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1';
  const errorClass = 'text-red-400 text-xs mt-0.5';

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {isEditing ? 'Edit Move' : 'Add Move'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Two-column grid for short fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* ID */}
            <div>
              <label className={labelClass}>ID *</label>
              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="M09, R-A, PRE-C"
                className={inputClass}
              />
              {errors.id && <p className={errorClass}>{errors.id}</p>}
            </div>

            {/* Team */}
            <div>
              <label className={labelClass}>Team</label>
              <select name="team" value={form.team} onChange={handleChange} className={inputClass}>
                {TEAM_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="text"
                name="date"
                value={form.date}
                onChange={handleChange}
                placeholder="Feb 28, 2026"
                className={inputClass}
              />
            </div>

            {/* Year */}
            <div>
              <label className={labelClass}>Year *</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                min={2003}
                max={2030}
                className={inputClass}
              />
              {errors.year && <p className={errorClass}>{errors.year}</p>}
            </div>

            {/* Side */}
            <div>
              <label className={labelClass}>Side</label>
              <select name="side" value={form.side} onChange={handleChange} className={inputClass}>
                {SIDE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Theater */}
            <div>
              <label className={labelClass}>Theater</label>
              <select
                name="theater"
                value={form.theater}
                onChange={handleChange}
                className={inputClass}
              >
                {THEATER_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actor — full width */}
          <div>
            <label className={labelClass}>Actor *</label>
            <input
              type="text"
              name="actor"
              value={form.actor}
              onChange={handleChange}
              placeholder="IRAN — LAST CARD"
              className={inputClass}
            />
            {errors.actor && <p className={errorClass}>{errors.actor}</p>}
          </div>

          {/* Title — full width */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Strait of Hormuz closed"
              className={inputClass}
            />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          {/* Description — full width textarea */}
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              rows={4}
              placeholder="Full description of the move..."
              className={inputClass + ' resize-vertical'}
            />
            {errors.desc && <p className={errorClass}>{errors.desc}</p>}
          </div>

          {/* Impact — full width */}
          <div>
            <label className={labelClass}>Impact</label>
            <input
              type="text"
              name="impact"
              value={form.impact}
              onChange={handleChange}
              placeholder="ALL CORRIDORS THREATENED"
              className={inputClass}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-500 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Add Move'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
