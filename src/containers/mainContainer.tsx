
import Nav from '../components/nav';
import UserProvider from '../contexts/userProvider';
import { Center } from '@chakra-ui/react'
import {
  Box,
  useColorModeValue,
} from '@chakra-ui/react';

interface IMainContainerProps {
  children: React.ReactNode;
}

export default function MainContainer({ children }: IMainContainerProps) {
  return (
    <UserProvider>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      {/* <Box px={2}> */}
        <Nav></Nav>
      </Box>
      <Box p={4}>
        <Center>
          {children}
        </Center>
      </Box>
    </UserProvider>
  );
}
