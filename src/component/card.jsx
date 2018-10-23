
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
        radioLength: 1,
        checkboxs: [],
    }

    handleSelectChange = (selected) => {
        // console.log(selected);
        this.setState({type: selected});
    }

    dataOnchange = (val) => {
        console.log(val, 'shiyong')
        this.setState({
            isUsedFor: val.join('.'),
            checkboxs: val
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
        keys = keys.filter((key) => {
            return key !== k;
        });
        // can use data-binding to set
        form.setFieldsValue({
            keys,
        });
    }

    add = () => {
        uuid++;
        const { form } = this.props;
        // can use data-binding to get
        let keys = form.getFieldValue('keys');
        keys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys,
        });
    }
     
    
    renderRadio = () => {
        const { getFieldProps, getFieldValue } = this.props.form;
        return null;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        
        getFieldProps('keys', {
            initialValue: [0],
        });
        let formItems = getFieldValue('keys').map((k) => {
            return (
                <Form.Item {...formItemLayout} label={`选项：`} key={k}>
                <Input {...getFieldProps(`name${k}`, {
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: '请输入选项值',
                    }],
                })} style={{ width: '80%', marginRight: 8 }}
                />
                <Button onClick={() => this.removeRadio(k)}>删除</Button>
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

            console.log('Submit!!!');
            console.log(values);
            let options = [];
            if (type === 2) {
                const keys = form.getFieldValue('keys');
                if (keys.length) {
                    options = keys.map(key => {
                        return values['name' +key];
                    })
                }
            }

            let isUsedFor = this.state.isUsedFor;
            if (!isUsedFor) {
                isUsedFor = this.props.data.isUsedFor || '';
            }
            const obj = {
                ...fields,
                isUsedFor,
                options
            }
            console.log(obj, 'obj')
            // return;

            if (submit && typeof submit === 'function') {
                submit(obj);
            }
        })

        return;

        
    }

    closeModal = () => {
        const { close } = this.props;
        console.log(close)
        if (close && typeof close === 'function') {
            close();
        }
    }

    render () {
        const { getFieldProps, getFieldValue } = this.props.form;
        const { options } = this.state;
        const { loading, data, mode } = this.props;
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
        const type = getFieldValue('type');
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
                            initialValue: 1
                        })}
                    >
                        {options.map(item => <Option value={item.val}>{item.key}</Option>)}
                    </Select>
                </FormItem>
                {type === 2 && <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
                    <Button onClick={this.add} style={{ marginRight: 8 }}>新增选项</Button>
                </Form.Item>}
 
                {this.renderSelected()}
                <FormItem
                    label="选择适用范围"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    >
                        <CheckboxGroup options={plainOptions}  onChange={this.dataOnchange} />
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