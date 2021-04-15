import { useUser } from './useUser';

export const Profile: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
};
