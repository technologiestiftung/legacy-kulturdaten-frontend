import { useUser } from './useUser';

export const Profile: React.FC = () => {
  const { user, logoutUser } = useUser();

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button
        onClick={() => {
          logoutUser();
        }}
      >
        Logout
      </button>
    </div>
  );
};
