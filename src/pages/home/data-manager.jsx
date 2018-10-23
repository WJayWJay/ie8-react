
import React from 'react'
import { Button, Modal,Table, Spin } from 'antd';

import { chunk } from 'lodash';
import { postCategory, getCategoryList } from '@/network';
import CardInfo from '@/component/card';
import '@/styles/data-manager.less';
export default class Index extends React.PureComponent {

    state = {
        cardVisibility: false,
        successVisibility: false,
        loading: false,
        alertInfo: '新增数据项成功!',

        data: [],
        page: 1,
        total: 0,
        loading: false,
        dataLoading: false,

        cardInfo: {},
        mode: 'add',
    };

    setCardVisibility = (flag) => {
        this.setState({cardVisibility: flag});
    }
    setSuccessVisibility = (flag) => {
        this.setState({successVisibility: flag});
    }

    showCard = () => {
        this.setState({
            cardInfo: {}
        });
        this.setCardVisibility(true);
        this.setMode('add');
    }

    setLoading = (flag) => {
        this.setState({loading: flag});
    }
    setAlertInfo = ( text ) => {
        this.setState({alertInfo: text});
    }
    submit = (data) => {
        this.setLoading(true);
        
        postCategory(data).then(res => {
            console.log(res);
            this.setLoading(false);
            if (res && res.code === 0) {
                this.setCardVisibility(false);
                this.setSuccessVisibility(true);
                this.setAlertInfo('新增数据项成功!');
            } else {
                this.setSuccessVisibility(true);
                this.setAlertInfo('新增数据项失败!');
            }
        });
    }

    getData = (page = 1) => {
        this.setState({dataLoading: true});
        getCategoryList({page: page}).then(res => {
            console.log(res);
            this.setState({dataLoading: false});
            if (res && res.code === 0) {
                const data = res.data.data;
                this.setState({data, total: res.data.total, page: res.data.current_page, pageSize: res.data.per_page});
            } else if(res && res.code === -1) {
                this.props.navigate('/login');
            }
        });
    }

    onSuccessOk = () => {
        console.log('aa')
        this.setSuccessVisibility(false);
        this.getData(1);
    }

    componentDidMount() {
        this.getData(1);
    }

    editCard = (item) => {
        this.setState({
            cardInfo: item
        });
        this.setCardVisibility(true);
        this.setMode('edit');
    }
    setMode = (type) => {
        this.setState({
            mode: type,
        });
    }

    renderCard = (item) => {
        let used = item.isUsedFor;
        let infoRect = null;
        const selected = [
            '',
            <div className={'rect green'}></div>,
            <div className={'rect blue'}></div>,
            <div className={'rect yellow'}></div>,
        ];
        if (used) {
            used = used.split('.');
            infoRect = used.map(i => {
                return selected[i];
            });
        }
        return (
        <div 
            className={'card-container'}
        >
            <div
                className={'row-card'}
            >
                <div className={'row-one'}>
                    <span>{item.projectName}</span>
                </div>
                <div className={'row-one row-one-right'}>
                    <span style={{cursor: 'pointer'}} onClick={() => this.editCard(item)}>{'编辑'}</span>
                </div>
            <div 
                className={'row-card'}
            >
                <div className={'row-one'}>
                    <span>{['', '填空', '单选', '时间选择', '地区选择', '图片上传'][item.type]}</span>
                </div>
                <div className={'row-one row-one-right'}>
                    {infoRect}
                </div>
            </div>
        </div>
        </div>
        );
    }

    renderData = () => {
        const { data, dataLoading } = this.state;
        let dataSplit = chunk(data, 4);
        if (dataSplit.length) {
            return (
                <div>
                    {dataSplit.map(item => {
                        return item.map(i => {
                            return this.renderCard(i);
                        })
                    })}
                </div>
            );
        } else {
            return <div style={{textAlign: 'center'}}>
                {dataLoading ? <Spin size={'large'} />: <span>暂无数据!</span>}
            </div>
        }
    }

    render () {

        return <div className="data-manager-container">
            <div className={'data-header-container'}>
                <div className={'manager-header'}>
                    <div className={'rect green'}></div><span>提交资料中显示</span>
                </div>
                <div className={'manager-header'}>
                    <div className={'rect blue'}></div><span>提交资料中显示</span>
                </div>
                <div className={'manager-header'}>
                    <div className={'rect yellow'}></div><span>提交资料中显示</span>
                </div>
                <div className={'data-header-right'}>
                    <div><Button onClick={this.showCard}>+新数据项</Button></div>
                </div>
                <div className={'clear'}></div>
            </div>
            <div className={'data-manager-content'}>
                {this.renderData()}
            </div>

            <Modal
                title="新增数据项"
                wrapClassName="vertical-center-modal"
                visible={this.state.cardVisibility}
                onOk={() => this.setCardVisibility(false)}
                onCancel={() => this.setCardVisibility(false)}
                footer={null}
            >
                <div>
                    <CardInfo 
                        mode={this.state.mode}
                        data={this.state.cardInfo}
                        loading={this.state.loading} 
                        submit={this.submit} 
                        close={() => this.setCardVisibility(false)} />
                </div>
            </Modal>
            <Modal
                title="新增数据项提示"
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