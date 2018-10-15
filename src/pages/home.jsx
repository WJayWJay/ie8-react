import React from 'react'
import { Link } from 'router'
import { Menu } from 'antd'

import './home.less';
export default class Home extends React.PureComponent {

    state = {
        current: 'statistic',
    };
    componentDidMount () {
        this.setState({
            current: this.props['*'],
        });
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
                <span>资料系统</span><span> V1.0</span>
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