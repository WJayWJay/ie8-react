import React from 'react'
import { Link } from 'router'
import { Form, Input, Select, Cascader, Radio, Icon, Upload, Button, DatePicker } from 'antd';
import { getUserInfo } from '@/network'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;



import '@/styles/user-card.less';
class UserCard extends React.PureComponent {

    state = {

    };

    renderRadio = (item) => {
        const { getFieldProps } = this.props.form;
        const fieldProp = getFieldProps(item.proAliasName, {
            initialValue: '',
            rules: [

            ]
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
        const { getFieldProps } = this.props.form;
        return (
            <DatePicker {...getFieldProps(item.proAliasName)} />
        );
    }
    normFile(e) {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    }
    renderImagePicker = (item) => {
        const { getFieldProps } = this.props.form;
        return (
            <Upload name="logo" action="/upload.do" listType="picture" onChange={this.handleUpload}
                {...getFieldProps(item.proAliasName, {
                    valuePropName: 'fileList',
                    normalize: this.normFile,
                })}
            >
                <Button type="ghost">
                    <Icon type="upload" /> 点击上传
                </Button>
            </Upload>
        );
    }
    renderArea = (item) => {
        const { getFieldProps } = this.props.form;
        const areaData = [{
            value: 'shanghai',
            label: '上海',
            children: [{
              value: 'shanghaishi',
              label: '上海市',
              children: [{
                value: 'pudongxinqu',
                label: '浦东新区',
              }],
            }],
          }];
          
          
        return (
            <Cascader style={{ width: 200 }} options={areaData} {...getFieldProps(item.proAliasName)} />
        );
    }

    renderFormType = (item) => {
        const { getFieldProps } = this.props.form;
        const { form } = this.props;
        switch(item.type) {
            case 1: 
                return (
                    <Input {...getFieldProps(item.proAliasName, {
                        initialValue: '',
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: '请输入该项',
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
                        initialValue: '',
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: '请输入该项',
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
        const { form } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return false;
            }
            console.log(values);
            // 

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
        const { data , form, loading} = this.props;
        console.log(data, 'dddd')
        if (!Array.isArray(data)) return null;
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