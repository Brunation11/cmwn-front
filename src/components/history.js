import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
// useRouterHistory creates a composable higher-order function
const appHistory = useRouterHistory(createHistory)({ queryKey: false });

export default appHistory;
