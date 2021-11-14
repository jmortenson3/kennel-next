import { signOut, useSession } from 'next-auth/client';

export default function Profile() {
  const [session, loading] = useSession();
  return (
    <div>
      {session?.user?.image && (
        <div>
          <div>
            <button type="button">
              <img
                className="w-6 rounded-full"
                src={session.user.image}
                alt={'My avatar image'}
              />
            </button>
            <div>
              <div onClick={() => signOut()}>Sign out 👋</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
