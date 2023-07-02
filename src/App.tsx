
import JokesTable from './components/table';
import { Jokes as JokePage } from './pages/jokes';
import { BrowserRouter, Switch } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ProtectedRoute from './config/protectedRoute';
import MainContainer from './containers/mainContainer';
import ErrorComponent from './components/errorComponent';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorComponent} onError={(error: Error) => {
      console.error(error)
    }}>
      <MainContainer>
        <BrowserRouter>
          <Switch>
            <ProtectedRoute exact path="/" component={JokesTable} />
            <ProtectedRoute exact path="/jokes/" component={JokesTable} />
            <ProtectedRoute path="/joke/:jokeId" component={JokePage} />
            <ProtectedRoute path="/joke" component={JokePage} />
          </Switch>
        </BrowserRouter>
      </MainContainer>
    </ErrorBoundary>
  );
}

export default App;
