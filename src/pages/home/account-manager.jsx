
import React from 'react'
import { Table, Button, Modal, Message } from 'antd';
import { getUserList, addNewAccount, activeAccount, resetOtherPwd, setAdmin } from '@/network';

import Account from '@/component/account';
import ResetPwd from '@/component/resetPwd';

import './user.less';


export default class Index extends React.PureComponent {

    state = {
        data: [],
        page: 1,
        total: 0,
        loading: false,

        resetId: 0,

        addAccountVisibility: false,
        saveLoading: false,
        successVisibility: false,
        alertInfo: '',
        resetPwdVisibility: false,
        resetPwdLoading: false,
    };

    getData = (page) => {
        this.setState({loading: true});
        getUserList({page: page}).then(res => {
            console.log(res);
            this.setState({loading: false});
            if (res && res.code === 0) {
                let data = res.data.data;
                data = data.map(item => {
                    item['mix'] = [item.id, item.isActived];
                    item['ref'] = item;
                    return item;
                });
                this.setState({data, total: res.data.total, page: res.data.current_page, pageSize: res.data.per_page});
            } else if(res && res.code === -1) {
                this.props.navigate('/login');
            }
        });
    }
    componentDidMount () {
        const page = this.state.page;
        this.getData(page);
    }

    reset = (id) => {
        console.log(id)
        this.setState({
            resetPwdVisibility: true,
            resetId: id,
        });
    }
    resetPwdService = (data) => {
        const password = data['password'];
        const resetId = this.state.resetId;
        if (!resetId) return ;
        this.setState({resetPwdLoading: true});
        resetOtherPwd({
            id: resetId,
            password
        }).then(res => {
            if (res && res.code === 0) {
                Message.success('设置密码成功！', 3);
                this.setState({
                    resetPwdVisibility: false,
                });
            } else if (res && res.code) {
                Message.error('设置密码失败: ' + res.msg, 3);
            } else {
                Message.error('设置密码失败', 3);
            }
        }).then(res => {
            this.setState({resetPwdLoading: false});
        });
    }

    resetSelfPwd = () => {
        
    }

    columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            render: text => <a href="#">{text}</a>,
        }, 
        {
            title: '邮箱',
            dataIndex: 'email',
        }, 
        {
            title: '状态',
            dataIndex: 'isActived',
            render: text =>  ['', '已激活', '未激活', '已禁用'][text]
        },
        {
            title: '重置密码',
            dataIndex: 'id',
            render: text => <span className={'reset-pwd-btn'} onClick={() => this.reset(text)}>重置密码</span>
        },
        {
            title: '禁用',
            dataIndex: 'isActived',
            render: text => ['', '已激活', '未激活', '已禁用'][text] || ''
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            render: text => text
        },
        {
            title: '类型',
            dataIndex: 'ref',
            render: (text) => this.renderAdmin(text)
        },
        {
            title: '操作',
            dataIndex: 'mix',
            render: text => this.renderForbid(text)
        },
    ];
    renderAdmin = (ref) => {
        let role = ref.role;
        if (role) {
            if (role.type == 1) {
                return <Button onClick={() => this.setToAdmin(ref.id, 2)}>设置为普通用户</Button>
            } else {
                return <Button onClick={() => this.setToAdmin(ref.id, 1)}>设置为管理员</Button>
            }
        }
        else {
            return <Button onClick={() => this.setToAdmin(ref.id, 1)}>设置为管理员</Button>
        }
    }

    setToAdmin = (id, type) => {
        setAdmin({id: id, type: type}).then(res => {
            // console.log(res);
            if (res && res.code === 0) {
                Message.success('设置成功', 3);
                this.refresh();
            } else if(res && res.code) {
                Message.error(res.msg || '参数错误!', 3);
            } else {
                Message.error('内部错误!');                
            }
        });
    }

    renderForbid = (text) => {
        let isActived = text[1];
        let id = text[0];
        if (isActived) {
            if (isActived == 1) {
                return <Button onClick={() => this.activeAccount(id, 3)}>禁用</Button>;
            } else if (isActived == 2) {
                return <Button onClick={() => this.activeAccount(id, 1)}>激活</Button>
            } else if (isActived == 3) {
                return <Button onClick={() => this.activeAccount(id, 1)}>解除禁用</Button>
            }
        }
        return '';
    }

    addAccount = () => {
        this.setAccountVisibitity(true);
    }

    submit = (data) => {
        this.setSaveLoading(true);
        addNewAccount(data).then(res => {
            if (res && res.code === 0) {
                this.setSuccessVisibility(true);
                this.setState({alertInfo: '添加账户成功!'});
                this.setAccountVisibitity(false);
            } else {
                this.setSuccessVisibility(true);
                this.setState({alertInfo: '添加账户失败, 请重试!'});
                // this.setAccountVisibitity(false);
            }
        }).then(res => {
            this.setSaveLoading(false);
        })
    }

    setSaveLoading = (flag) => {
        this.setState({
            saveLoading: flag
        });
    }

    setAccountVisibitity = (flag) => {
        this.setState({
            addAccountVisibility: flag
        });
    }
    setSuccessVisibility = (flag) => {
        this.setState({successVisibility: flag});
    }
    onSuccessOk = () => {
        this.setSuccessVisibility(false);
        this.getData(this.state.page);
    }

    refresh = () => {
        this.getData(this.state.page);
    }

    activeAccount = (id, active) => {
        activeAccount({
            id,
            active
        }).then(res => {
            if (res && res.code === 0) {
                Message.success('设置成功！', 3);
            } else {
                Message.success('设置失败！', 3);
            }

            this.refresh();
        })
    }

    render () {
        const state = this.state;
        const pagination = {
            total: state.total,
            pageSize: 5,
            showSizeChanger: false,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange: (current) => {
                // console.log('Current: ', current);
                this.getData(current);
            },
        }
        return <div className="data-home-container">
            <div className={'account-manager-header'}>
                <Button type={'primary'} onClick={this.addAccount}>+添加新账户</Button>
            </div>
            <div className={'account-table-list'}>
                <Table 
                    columns={this.columns} 
                    dataSource={this.state.data} 
                    loading={this.state.loading}
                    pagination={pagination}
                />
            </div>

            

            <Modal
                title="添加账户"
                wrapClassName="vertical-center-modal"
                visible={this.state.addAccountVisibility}
                onCancel={() => this.setAccountVisibitity(false)}
                footer={null}
            >
                <div>
                    <Account
                        submit={this.submit}
                        saveLoading={this.state.saveLoading}
                        close={() => this.setAccountVisibitity(false)}
                    />
                </div>
            </Modal>

            <Modal
                title="修改密码"
                wrapClassName="vertical-center-modal"
                visible={this.state.resetPwdVisibility}
                onCancel={() => this.setState({resetPwdVisibility: false})}
                footer={null}
            >
                <div>
                    <ResetPwd
                        submit={this.resetPwdService}
                        saveLoading={this.state.resetPwdLoading}
                        close={() => this.setState({resetPwdVisibility: false})}
                    />
                </div>
            </Modal>


            <Modal
                title="账号提示"
                wrapClassName="vertical-center-modal"
                visible={this.state.successVisibility}
                onOk={() => this.onSuccessOk()}
                onCancel={() => this.setSuccessVisibility(false)}
                // footer={null}
            >
                <div>
                    <span>{this.state.alertInfo}</span>
                </div>
            </Modal>
        </div>
    }
}
