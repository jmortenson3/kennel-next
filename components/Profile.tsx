import {
  Box,
  Center,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/client';

export default function Profile() {
  const [session, loading] = useSession();
  console.log('profile session', session);
  return (
    <Box>
      {session?.user?.image && (
        <Center>
          <Menu>
            <MenuButton>
              <Image
                maxW='24'
                src={session.user.image}
                alt={'My avatar image'}
                borderRadius='50%'
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => signOut()}>Sign out 👋</MenuItem>
            </MenuList>
          </Menu>
        </Center>
      )}
    </Box>
  );
}
