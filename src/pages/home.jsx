import React from 'react'
import { Link } from 'router'
import { Menu } from 'antd'
import { getUserInfo } from '@/network'

import './home.less';
export default class Home extends React.PureComponent {

    state = {
        current: 'statistic',
        user: {},
        isLogin: true,
    };
    componentDidMount () {
        this.setState({
            current: this.props['*'],
        });

        this.getUserInfo();
    }
    getUserInfo = () => {
        getUserInfo().then(res => {
            console.log(res);
            if (res && res.data) {
                this.setState({user: res.data, isLogin: true});
            } else {
                this.setState({user: {}, isLogin: false});
                this.props.navigate('/login')
            }
        })
    }
    selectMenu = (e) => {
        const { navigate } = this.props;
        const key = e.key
        this.setState({
            current: key,
        });
        navigate(key);
    }

    render () {
        const { children } = this.props;
        return <div className="data-home-container">
            <div className="header">
                <div className={'header-left'}>
                    <span className='title'>资料系统</span><span> V1.0</span>
                </div>
                <div className={'header-right'}>
                    {this.state.isLogin && <span>{this.state.user.name || ''}</span>}
                    <div className={'head-right-hover'}>
                        <div className={'head-right-btn'}><span>修改密码</span></div>
                        <div className={'head-right-btn'}><span>退出登录</span></div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="navigation">
                    <Menu 
                        onClick={this.selectMenu}
                        selectedKeys={this.state.current}
                        mode="horizontal">
                        <Menu.Item key="statistic">数据统计</Menu.Item>
                        <Menu.Item key="baisc">基本信息</Menu.Item>
                        <Menu.Item key="account">账号管理</Menu.Item>
                        <Menu.Item key="data">数据项管理</Menu.Item>
                    </Menu>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    }
}