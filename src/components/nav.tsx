import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Heading,
  MenuDivider,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import UserContext from '../contexts/userContext';
import Dialog from './dialog';
import userPic from '../assets/images/user.svg';

export default function Nav() {
  const { user, signOut } = useContext(UserContext);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex h={16} alignItems={'center'}  justifyContent={'space-between'}>
      <Box>Acid Labs </Box>
      <Flex alignItems={'center'}>
        <Stack direction={'row'} spacing={7}>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          {user && (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={userPic}
                />
              </MenuButton>
              <MenuList alignItems={'center'}>
                <Center>
                  <Avatar
                    size={'2xl'}
                    src={userPic}
                  />
                </Center>
                <br />
                <Center>
                  <Heading fontSize='20px' textTransform='capitalize'>
                    {user?.name}
                  </Heading>
                </Center>
                <br />
                <MenuDivider />
                <Center>
                  <Dialog okClick={signOut} message='Logout'>
                  </Dialog>
                </Center>
              </MenuList>
            </Menu>
          )}
        </Stack>
      </Flex>
    </Flex>
  );
}