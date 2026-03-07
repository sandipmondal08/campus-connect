interface RoleBadgeProps {
  role: 'student' | 'faculty';
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const cls = role === 'student' ? 'tag-student' : 'tag-faculty';
  return (
    <span className={`${cls} px-2 py-0.5 rounded-full text-xs font-medium capitalize`}>
      {role}
    </span>
  );
};

export default RoleBadge;
