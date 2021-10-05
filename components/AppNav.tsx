import { Flex, Spacer, Center } from '@chakra-ui/react';
import Profile from './Profile';

const AppNav = () => {
  return (
    <Flex direction='column' h='100%' pt='1rem' pb='1rem'>
      <Spacer />
      <Center>
        <Profile />
      </Center>
    </Flex>
  );
};

export default AppNav;
