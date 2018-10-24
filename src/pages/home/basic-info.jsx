
import React from 'react'
import { Button, Table, Modal } from 'antd';

import '@/styles/basic-info.less';
export default class Index extends React.PureComponent {

    state = {
        data: [],
        loading: false,
        total: 0,
        addBasicVisibility: false,
    };

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
                onOk={() => this.onSuccessOk()}
                onCancel={() => this.setBaisicVisibility(false)}
                // footer={null}
            >
                <div>
                    <span>{this.state.alertInfo}</span>
                </div>
            </Modal>
        </div>
    }
}