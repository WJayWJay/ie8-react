
import { Router } from 'router'

// import Loadable from "react-loadable"

import Home from '@/pages/home'
import Login from '@/pages/login'
import Root from '@/pages/root'
import NotFound from '@/pages/notfound'


const Routes = [
    <Home path="/" />,
    <Login path="login" />,
    <NotFound default />
];

const router = () => (
    <Router mode='hash'>
        <Root path="/">
            {Routes}
        </Root>
    </Router>
)

export default router;