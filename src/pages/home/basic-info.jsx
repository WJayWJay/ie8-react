
import React from 'react'
import { Button, Table, Modal, Spin, Icon, Message, Pagination, Select, Form, Input } from 'antd';
import { getCategoryQuery, saveBaseInfoData, 
    getBasicInfo, deleteBasicInfo, 
    exportService, importExcel,
    getCategoryFilter,
    queryAccordingFilter,
} from '@/network';

import UserCard from '@/component/userCard';
import EditUserCard from '@/component/editUserCard';
import ListCard from '@/component/listCard';
import ImportExcelCard from '@/component/uploadCard';
import FilterSearchBar from '@/component/filterSearchBar';

import constant from '@/constant/index';
import { timeFormat , areaFormat} from '@/util/util';

import { throttle, debounce } from 'lodash'


import '@/styles/basic-info.less';

const Option = Select.Option;
const FormItem = Form.Item;


const exportUrl = '';
export default class Index extends React.PureComponent {

    state = {

        listType: 2, //1 card, 2 table 

        data: [],
        dataSource: [],

        columnSource: [],
        loading: false,
        total: 0,
        page: 1,

        addBasicVisibility: false,
        alertVisibility: false,

        loadingContent: null,
        submitForm: [],
        dataLoading: false,
        submitLoading: false,

        infoListLoading: false,

        columns: [],

        selectedRows: [],

        confirmVisibility: false,
        confirmMsg: '请确认',
        deleteLoading: false,

        editBasicVisibility: false,
        rowInfo: {},
        exportExcelLoading: false,

        alertInfomation: '',

        openImportExcel: false,
        importExcelLoading: false,

        filterData: [],

        useSearch: false,
        searchData: {},
    };

    setSubmitForm = (data) => {
        this.setState({
            submitForm: Array.isArray(data) ? data : []
        });
    }
    setDataLoading = (flag) => {
        this.setState({dataLoading: flag});
    }

