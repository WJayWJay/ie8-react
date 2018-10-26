
import React from 'react'
import { Button, Table, Modal, Spin } from 'antd';
import { getCategoryQuery } from '@/network';

import UserCard from '@/component/userCard';

import '@/styles/basic-info.less';
export default class Index extends React.PureComponent {

    state = {
        data: [],
        loading: false,
        total: 0,
        addBasicVisibility: false,

        loadingContent: null,
        submitForm: [],
        dataLoading: false,
    };

    setSubmitForm = (data) => {
        this.setState({
            submitForm: Array.isArray(data) ? data : []
        });
    }
    setDataLoading = (flag) => {
        this.setState({dataLoading: flag});
    }
    querySubmit = () => {
        this.setDataLoading(true);
        getCategoryQuery({submit: 1}).then(res => {
            console.log(res, 'sumbit');
            if (res && res.code === 0) {
                this.setSubmitForm(res.data);
            }
            return res;
        }).then(res => {
            this.setDataLoading(true);
            return res;
        });
    }

    renderModal = (loading) => {
        return (
            <Modal
                title={null}
                wrapClassName="vertical-center-modal"
                visible={loading}
                footer={null}
                closable={false}
                width={200}
                >
                    <div style={{textAlign: 'center'}}>
                        <div>加载中....</div>
                        <div><Spin size={'large'} /></div>
                    </div>
            </Modal>
        );
    }

    componentDidMount () {
        this.querySubmit();
    }

    setBaisicVisibility = ( flag ) => {
        this.setState({addBasicVisibility: flag});
    } 

    closeBaisicVisibility = () => {
        this.setBaisicVisibility(false);
    }

    addInfo = () => {
        this.setBaisicVisibility(true)
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
            render: text =>  ['已激活', '未激活', '禁用'][text]
        },
        {
            title: '重置密码',
            dataIndex: 'id',
            render: text => <span className={'reset-pwd-btn'} onClick={() => this.reset(text)}>重置密码</span>
        },
        {
            title: '禁用',
            dataIndex: 'isActived',
            render: text => ['', '已激活', '未激活', '禁用'][text] || ''
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            render: text => text
        },
    ];
    submit = (data) => {

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

        return <div className="basic-home-container">
            <div className={'basic-header'}>
                <div className={'basic-header-btn'}>
                    <Button >刷新</Button>
                    <Button type="primary" onClick={this.addInfo}>新增</Button>
                    <Button >删除</Button>
                    <Button >导出</Button>
                </div>
                
            </div>

            <div className={'basic-content'}>
                <Table 
                    columns={this.columns} 
                    dataSource={this.state.data} 
                    loading={this.state.loading}
                    pagination={pagination}
                />
            </div>


            <Modal
                title="新增用户信息"
                wrapClassName="vertical-center-modal"
                visible={this.state.addBasicVisibility}
                submit={this.submit}
                close={() => this.setBaisicVisibility(false)}
                footer={null}
            >
                <div>
                    <UserCard data={this.state.submitForm} />
                </div>
            </Modal>

            {/* {this.renderModal(this.state.dataLoading)} */}
        </div>
    }
}