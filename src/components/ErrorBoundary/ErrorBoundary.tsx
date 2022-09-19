import { AxiosError } from 'axios';
import { Component, ReactNode } from 'react';
import Error from './Error';

interface Props {
    children?: ReactNode;
}
interface State {
    hasError: boolean;
    error: AxiosError | { error: AxiosError; from: string } | null;
}

class ErrorBoundary extends Component<Props, State> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: AxiosError | { error: AxiosError; from: string }): State {
        return { hasError: true, error };
    }

    onClose() {
        this.setState({ hasError: false, error: null });
    }

    render() {
        if (this.state.hasError) return <Error open={this.state.hasError} error={this.state.error} onClose={() => this.onClose()} />;
        return this.props.children;
    }
}

export default ErrorBoundary;