    // {
    //     title: '用户名',
    //     dataIndex: 'name',
    //     render: text => <a href="#">{text}</a>,
    // }, 
    setColumn = (data) => {
        let columns = [];
        if (Array.isArray(data) && data.length) {
            columns = data.map(item => {
                return {
                    className: 'my-basic-table-column',
                    title: item.projectName,
                    dataIndex: item.proAliasName,
                    render: (text) => {
                        switch (item.type) {
                            case 1: 
                                return text && text.value || '';
                            case 2: 
                                return text && text.value || '';
                            case 3: 
                                let date = text && text.value || 0;
                                date = +date;
                                return timeFormat(date) || '';
                            case 4: 
                                let area = text && text.value;
                                return areaFormat(area) || '';
                            case 5: 
                                return <div><img style={{maxWidth: '200px', maxHeight: '200px'}} src={constant.cdn + text.url} /></div>
                        }
                        return text && text.value;
                    }
                }
            });
        } else {
            columns = [];
        }
        if (columns.length) {
            columns.unshift({
                title: '序号',
                dataIndex: 'id',
                render: (text) => {
                    return text || '';
                }
            });
        }
        this.setState({columns});
    }
    querySubmit = () => {
        this.setDataLoading(true);
        getCategoryQuery({submit: 1}).then(res => {
            console.log(res, 'sumbit');
            if (res && res.code === 0) {
                this.setSubmitForm(res.data);
                this.setColumn(res.data);
                this.setState({
                    columnSource: res.data
                })
            }
            return res;
        }).then(res => {
            this.setDataLoading(false);

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

    setBasicListData = (data) => {
        let dataList = [];
        if (Array.isArray(data) && data.length) {
            data.map((item) => {
                let cats = item.cats;
                if (Array.isArray(cats)) {
                    let rows = {
                        id: item.id,
                    };
                    cats.forEach(i => {
                        rows[i.property] = i;
                    });
                    dataList.push(rows);
                }
                return item;
            })
        }
        this.setState({
            data: dataList
        })
        console.log(dataList, 'dddatalist');
    }

    exportExcel = () => {
        // this.setState({exportExcelLoading: true});
        Message.info('信息导出中...', 4);
        // exportService().then(res => {
            
        // })
        // .then(res => {
        //     this.setState({exportExcelLoading: false});
        // });
        const {searchData} = this.state;
        console.log(searchData);
        let i;
        let data ='';
        let url = '';
        for (i in searchData) {
            let values = searchData[i];
            url = `property=${i}&type=${values['type']}&value=${values['value']}`
            if (values['value'] == 0) url = ''; 
        }
        console.log(url, 'url')
        if(this.state.listType === 2) {
            window.open(constant.exportExcelUrl+`?${url}`, '_blank');
        } else {
            window.open(constant.exportWordUrl+ `?${url}`, '_blank');
        }

    }

    submitImportExcel = (data) => {
        importExcel(data).then(res => {
            console.log(res);
        });
    }
    setImportExcel = (flag) => {
        this.setState({importExcelVisible: flag});
    }

    setInfoListLoading = (flag) => {
        this.setState({infoListLoading: flag})
    }

    getBasicInfoList = (page = 1) => {
        this.setInfoListLoading(true);
        getBasicInfo({page}).then(res => {
            console.log(res);
            if (res && res.code === 0) {
                const data = res.data.data;
                this.setBasicListData(data);
                this.setState({dataSource: data, total: res.data.total, page: res.data.current_page, pageSize: res.data.per_page})
            }
        }).then(res => {
            this.setInfoListLoading(false);
        });
    }

    // myThrottle;

    componentDidMount () {
        this.querySubmit();
        this.getBasicInfoList();
        this.getFilterData();
        // this.myThrottle = (fn) => debounce(fn, 1000);
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

    setSubmitLoading = (flag) => {
        this.setState({
            submitLoading: flag
        });
    }

    submit = (data, type) => {
        console.log(data, 'submitDat********')
        this.setSubmitLoading(true);
        saveBaseInfoData(data).then(res => {
            console.log(res, 'saveBaseInfoData');
            if (res && res.code === 0) {
                this.setBaisicVisibility(false);
                this.setEditBaisicVisibility(false);
                this.setAlertVisibility(true);

                this.setState({
                    alertInfomation: type === 'update' ? 1 : 2
                });
                this.getBasicInfoList(this.state.page || 1);
            } else if (res && res.code) {
                Message.error(res.msg || '设置失败', 4);
            } else {
                Message.error('网络失败， 请稍后再试!', 4);
            }
        }).then(res => {
            this.setSubmitLoading(false);
        });
    }

    deleteRows = () => {
        const { selectedRows } = this.state;
        if (selectedRows.length) {
            this.setConfirmVisibility(true);
            this.setState({confirmMsg: '删除后数据将不可恢复，确定要删除吗？'})
        } else {

        }
    }

    getFilterData = () => {
        getCategoryFilter().then(res => {
            console.log(res, 'ffffliter')

            if (res && res.code === 0) {
                this.setState({
                    filterData: res.data.filters,
                });
            }
        });
    }

    setConfirmVisibility = (flag) => {
        this.setState({confirmVisibility: flag});
    }
    confirmOk = () => {
        const { selectedRows } = this.state;
        this.setState({deleteLoading: true})
        deleteBasicInfo({ids: selectedRows}).then(res => {
            this.setState({deleteLoading: false})
            this.refreshList();
        });
        this.setConfirmVisibility(false);
    }

    setAlertVisibility = (flag) => {
        this.setState({
            alertVisibility: flag
        });
    }

    refreshList = () => {
        const { page , useSearch} = this.state;
        if (useSearch) {
            return this.getBasicFilterPage(page);
        }
        this.getBasicInfoList(page);
    }

    setEditBaisicVisibility = (flag) => {
        this.setState({editBasicVisibility: flag});
    }

    rowClick = (record, index) => {
        console.log(record, index)
        this.setEditBaisicVisibility(true);
        this.setState({rowInfo: record});
    }
    renderTable = () => {
        const { columns, infoListLoading, total } = this.state;
        const pagination = {
            total: total,
            pageSize: 10,
            showSizeChanger: false,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange: (current) => {
                // console.log('Current: ', current);
                if (this.state.useSearch) {
                    return this.getBasicFilterPage(current);
                }
                this.getBasicInfoList(current);
            },
        }

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              if (Array.isArray(selectedRows)) {
                  let seletedId = selectedRows.map(i => i.id);
                  this.setState({selectedRows: seletedId});
              } else {
                this.setState({selectedRows: []});
              }
            },
            onSelect(record, selected, selectedRows) {
            //   console.log(record, selected, selectedRows);
            },
            onSelectAll(selected, selectedRows, changeRows) {
            //   console.log(selected, selectedRows, changeRows);
            },
        };
        return (
            columns.length ? <div className={'my-basic-table-container'}><Table 
                columns={columns} 
                dataSource={this.state.data}
                loading={infoListLoading}
                pagination={pagination}
                onRowClick={this.rowClick}
                rowSelection={rowSelection}
                rowClassName={() => 'basic-table-row'}

            /> </div>: null
        );
    }

    renderCardList = () => {
        const { columns, data, columnSource, infoListLoading, total } = this.state;
        const pagination = {
            total: this.state.total,
            pageSize: 16,
            current: this.state.page,
            showSizeChanger: false,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange: (current) => {
                if (this.state.useSearch) {
                    return this.getBasicFilterPage(current);
                }
                this.getBasicInfoList(current);
            },
        };
        if (columns.length) {
            return (
                <div>
                    <ListCard 
                        columns={columnSource}
                        dataSource={data}
                    />
                    <div style={{padding: '10px'}}>
                        {columns.length ? <Pagination className={'my-table-float'} {...pagination} /> : null}
                        <div style={{clear: "both"}}></div>
                    </div>
                </div>
            )
        }

        return <div style={{textAlign: 'center'}}><span>暂无信息</span></div>;
    }

    renderList = () => {
        const { listType } = this.state;

        return listType === 1 ? this.renderCardList() : this.renderTable();
    }

    checkListType = (type) => {
        this.setState({listType: type});
    }

    getBasicData = (data, param = {page: 1}) => {
        console.log('ready tototo')
        this.setState({useSearch: true, searchData: data});
        queryAccordingFilter(data, param).then(res => {
            console.log(res, 'queryAccordingFilter')

            if (res && res.code === 0) {
                const data = res.data.data;
                this.setBasicListData(data);
                this.setState({dataSource: data, total: res.data.total, page: res.data.current_page, pageSize: res.data.per_page})
            }
        })
    }

    getBasicFilterPage = (page) => {
        const { searchData } = this.state;
        this.getBasicData(searchData, {page});
    }

    renderFilter = () => {
        const { filterData } = this.state;
        if (!filterData.length) return null;
        return <FilterSearchBar submit={this.getBasicData} data={filterData} />
    }

    render () {
        const { listType, exportExcelLoading } = this.state;

        return <div className="basic-home-container">
            <div className={'basic-header'}>
                <div className={'basic-header-btn'}>
                    <Button onClick={this.refreshList}>刷新</Button>
                    <Button type="primary" onClick={this.addInfo}>+新增</Button>
                    <Button loading={this.state.deleteLoading} onClick={this.deleteRows} style={{backgroundColor: '#ff1018', color: '#fff'}}>删除</Button>
                    <Button loading={exportExcelLoading} onClick={this.exportExcel} style={{backgroundColor: '#00c389', color: '#fff'}}>导出</Button>
                    
                    <Button onClick={() => this.setImportExcel(true)} style={{backgroundColor: '#00c389', color: '#fff'}}>导入</Button>
                </div>
                
            </div>
            <div className={'basic-page-filter'}>
                {this.renderFilter()}
            </div>

            <div className={'basic-content'}>
                <div className={'basic-content-header'}>
                    <div style={{display: 'inline-block', backgroundColor: '#efefef', padding: '5px 15px'}}>
                        <span onClick={() => this.checkListType(2)} style={{marginRight: '20px', cursor: 'pointer'}}><Icon style={{fontSize: '24px', color: listType === 2 ? '#00bafb' : ''}} type="bars" /></span>
                        <span onClick={() => this.checkListType(1)} style={{ cursor: 'pointer'}}><Icon style={{fontSize: '24px', color: listType === 1 ? '#00bafb' : ''}} type="appstore-o" /></span>
                    </div>
                </div>
                <div className={'basic-content-list'}>
                    <div className={'basic-content-list-wrap'}>
                        {this.renderList()}
                        <div>
                            {/* <Loading loading={this.state.infoListLoading} /> */}
                        </div>
                    </div>
                </div>
            </div>


            <Modal
                title="新增用户信息"
                wrapClassName="vertical-center-modal"
                visible={this.state.addBasicVisibility}
                onCancel={() => this.setBaisicVisibility(false)}
                footer={null}
            >
                <div>
                    <UserCard data={this.state.submitForm}
                        submit={this.submit}
                        dataLoading={this.state.dataLoading}
                        loading={this.state.submitLoading}
                        close={() => this.setBaisicVisibility(false)}
                    />
                </div>
            </Modal>

            {/* 编辑 */}
            <Modal
                title="编辑用户信息"
                wrapClassName="vertical-center-modal"
                visible={this.state.editBasicVisibility}
                onCancel={() => this.setEditBaisicVisibility(false)}
                footer={null}
            >
                <div>
                    <EditUserCard data={this.state.submitForm}
                        submit={this.submit}
                        rowInfo={this.state.rowInfo}
                        dataLoading={this.state.dataLoading}
                        loading={this.state.submitLoading}
                        close={() => this.setEditBaisicVisibility(false)}
                    />
                </div>
            </Modal>

            <Modal
                title="引入资料"
                wrapClassName="vertical-center-modal"
                visible={this.state.importExcelVisible}
                onCancel={() => this.setImportExcel(false)}
                footer={null}
            >
                <ImportExcelCard submit={this.submitImportExcel} />
            </Modal>

            <Modal
                title={this.state.alertInfomation === 1 ? '数据更新提示' : '数据新增提示'}
                wrapClassName="vertical-center-modal"
                visible={this.state.alertVisibility}
                // closable={false}
                onCancel={() => this.setAlertVisibility(false)}
                footer={<Button onClick={() => {
                    this.setAlertVisibility(false);
                }}>确定</Button>}
            >
                    <div style={{textAlign: 'center'}}>
                        <div>
                            {
                                this.state.alertInfomation === 1 ?  '数据更新成功' : '数据新增成功'
                            }
                        </div>
                    </div>
            </Modal>

            <Modal
                title={'请确认'}
                wrapClassName="vertical-center-modal"
                visible={this.state.confirmVisibility}
                onCancel={() => this.setConfirmVisibility(false)}
                onOk={() => this.confirmOk()}
            >
                {this.state.confirmMsg || ''}
            </Modal> 
        </div>
    }
}