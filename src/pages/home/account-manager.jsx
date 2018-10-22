
import React from 'react'
import { Table, Button } from 'antd';
import { getUserList } from '@/network';

import './user.less';


export default class Index extends React.PureComponent {

    state = {
        data: [],
        page: 1,
        total: 0,
        loading: false,
    };

    getData = (page) => {
        this.setState({loading: true});
        getUserList({page: page}).then(res => {
            console.log(res);
            this.setState({loading: false});
            if (res && res.code === 0) {
                const data = res.data.data;
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
        return <div className="data-home-container">
            
            <div className={'account-table-list'}>
                <Table 
                    columns={this.columns} 
                    dataSource={this.state.data} 
                    loading={this.state.loading}
                    pagination={pagination}
                />
            </div>
        </div>
    }
}
