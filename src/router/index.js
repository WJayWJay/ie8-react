
import { Router } from 'router'

// import Loadable from "react-loadable"

import Home from '@/pages/home'
import BasicInfo from '@/pages/home/basic-info'
import AccountManager from '@/pages/home/account-manager'
import DataManager from '@/pages/home/data-manager'
import DataStatistic from '@/pages/home/data-statistic'
import Login from '@/pages/login'
import Root from '@/pages/root'
import NotFound from '@/pages/notfound'


const Routes = [
    <Home path="/">
        <DataStatistic path="statistic" />
        <BasicInfo path="baisc" />
        <AccountManager path="account" />
        <DataManager path="data" />
    </Home>,
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