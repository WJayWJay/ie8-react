import React from 'react'
import { Link } from 'router'
import { 
    Form, 
    Input, 
    Select, 
    Cascader, 
    Radio, 
    Icon, 
    Upload, 
    Button, 
    DatePicker, 
    Spin, 
    Modal,
    Message
} from 'antd';

import constant from '@/constant/index'
import areaData from '@/constant/data'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

import '@/styles/user-card.less';
class UserCard extends React.PureComponent {

    state = {
        fileList: [],
        areaData: [],

        rowInfo: {}
    };

    computeRatio = (alias) => {
        const { rowInfo } = this.state;
        let data = rowInfo[alias];
        if (data) {
            let val = data['value'];
            return val || '';
        } else {
            return '';
        }
    }
    renderRadio = (item) => {
        const { getFieldProps } = this.props.form;
        const fieldProp = getFieldProps(item.proAliasName, {
            initialValue: this.computeRatio(item.proAliasName) || '',
            rules: [{
                required: true,
                message: `请选择${item.projectName || item.projectName || ''}`
            }]
        });
        let options = item.options;
        if (!options) return null;
        try {
            options = JSON.parse(options);
        } catch(e) {}
        if (!Array.isArray(options)) {
            return null;
        }
        return (
            <RadioGroup {...fieldProp}>
                {options.map(i => <Radio value={i}>{i}</Radio>)}
            </RadioGroup>
        );
    }

    renderDatePicker = (item) => {
        console.log(item, 'renderDatePicker')
        const { rowInfo } = this.state;
        const { getFieldProps } = this.props.form;
        let alias = item.proAliasName;
        let info = rowInfo[alias];
        let initial = info ? info.value : '';
        initial = +initial;
        initial = isNaN(initial) ? '' : initial;
        if (alias && initial) {
            initial = new Date(initial);
        }
        console.log(initial, rowInfo[alias],'iiiiiiiinitial')

        return (
            <DatePicker {...getFieldProps(item.proAliasName, {
                initialValue: initial,
                rules: [{
                    required: true,
                //     whitespace: false,
                    message: `请输入${item.projectName || ''}`,
                }]
            })} />
        );
    }
    handleImageChange = (info, name) => {
        const { form } = this.props;
        console.log(info)
        let fileList = info.fileList;
        // 1. 上传列表数量的限制
        //    只显示最近上传的一个，旧的会被新的顶掉
        fileList = fileList.slice(-1);
        console.log(fileList)

        // 2. 读取远程路径并显示链接
        fileList = fileList.map((file) => {
            if (file.response && file.response.code === 0) {
            // 组件会将 file.url 作为链接进行展示
                file.url = constant.cdn + file.response.data.url;
                file.uuid = file.response.data.uuid;
            }
            return file;
        });
  
        // 3. 按照服务器返回信息筛选成功上传的文件
        fileList = fileList.filter((file) => {
            if (!file) return false;
            if (file && file.response) {
                return file.response.code === 0;
            }
            return true;
        });

        console.log(fileList, 'ffi*********lei')
        if (fileList.length && fileList[0].uuid) {
            form.setFieldsValue({
                [name]: fileList[0].uuid
            })
        } else {
            form.setFieldsValue({
                [name]: ''
            })
        }
        this.setState({ fileList });
    }

    computeImageInfo(rowInfo) {

    }

    componentWillReceiveProps(newProps, oldProps) {
        const { form } = this.props;
        const newRowInfo = newProps.rowInfo;
        const oldRowInfo = this.state.rowInfo;
        console.log('newRowInfo', newRowInfo, oldProps)
        if ((newRowInfo.id !== oldRowInfo.id)) {
                console.log(newRowInfo, 'not the same ------------------');
                let info = this.computeImageInfo(newRowInfo);
                this.setState({rowInfo: newRowInfo});
                form.resetFields();
        }
    }
    componentDidMount() {
        const newRowInfo = this.props.rowInfo;
        const oldRowInfo = this.state.rowInfo;
        console.log('newRowInfo', newRowInfo)
        if ( 
            (!newRowInfo && oldRowInfo)
            || (newRowInfo && !oldRowInfo)
            || (newRowInfo.id !== oldRowInfo.id)) {
                console.log(newRowInfo, 'state not the same ------------------');
                this.setState({rowInfo: newRowInfo});
                // form.resetFields();
        }
    }

