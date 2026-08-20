const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-16 text-center">
    <p className="text-base font-medium text-gray-700">{title}</p>
    {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
