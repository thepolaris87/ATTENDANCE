// REDUX
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './slices';
import logger from 'redux-logger';

// ROUTER
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';

// LAYOUT
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

// API
import { QueryClientProvider, QueryClient } from 'react-query';

// STYLE
import { ThemeProvider } from '@mui/material';
import theme from './aseets/styles/theme';
import './aseets/styles/style.css';

import { default as pack } from '../package.json';

console.log('version : v' + pack.version);

const middleware: any[] = [process.env.NODE_ENV === 'development' && logger].filter(Boolean);

const store = configureStore({ reducer: rootReducer, middleware });
const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } });
function App() {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <ErrorBoundary>
                            <Layout>
                                <Router />
                            </Layout>
                        </ErrorBoundary>
                    </ThemeProvider>
                </Provider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
