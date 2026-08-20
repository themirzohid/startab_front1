import { Chip } from '@material-tailwind/react';
import { categoryLabel } from '../../constants/categories.js';

const CATEGORY_COLORS = {
  'UI/UX Designer': 'pink',
  'Backend Developer': 'green',
  'Cyber Security Specialist': 'red',
  'Frontend Developer': 'blue',
  'Fullstack Developer': 'purple',
  'Regular User': 'gray',
};

const CategoryBadge = ({ category, level }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <Chip
      size="sm"
      variant="ghost"
      color={CATEGORY_COLORS[category] || 'gray'}
      value={categoryLabel(category)}
      className="rounded-full text-xs"
    />
    {level && level !== 'N/A' && (
      <Chip
        size="sm"
        variant="outlined"
        color="blue-gray"
        value={level}
        className="rounded-full text-xs"
      />
    )}
  </div>
);

export default CategoryBadge;
