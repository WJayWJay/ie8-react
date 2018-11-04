import { PureComponent } from 'react';
import { Form, Input, Button, Select, Upload, Icon, Message } from 'antd';

import constant from '@/constant/index';

import { throttle, debounce } from 'lodash'

const FormItem = Form.Item;
const Option = Select.Option;


class Index extends PureComponent {


    state = {
        searchData: {},
        formData: [],
        formData1: {}
    };

    checkPass(rule, value, callback) {
        callback();
    }

    handleSubmit = (values) => {
        const { submit } = this.props;
        submit(values);
    }

    computeOptions = (data) => {
        if (typeof data != 'string') return data;
        let dataArr = [];
        try {
            dataArr = JSON.parse(data);
        } catch (e) {}
        if (!Array.isArray(dataArr)) return [];
        return dataArr;
    }

    handleEventChange = (e, item) => {
        const { form } = this.props;
        const { searchData, formData1 } = this.state;
        console.log(e, item) 
        const type = item.type;
        const alias = item.proAliasName;
        const value = !e || typeof e === 'string' ? e : e.target.value;

        let current = {
            type: type,
            value: value,
        }

        let preSearch = {...searchData, ...{[alias]: current}};
        let postData = {[alias]: current};
        if (e == 0) {
            delete preSearch[alias];
        }

        this.setState({
            searchData: preSearch,
            formData1: {...formData1, ...{[alias]: value}}
        });
        let values = form.getFieldsValue();
        console.log(preSearch, 'vvvvv', values);

        clearTimeout(this.myThrottle);
        this.myThrottle = setTimeout(() => {
            this.handleSubmit(postData);
        }, 1000);
    }

    myThrottle = 0;

    componentDidMount() {
        console.log('componentDidMount1111')
    }

    componentWillReceiveProps(newProps, oldProps) {
        const newData = newProps.data;
        const oldData = oldProps.data;
        console.log(newData, oldData, ';;;;;;');
        if (
            (newData && !oldData) ||
            (!newData && oldData) ||
            (newData.length != oldData.length)
        ) {
            console.log(newData, 'newData')
            // if (Array.isArray(newData)) {
                this.setState({
                    formData: newData
                });
            // }
        }
    }

    render () {
        const { formData1} = this.state;
        const { data } = this.props;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        console.log(data, 'jjjjjjj')
        return (
            <Form inline>
                {
                    data.map(item => {
                        const alias = item.proAliasName;
                        switch (item.type) {
                            case 1:
                                return (
                                    <FormItem
                                        key={item.id + item.proAliasName}
                                        id="control-input"
                                        label={item.projectName || ''}
                                        // labelCol={{ span: 8 }}
                                        // wrapperCol={{ span: 14 }}
                                    >
                                        <Input
                                            {...getFieldProps(alias, {
                                                // onChange: this.handleEventChange
                                            })}
                                            value={formData1[alias]}
                                            onChange={(e) => this.handleEventChange(e, item)}
                                        />
                                    </FormItem>
                                );
                            case 2:
                                let options = this.computeOptions(item.options);
                                return (
                                    <FormItem
                                        id="control-input"
                                        label={item.projectName || ''}
                                        // labelCol={{ span: 8 }}
                                        // wrapperCol={{ span: 14 }}
                                    >
                                        <Select id="select" size="large" style={{ width: 150 }}
                                            {...getFieldProps(alias, {
                                                // onChange: this.handleEventChange
                                            })
                                            }
                                            value={formData1[alias]}
                                            onChange={(e) => this.handleEventChange(e, item)}
                                        >
                                            <Option value={0}>全部</Option>
                                            {options.map(i => <Option value={i}>{i}</Option>)}
                                        </Select>
                                    </FormItem>
                                );
                            default:
                                return null;
                        }
                                            
                    })
                }
            </Form>
        );
    }

}

let fieldData = {};

export default Form.create({
    onFieldsChange: (props, fields) => {
        // console.log(props, fields, 'dddddd');
        // console.log(fields)
        // let data = {};
        // let i;
        // while (i in fields) {
        //     let mix = fields[i];
        //     data[mix.name] = mix.value;
        // }
        // fieldData = {...fieldData, ...fields};
        // console.log(fieldData, 'ffff')
    }
})(Index)
