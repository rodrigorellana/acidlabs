import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import {
  Button, Select, HStack, Flex, Box, Spacer, Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  StackDivider,
  VStack,
  Text,
  AbsoluteCenter,
  CircularProgress,
} from '@chakra-ui/react'
import useJokes from '../hooks/jokes';

const getPageInfo = (target: string, def: number): number => {
  const value = localStorage.getItem(target);
  if (value) {
    return parseInt(value)
  } else return def
}

const JokesTable = () => {
  const history = useHistory();
  const { jokes: data, isLoading, fetchJokesPaginate } = useJokes();
  const [page, setPage] = useState<number>(getPageInfo('page', 1));
  const [limit, setLimit] = useState<number>(getPageInfo('limit', 5));

  useEffect(() => {
    fetchJokesPaginate(page, limit)
  }, [page, limit])

  const getColor = (views: number) => {
    if (views <= 25) {
      return { color: 'tomato' }
    } else if (views >= 25 && views <= 50) {
      return { color: 'orange' }
    } else if (views >= 51 && views <= 75) {
      return { color: 'yellow' }
    } else if (views >= 76 && views <= 100) {
      return { color: 'green' }
    }
  };

  const handlePage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setPage(1)
    setLimit(parseInt(event.target.value))
  };

  return (
    <VStack
      divider={<StackDivider borderColor='gray.200' />}
      spacing={4}
      align='stretch'
    >
      <Box minHeight={300} w='700px'>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th w='40%'>Title</Th>
                <Th w='35%'>Author</Th>
                <Th w='15%'>Created date</Th>
                <Th w='10%' isNumeric>Views</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                isLoading ? (
                  <Tr>
                    <Td>
                      <AbsoluteCenter >
                        <CircularProgress isIndeterminate />
                      </AbsoluteCenter>
                    </Td>
                  </Tr>

                ) : (
                  data.map((row) => (
                    <Tr key={row.id}>
                      <Td whiteSpace='break-spaces'>
                        <Link style={{textDecoration:'underline'}} to={`/joke/${row.id}`}>{row.title || '<empty>'}</Link>
                      </Td>
                      <Td>{row.author}</Td>
                      <Td>
                        {row.createdAt}
                      </Td>
                      <Td isNumeric>
                        <p style={getColor(row.views as number)}> {row.views}</p>
                      </Td>
                    </Tr>
                  ))
                )
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box>
        <Flex>
          <Box>
            <Button onClick={() => { history.push('/joke') }}>Add Joke</Button>
          </Box>
          <Spacer />
          <Box>
            <Select onChange={handlePage} value={limit}>
              <option value="5">5</option>
              <option value="10">10</option>
            </Select>
          </Box>
          <Spacer />
          <Box>
            <HStack justifyContent='space-around'>
              <Button isDisabled={!(page > 1)} onClick={() => setPage(page - 1)}>{'<'}</Button>
              <Text >Page {page}</Text>
              {(data.length > 0 && data.length === limit) && <Button onClick={() => setPage(page + 1)}>{'>'}</Button>}
            </HStack>
          </Box>
        </Flex>
      </Box>
    </VStack>
  );
};

export default JokesTable;
