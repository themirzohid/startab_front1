import { Link } from 'react-router-dom';
import { Card, CardBody, Chip, Typography } from '@material-tailwind/react';
import { categoryLabel } from '../../constants/categories.js';

const STAGE_LABELS = { Idea: "G'oya", MVP: 'MVP', Growth: "O'sish", Launched: 'Ishga tushgan' };

const StartupCard = ({ startup }) => (
  <Link to={`/startups/${startup._id}`}>
    <Card className="h-full border border-gray-200 shadow-none transition-shadow hover:shadow-md">
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <Typography variant="h6" className="line-clamp-1">
            {startup.title}
          </Typography>
          <Chip size="sm" variant="ghost" color="blue" value={STAGE_LABELS[startup.stage]} />
        </div>

        <Typography variant="small" className="line-clamp-2 text-gray-600">
          {startup.description}
        </Typography>

        {startup.requiredRoles?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {startup.requiredRoles.slice(0, 3).map((r, i) => (
              <Chip
                key={i}
                size="sm"
                variant="outlined"
                value={`${categoryLabel(r.category)} · ${r.level}`}
                className="rounded-full text-[11px]"
              />
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
          <span>{startup.owner?.fullName}</span>
          <span>{startup.teamMembers?.length || 0} nafar jamoada</span>
        </div>
      </CardBody>
    </Card>
  </Link>
);

export default StartupCard;
