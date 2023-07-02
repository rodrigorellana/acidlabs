import React, { useEffect, useState, useContext } from 'react';
import { Route } from 'react-router-dom';
import { Button, Center } from "@chakra-ui/react";
import UserContext from '../contexts/userContext';

// function ProtectedRoute({ component: Component, ...rest }: {
//   component: React.ComponentType<RouteProps>;
// }) {
function ProtectedRoute({ component: Component, ...rest }: any) {
  const [isLoading, setLoading] = useState(true);
  const { user, signIn } = useContext(UserContext);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn({ name: 'acid labs' });
    }, 1500);
  };

  return (
    <>
      <Route
        {...rest}
        render={(props) => isLoading && !user ? (
          <h1>Loading...</h1>
        ) : user ? (
          <Component {...props} />
        ) : (
          <>
            <Center>
              <Button onClick={handleSubmit}>Sign In</Button>
            </Center>
          </>
        )} />
    </>
  );
}

export default ProtectedRoute;