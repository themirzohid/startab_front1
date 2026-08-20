import { Select, Option, Input } from '@material-tailwind/react';
import { DEVELOPER_CATEGORIES, LEVELS, STARTUP_STAGES } from '../../constants/categories.js';

// Barcha filtrlar ixtiyoriy — hech qaysi biri tanlanmasa, to'liq ro'yxat chiqadi
const StartupFilter = ({ filters, onChange }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Qidirish"
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
      />

      <Select label="Kerakli mutaxassislik" value={filters.role || ''} onChange={(v) => update('role', v)}>
        <Option value="">Barchasi</Option>
        {DEVELOPER_CATEGORIES.map((c) => (
          <Option key={c.value} value={c.value}>
            {c.label}
          </Option>
        ))}
      </Select>

      <Select label="Daraja" value={filters.level || ''} onChange={(v) => update('level', v)}>
        <Option value="">Barchasi</Option>
        {LEVELS.map((l) => (
          <Option key={l.value} value={l.value}>
            {l.label}
          </Option>
        ))}
      </Select>

      <Select label="Bosqich" value={filters.stage || ''} onChange={(v) => update('stage', v)}>
        <Option value="">Barchasi</Option>
        {STARTUP_STAGES.map((s) => (
          <Option key={s.value} value={s.value}>
            {s.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default StartupFilter;