    computeTypeImage = (alias) => {
        const { rowInfo } = this.state;
        let data = rowInfo[alias];
        if (data) {
            let url = data['url'];
            let val = data['value'];
            return {url, val};
        } else {
            return {};
        }
    }
    renderImagePicker = (item) => {
        const { getFieldProps } = this.props.form;
        const { fileList } = this.state;
        const imageInfo = this.computeTypeImage(item.proAliasName);
        const cdn = constant.cdn;
        console.log(imageInfo.url, 'imageInfo.url')
        let defaultList = imageInfo.url ? {
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: cdn + imageInfo.url,
            thumbUrl: cdn + imageInfo.url,
        } : {};
        console.log(fileList, 'fileList')
        getFieldProps(item.proAliasName, {
            initialValue: imageInfo.val || '',
        });
        const props = {
            action: '/private/avatar/upload',
            name: 'avatar',
            listType: 'picture-card',
            // defaultFileList: [defaultList],
            accept: 'image/*',
            multiple: false,
            onPreview: (file) => {
              this.setState({
                priviewImage: file.url,
                priviewVisible: true,
              });
            },
            
        };
        // {...getFieldProps(item.proAliasName, {
        //     valuePropName: 'fileList',
        //     normalize: this.normFile,
        // })}
        return (<div>
            <Upload {...props}
                onChange={(info) => this.handleImageChange(info, item.proAliasName)}
                fileList={fileList}
            >
                <Icon type="plus" />
                <div className="ant-upload-text">上传照片</div>
            </Upload>
            <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handlePreviewCancel}>
                <img width={'100%'} alt="example" src={this.state.priviewImage} />
            </Modal>
        </div>);
    }
    handlePreviewCancel = () => {
        this.setState({
            priviewVisible: false,
        });
    }
    
    filledData = (data) => {
        let areas = [];
        for (let i in data) {
            if (typeof areaData[i] === 'object') {
                const children = this.filledData(areaData[i]);
                areas.push({
                    value: i,
                    label: data[i],
                    children
                });
            } else {
                areas.push({
                    value: i,
                    label: data[i],
                });
            }
        }
        return areas;
    }

    compouteAreaData = () => {
        if (this.state.areaData.length) return;
        const china = areaData['86'];
        const sortedData = this.filledData(china);
        this.setState({
            areaData: sortedData,
        })
    }
    computeArea = (alias) => {
        const { rowInfo } = this.state;
        let data = rowInfo[alias];
        if (data) {
            let val = data['value'];
            if (val) {
                val = val.split('-');
            }
            
            return Array.isArray(val) ? val : [];
        } else {
            return [];
        }
    }
    renderArea = (item) => {
        this.compouteAreaData();
        const { getFieldProps } = this.props.form;
        let area = this.computeArea(item.proAliasName);
        console.log(area, '**********************')
        return (
            <Cascader defaultValue={area} style={{ width: 200 }} options={this.state.areaData} {...getFieldProps(item.proAliasName, {
                initialValue: area,
                rules: [{
                    required: true,
                    message: `请选择${item.projectName || item.proAliasName || ''}`,
                }]
            })} />
        );
    }

    computeType1 = (rowInfo, alias) => {
        let data = rowInfo[alias];
        if (data) {
            let val = data['value'];
            return val || '';
        } else {
            return '';
        }
    }

    renderFormType = (item) => {
        const { getFieldProps } = this.props.form;
        const { rowInfo } = this.state;
        switch(item.type) {
            case 1: 
                return (
                    <Input {...getFieldProps(item.proAliasName, {
                        initialValue: this.computeType1(rowInfo, item.proAliasName),
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: `请输入${item.projectName || item.proAliasName || ''}`,
                        }],
                    })}  />
                );
            case 2: 
                return this.renderRadio(item);
            case 3: 
                return this.renderDatePicker(item);
            case 4: 
                return this.renderArea(item);
            case 5: 
                return this.renderImagePicker(item);
            default:
                return (
                    <Input {...getFieldProps(item.proAliasName, {
                        initialValue: this.computeType1(rowInfo, item.proAliasName),
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: `请输入${item.projectName || item.proAliasName || ''}`,
                        }],
                    })}  />
                );
        }
    }
    closeModal = () => {
        if (typeof this.props.close) {
            this.props.close();
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { form, data, submit } = this.props;
        const {rowInfo} = this.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return false;
            }
            console.log(values, data, 'dddd');
            // 
            let submitData = [];
            let imageError = [];
            if (Array.isArray(data) && data.length) {
                submitData = data.map(item =>{
                    let value = values[item.proAliasName];
                    switch(item.type) {
                        case 1: 
                            return {
                                property: item.proAliasName,
                                type: item.type,
                                value: value,
                                categoryId: item.id
                            };
                        case 2:
                            return {
                                property: item.proAliasName,
                                type: item.type,
                                value: value,
                                categoryId: item.id
                            };
                        case 3: 
                            let time = value && value.getTime() || 0;
                            return {
                                property: item.proAliasName,
                                type: item.type,
                                value: time + '',
                                categoryId: item.id
                            };
                        case 4:
                            return {
                                property: item.proAliasName,
                                type: item.type,
                                value: value,
                                categoryId: item.id
                            };
                        case 5: 
                            if(!value)  {
                                imageError.push({error: item.proAliasName, message: '请选择图片'})
                            }
                            return {
                                property: item.proAliasName,
                                type: item.type,
                                value: value,
                                categoryId: item.id
                            };
                        default: 
                            return '';
                    }
                });
            } else {
                return;
            }
            if (imageError.length) {
                console.log('请选择图片')
                Message.error('请选择图片', 3);
                return;
            }
            submitData.unshift({id: rowInfo.id});
            console.log(submitData, 'submitData')
            if (typeof submit === 'function') {
                submit(submitData, 'update');
            }
        });

    }
    renderFormItem = (item) => {
        return (
            <FormItem
                id="control-input"
                label={item.projectName}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
            >
                {this.renderFormType(item)}
            </FormItem>
        );
    }
    renderForm = () => {
        const { data , form, loading, dataLoading} = this.props;
        console.log(data, 'dddd')
        if (!Array.isArray(data)) return null;
        if (dataLoading) {
            return <div style={{textAlign: 'center'}}><Spin type={'large'} /><span>信息加载中...</span></div>
        }
        return (
            <Form horizontal>
                {data.map(item => this.renderFormItem(item))}
                <FormItem style={{ marginTop: 24 }}>
                    <div style={{
                        display: 'inline-block',
                        width: '50%',
                        textAlign: 'right',
                        paddingRight: '10px'
                    }}>
                        <Button onClick={this.closeModal} type="default">取消</Button>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        width: '50%',
                        textAlign: 'left',
                        paddingLeft: '10px'
                    }}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit} loading={loading}>{'保存'}</Button>
                    </div>
                </FormItem>
            </Form>
        );
    }
    render () {
        return (
            <div>
                {this.renderForm()}
            </div>
        );
    }
}

export default Form.create()(UserCard)