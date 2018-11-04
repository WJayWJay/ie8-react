import React from 'react'
import { Link } from 'router'
import { Menu , Modal, Message} from 'antd'
import { getUserInfo, logout, resetSelfPwd } from '@/network'

import Loading from '@/component/loading';
import ResetSelfPwd from '@/component/resetSelf';

import './home.less';
export default class Home extends React.PureComponent {

    state = {
        current: 'statistic',
        user: {},
        isLogin: false,
        userLoading: false,
        resetVisibility: false,

        networkErrorCount: 0,

    };
    componentDidMount () {
        this.setState({
            current: this.props['*'] || '',
        });
        console.log(this.props)

        this.getUserInfo();
    }
    setUserLoading = (flag) => {
        this.setState({
            userLoading: flag
        });
    }
    getUserInfo = () => {
        const { networkErrorCount } = this.state;
        this.setUserLoading(true);
        getUserInfo().then(res => {
            this.setUserLoading(false);
            console.log(res);

            if (res && res.data && res.code === 0) {
                this.setState({user: res.data, isLogin: true, networkErrorCount: 0});
            } else if(res && res.code && res.code !== 0) {
                this.setState({user: {}, isLogin: false});
                this.props.navigate('/login')
            } else {
                if (networkErrorCount < 3) {
                    this.getUserInfo();
                }
                this.setState({
                    networkErrorCount: networkErrorCount+1
                });
            }
        })
    }

    logout = () => {
        logout().then(res => {
            if (res && res.code === 0) {
                this.props.navigate('/login');
            }       
        })
    }
    reset = () => {
        this.setState({
            resetVisibility: true
        });
    }

    submit = (data) => {
        resetSelfPwd(data).then(res => {
            if (res && res.code === 0) {
                Message.success('修改密码成功', 4);
                this.setState({resetVisibility: false})
            } else if (res && res.code) {
                Message.success(res.msg || '修改密码失败', 4);
            } else {
                Message.success('修改密码失败', 4);
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
        const { isLogin, userLoading, user, networkError } = this.state;

        const role = user && user.role;
        const isAdmin = role && role.type == 1;

        return <div className="data-home-container">
            <div className="header">
                <div className={'header-left'}>
                    <span className='title'>资料系统</span><span> V1.0</span>
                </div>
                <div className={'header-right'}>
                    {isLogin && <span>{user && user.name || ''} { user && user.role && user.role.type === 1 ? '(管理员)' : ''}</span>}
                    <div className={'head-right-hover'}>
                        <div className={'head-right-btn'} onClick={this.reset}><span>修改密码</span></div>
                        <div onClick={this.logout} className={'head-right-btn'}><span>退出登录</span></div>
                    </div>
                </div>
            </div>
            <div className="content">
                <Loading loading={userLoading} />
                {isLogin && <div>
                    <div className="navigation">
                        <Menu 
                            onClick={this.selectMenu}
                            selectedKeys={this.state.current}
                            mode="horizontal">
                            <Menu.Item key="statistic">数据统计</Menu.Item>
                            <Menu.Item key="baisc">基本信息</Menu.Item>
                            {isAdmin ? <Menu.Item key="account">账号管理</Menu.Item> : null}
                            <Menu.Item key="data">数据项管理</Menu.Item>
                        </Menu>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>}
            </div>
            
            <Modal
                // title="垂直居中的对话框"
                title={'修改密码'}
                wrapClassName="vertical-center-modal"
                visible={isLogin && this.state.resetVisibility}
                footer={null}
                closable={false}
                >
                    <ResetSelfPwd 
                        close={() => this.setState({resetVisibility: false})}
                        submit={this.submit} />
            </Modal>
        </div>
    }
}