/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { IJoke } from '../interfaces/jokes';
import { useErrorBoundary } from 'react-error-boundary'
const URL = import.meta.env.VITE_JOKES_URL

const useJokes = () => {
  const [jokes, setJokes] = useState<IJoke[]>([]);
  const [joke, setJoke] = useState<IJoke>({} as IJoke);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const { showBoundary } = useErrorBoundary()
  //PULGX TODO move page logic to this hook

  const getFormatedDate = (date: string) => {
    try {
      const formattedDate = new Intl.DateTimeFormat('en', {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
      const [month, day, year] = formattedDate.split(' ');
      const capitalizedMonth = month.toLocaleUpperCase();
      return `${day} ${capitalizedMonth} ${year}`;
    } catch (err) {
      return 'Invalid date'
    }
  }

  const sanitizeJoke = (joke: any): IJoke => {
    return {
      id: joke.id,
      title: joke.title || joke.Title || joke.query,
      // views: (joke.views ? joke.views : joke.Views) ,
      views: joke.views,
      body: joke.body || joke.Body,
      author: joke.author || joke.Author,
      createdAt: getFormatedDate(joke.createdAt || joke.CreatedAt)
    }
  }

  useEffect(() => {
    if (error) {
      const err = error as AxiosError
      if (err.response)
        showBoundary(err);
      else
        showBoundary(error);
    }
  }, [error]);

  const manageError = (err: any) => {
    setLoading(false)
    setSubmitting(false)
    setError(err);
    return false;
  }

  const fetchJokesPaginate = async (page = 1, limit = 5) => {
    try {
      setLoading(true)
      const target = URL + `/?_page=${page}&_limit=${limit}&_sort=id&_order=desc`
      const response = await axios.get(target)
      const data = response.data
      localStorage.setItem('page', JSON.stringify(page));
      localStorage.setItem('limit', JSON.stringify(limit));
      setJokes(data.map((joke: unknown) => sanitizeJoke(joke)));
      setLoading(false)
    } catch (err: any) {
      return manageError(err);
    }
  };

  const fetchJokes = async () => {
    try {
      setLoading(true)
      const response = await axios.get(URL);
      const data = await response.data as IJoke[]
      setJokes(data.map((joke: IJoke) => sanitizeJoke(joke)));
      setLoading(false)
    } catch (err: any) {
      return manageError(err);
    }
  };

  const getJoke = async (id: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`${URL}/${id}`);
      const data = await response.data as IJoke
      setJoke(sanitizeJoke(data));
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      // return manageError(err);
    }
  };

  const createJoke = async (joke: IJoke): Promise<boolean> => {
    try {
      setSubmitting(true)
      const now = new Date()
      joke.createdAt = now.toISOString()
      const response = await axios.post(URL, joke)
      const data = await response.data
      setJokes([...jokes, data]);
      setSubmitting(false)
      return true;
    } catch (err: any) {
      return manageError(err);
    }
  };

  const updateJoke = async (updatedJoke: IJoke): Promise<boolean> => {
    try {
      setSubmitting(true)
      const response = await axios.put(`${URL}/${updatedJoke.id}`, updatedJoke)
      const data = await response.data
      setJokes(jokes.map(joke => joke.id === updatedJoke.id ? data : joke));
      setSubmitting(false)
      return true;
    } catch (err: any) {
      return manageError(err);
    }
  };

  const deleteJoke = async (id: string): Promise<boolean> => {
    try {
      setSubmitting(true)
      await axios({
        baseURL: URL,
        url: `/${id}`,
        method: "DELETE"
      })
      setJokes(jokes.filter(joke => joke.id !== id));
      setSubmitting(false)
      return true;
    } catch (err: any) {
      return manageError(err);
    }
  };

  return {
    jokes,
    joke,
    error,
    isLoading,
    isSubmitting,
    getJoke,
    deleteJoke,
    fetchJokes,
    updateJoke,
    createJoke,
    fetchJokesPaginate,
    showBoundary
  };
};

export default useJokes;