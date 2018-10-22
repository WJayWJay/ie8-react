
import { PureComponent } from 'react';
import { Form, Input, Button, Select, Checkbox, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

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
    }

    handleSelectChange = (selected) => {
        // console.log(selected);
        this.setState({type: selected});
    }

    dataOnchange = (val) => {
        console.log(val, 'shiyong')
        this.setState({
            isUsedFor: val.join('.')
        });
    };


    renderProjName () {
        const { getFieldProps, getFieldError } = this.props.form;

        const projectNameProps = getFieldProps('projectName', {
            rules: [
              { required: true, min: 2, message: '用户名至少为 2 个字符' },
              { validator: (rule, value, callback) => { callback(); }},
            ],
        });
        return [
            <FormItem
                id="control-input"
                label="数据项名称"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                hasFeedback
                help={(getFieldError('name') || []).join(',')}
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
                    {...getFieldProps('proAliasName')}
                />
            </FormItem>
        ]
    }
    renderImage () {
        const { selected } = this.state;
        if (selected === 1) {
            return 'images';
        }
        return null;
    }
    renderRadio = () => {
        
        return (
            <FormItem
                label="数据项名称"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                >
                <Input placeholder="请输入..." />
            </FormItem>
        );
    }
    renderSelected () {
        const { selected } = this.state;
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
        let fields = form.getFieldsValue();
        if (!fields['proAliasName']) {
            // Modal.error({
            //     title: '错误提示',
            //     content: '请输入项目英文名'
            // });
            return;
        }
        if (!fields['projectName']) {
            // Modal.error({
            //     title: '错误提示',
            //     content: '请输入项目名'
            // });
            return;
        }
        let { isUsedFor } = this.state;
        const obj = {
            ...fields,
            isUsedFor
        }
        console.log(obj)

        if (submit && typeof submit === 'function') {
            submit(obj);
        }
    }

    closeModal = () => {
        const { close } = this.props;
        console.log(close)
        if (close && typeof close === 'function') {
            close();
        }
    }
    render () {
        const { getFieldProps } = this.props.form;
        const { options } = this.state;
        const { loading } = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const plainOptions = [
            {value: 1, label: '提交资料中显示'},
            {value: 2, label: '基本信息列表中显示'},
            {value: 3, label: '作为基本信息筛选项'},
        ];

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
                        id="select" size="large" defaultValue={1} style={{ width: 200 }} 
                        onChange={this.handleSelectChange}
                        {...getFieldProps('type', {
                            initialValue: 1
                        })}
                    >
                        {options.map(item => <Option value={item.val}>{item.key}</Option>)}
                    </Select>
                </FormItem>
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
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit} loading={loading}>保存</Button>
                    </div>
                </FormItem>
            </Form>
        </div>
    }
}


export default Form.create()(Index)