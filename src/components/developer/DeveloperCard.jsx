import { Link } from 'react-router-dom';
import { Card, CardBody, Avatar, Typography } from '@material-tailwind/react';
import CategoryBadge from '../common/CategoryBadge.jsx';

const DeveloperCard = ({ developer, compact = false }) => (
  <Link to={`/developers/${developer._id}`}>
    <Card className="h-full border border-gray-200 shadow-none transition-shadow hover:shadow-md">
      <CardBody className="flex flex-col items-center gap-2 text-center">
        <Avatar
          size={compact ? 'md' : 'lg'}
          src={developer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${developer.fullName}`}
          alt={developer.fullName}
        />
        <Typography variant="h6" className="line-clamp-1">
          {developer.fullName}
        </Typography>
        <CategoryBadge category={developer.category} level={developer.level} />

        {!compact && developer.techStack?.length > 0 && (
          <p className="mt-1 line-clamp-1 text-xs text-gray-500">
            {developer.techStack.join(' · ')}
          </p>
        )}
      </CardBody>
    </Card>
  </Link>
);

export default DeveloperCard;
