import { useUser } from './useUser';

export const Profile: React.FC = () => {
  const { user } = useUser();

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
