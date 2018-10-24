
import { PureComponent } from 'react';
import { Form, Input, Button, Select, Checkbox, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;


let uuid = 1;
class Index extends PureComponent {

    state = {
        type: 1,
        isUsedFor: '',
        options: [
            { val: 1, key: '填空' },
            { val: 2, key: '单选' },
            { val: 3, key: '时间选择' },
            { val: 4, key: '地区选择' },
            { val: 5, key: '图片上传' },
        ],
        radioOptions: [],
        cardInfo: {},
        usedChecked: [],
    }

    handleSelectChange = (selected) => {
        // console.log(selected);
        this.setState({type: selected});
    }

    dataOnchange = (val) => {
        // console.log(val, 'shiyong')
        this.setState({
            isUsedFor: val.join('.'),
            usedChecked: val,
        });
    };

    renderProjName () {
        const { getFieldProps, getFieldError } = this.props.form;
        const { data, mode } = this.props;
        const isUpdate = mode === 'edit';

        const projectNameProps = getFieldProps('projectName', {
            initialValue: isUpdate ? data.projectName : '',
            rules: [
              { required: true, min: 2, message: '用户名至少为 2 个字符' },
            //   { validator: (rule, value, callback) => { callback(); }},
            ],
        });
        return [
            <FormItem
                id="control-input"
                label="数据项名称"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                // help={(getFieldError('name') || []).join(',')}
                >
                <Input 
                    id="control-input"
                    {...projectNameProps}
                    placeholder="请输入..." 
                />
            </FormItem>,
            <FormItem
                id="control-input-map"
                label="数据项别名(英文)"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                >
                <Input
                    id="control-input-map" 
                    placeholder="请输入英文别名(数据项的英文名), 用于存入数据库" 
                    {...getFieldProps('proAliasName', {
                        initialValue: isUpdate ? data.proAliasName : '',
                        rules: [
                            { required: true, min: 2, message: '用户名至少为 2 个字符' },
                        ],
                    })}
                />
            </FormItem>
        ]
    }

    removeRadio = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        let keys = form.getFieldValue('keys');
        keys = keys.filter((key, index) => {
            return index !== k;
        });
        // can use data-binding to set
        // form.setFieldsValue({
        //     keys,
        // });
        this.setState({radioOptions: keys});
    }

    add = () => {
        uuid++;
        const { radioOptions } = this.state;
        // return;
        let options = radioOptions.map(i => i);
        options.push('')
        this.setState({
            radioOptions: options
        });
        // can use data-binding to get
        // let keys = form.getFieldValue('keys');
        // keys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        // form.setFieldsValue({
        //   keys,
        // });
    }
     
    componentWillReceiveProps(newProps, oldProps) {
        // console.log(newProps, oldProps, this.state.cardInfo, '----------------')
        const { form } = this.props;
        if (
            (newProps.data && !oldProps.data) ||  (!newProps.data && oldProps.data) ||
            (newProps.data && newProps.data && newProps.data.id !== oldProps.data.id )
            ) {
                if (newProps.data.id !== this.state.cardInfo.id) {
                    console.log('sssetttt')
                    let radioOptions = [];
                    if (newProps.data.options) {
                        radioOptions = newProps.data.options;
                        try {
                            radioOptions = JSON.parse(radioOptions);
                        } catch (e) {}
                        if (!Array.isArray(radioOptions)) {
                            radioOptions = [];
                        }
                    }
                    let usedChecked = newProps.data.isUsedFor;
                    usedChecked = !usedChecked ? [] : usedChecked.split('.').map(i => (i|0));

                    this.setState({
                        cardInfo: newProps.data,
                        radioOptions,
                        usedChecked
                    });
                }
                
            // if (newProps.data.options) {
            //     let radioOptions = newProps.data.options;
            //     try {
            //         radioOptions = JSON.parse(radioOptions);
            //     } catch (e) {}
            //     if (Array.isArray(radioOptions)) {
            //         this.setState({radioOptions});
            //     }
            // }
            
            // form.setFieldsValue({
            //     type: newProps.data.type || 1
            // });
            
        }
    }
    componentDidMount () {
        const { data } = this.props;
        if (data && data.id !== this.state.cardInfo.id) {
            console.log('sssetttt did')
            let radioOptions = [];
            if (data.options) {
                radioOptions = data.options;
                try {
                    radioOptions = JSON.parse(radioOptions);
                } catch (e) {}
                if (!Array.isArray(radioOptions)) {
                    radioOptions = [];
                }
            }
            let usedChecked = data.isUsedFor;
            usedChecked = !usedChecked ? [] : usedChecked.split('.').map(i => (i|0));

            this.setState({
                cardInfo: data,
                radioOptions,
                usedChecked
            });
        }
    }
    renderRadio = () => {
        const { getFieldProps, getFieldValue } = this.props.form;
        let {radioOptions: options} = this.state;
        // return null;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };

        if (!options.length) options = [''];
        console.log('-----------------')
        console.log(options)
        getFieldProps('keys', {
            initialValue: options,
        });
        let formItems = getFieldValue('keys').map((k, index) => {
            return (
                <Form.Item {...formItemLayout} label={`选项：`} key={index}>
                    <Input {...getFieldProps(`name${index}`, {
                            initialValue: k || '',
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: '请输入选项值',
                            }],
                        })} style={{ width: '80%', marginRight: 8 }}
                    />
                    <Button onClick={() => this.removeRadio(index)}>删除</Button>
                </Form.Item>
            );
        });
        return formItems;
    }
    renderSelected () {
        const { getFieldValue } = this.props.form;
        const selected = getFieldValue('type');
        console.log(selected, typeof selected)
        switch (selected) {
            case 2:
                return this.renderRadio();
            default: 
                return null;
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { form, submit } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
              console.log('Errors in form!!!');
              return;
            }
            const type = form.getFieldValue('type');
            let fields = {};
            const filter = ['projectName', 'proAliasName', 'type'];
            filter.forEach(item => {
                fields[item] = values[item];
            })

            // console.log('Submit!!!');
            // console.log(this.state.radioOptions);
            // console.log(values);
            let options = [];
            if (type === 2) {
                const keys = form.getFieldValue('keys');
                if (keys.length) {
                    options = keys.map((key, index) => {
                        return values[`name${index}`];
                    });
                }
            }

            let isUsedFor = this.state.usedChecked.join('.');
            const obj = {
                ...fields,
                isUsedFor,
                options,
                id: this.props.data.id
            }

            if (submit && typeof submit === 'function') {
                submit(obj);
            }
        })

        return;

        
    }

    closeModal = () => {
        const { close } = this.props;
        if (close && typeof close === 'function') {
            close();
        }
    }

    render () {
        const { getFieldProps, getFieldValue } = this.props.form;
        const { options } = this.state;
        const { loading, mode, data } = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const plainOptions = [
            {value: 1, label: '提交资料中显示'},
            {value: 2, label: '基本信息列表中显示'},
            {value: 3, label: '作为基本信息筛选项'},
        ];
        const isUpdate = mode === 'edit';
        return <div>
            <Form horizontal 
                onSubmit={this.handleSubmit}
                >
                {this.renderProjName()}
                <FormItem
                    id="select"
                    label="类型选择"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    >
                    <Select 
                        id="select" size="large" defaultValue={isUpdate ? data.type: 1} style={{ width: 200 }} 
                        onChange={this.handleSelectChange}
                        {...getFieldProps('type', {
                            initialValue: isUpdate ? data.type : 1 
                        })}
                    >
                        {options.map(item => <Option value={item.val}>{item.key}</Option>)}
                    </Select>
                </FormItem>
                {data && data.type === 2 && <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
                    <Button onClick={this.add} style={{ marginRight: 8 }}>新增选项</Button>
                </Form.Item>}
 
                {this.renderSelected()}
                <FormItem
                    label="选择适用范围"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    >
                        <CheckboxGroup value={this.state.usedChecked} options={plainOptions}  onChange={this.dataOnchange} />
                </FormItem>
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
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit} loading={loading}>{isUpdate ? '更新': '保存'}</Button>
                    </div>
                </FormItem>
            </Form>
        </div>
    }
}


export default Form.create()(Index)