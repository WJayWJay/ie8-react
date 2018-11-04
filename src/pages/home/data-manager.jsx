
import React from 'react'
import { Button, Modal,Table, Spin, Pagination, Message, Icon } from 'antd';

import { chunk } from 'lodash';
import { postCategory, getCategoryList, deleteCatogry, moveStep } from '@/network';
import CardInfo from '@/component/card';
import CardInfoEdit from '@/component/editCard';
import '@/styles/data-manager.less';
export default class Index extends React.PureComponent {

    state = {
        cardVisibility: false,
        successVisibility: false,
        deleteAlertVisibility: false,
        loading: false,
        alertInfo: '新增数据项成功!',

        data: [],
        page: 1,
        total: 0,
        loading: false,
        dataLoading: false,

        cardInfo: {},
        mode: 'add',
        
        needResetData: false,
    };

    setCardVisibility = (flag) => {
        if (flag && this.state.needResetData) {
            this.setState({needResetData: false});
        }
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
                // this.setSuccessVisibility(true);
                // this.setAlertInfo(this.state.mode === 'add' ? '新增数据项成功!' : '更新数据项成功!');
                Message.success('新增数据成功', 4);
                this.setState({needResetData: true});
                
                this.getData(this.state.page);
            } else if (res && res.code) {
                // this.setSuccessVisibility(true);
                // this.setAlertInfo('新增数据项失败!');
                Message.error(res.msg || '新增数据失败', 5);
            } else {
                Message.error('新增数据失败', 4);         
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
            } else {
                Message.error('数据加载失败，请刷新!', 4);
            }
        });
    }
    toBefore = (item) => {
        moveStep({
            id: item.id,
            type: 1,
        }).then(res => {
            if (res && res.code === 0) {
                Message.success('移动成功！');
                this.getData(this.state.page);
            } else if (res && res.code) {
                Message.fail( res.msg || '移动失败！');
            }
        })
    }

    toback = (item) => {
        moveStep({
            id: item.id,
            type: -1,
        }).then(res => {
            if (res && res.code === 0) {
                Message.success('移动成功！');
                this.getData(this.state.page);
            } else if (res && res.code) {
                Message.fail( res.msg || '移动失败！');
            }
        })
    }

    onSuccessOk = () => {
        console.log('aa')
        this.setSuccessVisibility(false);
        this.getData(1);
    }

    componentDidMount() {
        this.getData(1);
    }

    computeIsUsedFor = (item) => {
        let isUsedFor = [];
        item.submit === 1 && isUsedFor.push(1);
        item.basic === 1 && isUsedFor.push(2);
        item.filter === 1 && isUsedFor.push(3);
        item.cardList === 1 && isUsedFor.push(4);
        return isUsedFor.join('.');
    }

    editCard = (item) => {

        this.setState({
            cardInfo: {
                ...item,
                isUsedFor: this.computeIsUsedFor(item)
            }
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
        let used = this.computeIsUsedFor(item);
        let infoRect = null;
        const selected = [
            '',
            <div className={'rect green'}></div>,
            <div className={'rect blue'}></div>,
            <div className={'rect yellow'}></div>,
            <div className={'rect red'}></div>,
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
                <div style={{textAlign: 'right'}}>
                    <Icon onClick={() =>this.toBefore(item)} type="left" style={{marginRight: '10px', cursor: 'pointer'}} />
                    <Icon onClick={() =>this.toback(item)} type="right" style={{cursor: 'pointer'}}/>
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

    setDeleteAlertVisibility = (flag) => {
        this.setState({deleteAlertVisibility: flag});
    }
    deleteCat = () => {
        this.setDeleteAlertVisibility(true);
    }

    openModal = (content) => {
        this.setState({alertInfo: content || ''});
        this.setSuccessVisibility(true);
    }

    toDelete = () => {
        const {cardInfo} = this.state;
        deleteCatogry({id: cardInfo.id}).then(res => {
            if (res && res.code === 0) {
                this.openModal('删除成功');
            } else {
                this.openModal('删除失败')
            }
        })
    }

    render () {
        const { data } = this.state;
        const pagination = {
            total: this.state.total,
            pageSize: 16,
            current: this.state.page,
            showSizeChanger: false,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange: (current) => {
                // console.log('Current: ', current);
                this.getData(current);
            },
        };
        return <div className="data-manager-container">
            <div className={'data-header-container'}>
                <div className={'manager-header'}>
                    <div className={'rect green'}></div><span>提交资料中显示</span>
                </div>
                <div className={'manager-header'}>
                    <div className={'rect blue'}></div><span>基本信息列表中显示</span>
                </div>
                <div className={'manager-header'}>
                    <div className={'rect yellow'}></div><span>作为基本信息筛选项</span>
                </div>
                <div className={'manager-header'}>
                    <div className={'rect red'}></div><span>作为基本信息列表-卡片</span>
                </div>
                <div className={'data-header-right'}>
                    <div><Button onClick={this.showCard}>+新数据项</Button></div>
                </div>
                <div className={'clear'}></div>
            </div>
            <div className={'data-manager-content'}>
                {this.renderData()}

                <div>
                    {data.length ? <Pagination {...pagination} /> : null}
                </div>
            </div>

            <Modal
                title="新增数据项"
                maskClosable={false}
                wrapClassName="vertical-center-modal"
                visible={this.state.cardVisibility}
                onOk={() => this.setCardVisibility(false)}
                onCancel={() => this.setCardVisibility(false)}
                footer={null}
            >
                <div>
                    {
                        this.state.mode === 'add' ? <CardInfo 
                            needs={this.state.needResetData}
                            mode={this.state.mode}
                            data={this.state.cardInfo}
                            loading={this.state.loading} 
                            submit={this.submit} 
                            close={() => this.setCardVisibility(false)} />
                        :
                        <CardInfoEdit
                            mode={this.state.mode}
                            data={this.state.cardInfo}
                            loading={this.state.loading} 
                            submit={this.submit} 
                            deleteCat={this.deleteCat}
                            close={() => this.setCardVisibility(false)} />
                    }
                </div>
            </Modal>
            <Modal
                title="数据项提示"
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
            <Modal
                title="删除数据项提示"
                wrapClassName="vertical-center-modal"
                visible={this.state.deleteAlertVisibility}
                onOk={() => this.toDelete()}
                onCancel={() => this.setDeleteAlertVisibility(false)}
                // footer={null}
            >
                <div>
                    <span>删除后无法恢复, 确定删除?</span>
                </div>
            </Modal>
        </div>
    }
}