"use client"
import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { IJoke } from '../interfaces/jokes';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  VStack,
  AbsoluteCenter,
  CircularProgress,
  HStack
} from '@chakra-ui/react'
import useJokes from '../hooks/jokes';
import Dialog from '../components/dialog';

export const Jokes = ({ match }: RouteComponentProps<{ jokeId?: string }>) => {
  const history = useHistory();
  const { jokeId } = match.params;
  const { joke, getJoke, updateJoke, deleteJoke, createJoke, isLoading, isSubmitting } = useJokes();

  useEffect(() => {
    if (jokeId) {
      getJoke(jokeId)
    }
  }, [jokeId])

  const getValue = (event: React.FormEvent<HTMLFormElement>, name: string) => {
    const obj = event.currentTarget.elements.namedItem(name) as HTMLInputElement
    return obj.value
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const jokeForm: IJoke = {
      title: getValue(event, 'title'),
      views: parseInt(getValue(event, 'views')),
      body: getValue(event, 'body'),
      author: getValue(event, 'author'),
      id: jokeId,
    }

    if (jokeId) {
      jokeForm.createdAt = joke.createdAt
      await updateJoke(jokeForm)
    } else {
      const res = await createJoke(jokeForm)
      if (res) {
        localStorage.removeItem('page')
        history.push('/jokes')
      }
    }
  }

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const res = await deleteJoke(jokeId as string)
    if (res) history.push('/jokes')
  }

  return (
    <Box minHeight={300} w='400px'>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} >
          {(isLoading && jokeId) ? (
            <AbsoluteCenter >
              <CircularProgress isIndeterminate />
            </AbsoluteCenter>) : (
            <>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input type='text' name="title" placeholder='Title' maxLength={50} defaultValue={joke.title} />
                <FormErrorMessage>Title is required.</FormErrorMessage>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Body</FormLabel>
                <Input type='text' name="body" placeholder='Body' maxLength={50} defaultValue={joke.body} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Author</FormLabel>
                <Input type='text' name="author" placeholder='Author' maxLength={50} defaultValue={joke.author} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Views</FormLabel>
                <NumberInput name="views" min={0} defaultValue={joke.views}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </>
          )}
          <Box>
            <HStack hidden={isLoading}>
              <Button isLoading={isSubmitting}
                loadingText='Submitting'
                type='submit'>Save</Button>
              {(jokeId && !isSubmitting) && <Dialog okClick={handleDelete} message='Delete'></Dialog>}
              <Button onClick={() => { history.push('/jokes') }}>Close</Button>
            </HStack>
          </Box>
        </VStack>
      </form>
    </Box>
  )
}
