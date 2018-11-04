import { PureComponent } from 'react';
import { Form, Input, Button, Select, Checkbox, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

function noop() {
    return false;
}

class Index extends PureComponent {



    userExists(rule, value, callback) {

        if (value == '11111') {
            callback([new Error('该用户名已占用!')]);
        } else {
            callback();
        }
    }

    checkPass(rule, value, callback) {
        callback();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, data, submit } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return false;
            }
            submit(values);
        });
    }

    render () {
        const { saveLoading } = this.props;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                { required: true, min: 5, message: '用户名至少为 5 个字符' },
                { validator: this.userExists },
            ],
        });
 
        const emailProps = getFieldProps('email', {
            validate: [{
              rules: [
                { required: true, message: '请输入邮箱地址' },
              ],
              trigger: 'onBlur',
            }, {
              rules: [
                { type: 'email', message: '请输入正确的邮箱地址' },
              ],
              trigger: ['onBlur', 'onChange'],
            }],
        });

        const passwdProps = getFieldProps('password', {
            rules: [
              { required: true, whitespace: true, message: '请填写密码' },
              { required: true, min: 6, message: '密码至少为 6 个字符' },
              { validator: this.checkPass },
            ],
        });

        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        return <div>
            <Form horizontal 
                onSubmit={this.handleSubmit}
            >
                <FormItem
                    {...formItemLayout}
                    label="用户名"
                    hasFeedback
                    help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                >
                    <Input {...nameProps} placeholder="请输入用户名" />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="邮箱"
                    hasFeedback
                >
                    <Input {...emailProps} type="email" placeholder="请输入邮箱" />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="密码"
                    hasFeedback
                >
                    <Input {...passwdProps} type="password" autoComplete="off"
                        onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                    />
                </FormItem>


                <FormItem style={{ marginTop: 24 }}>
                    <div style={{
                        display: 'inline-block',
                        width: '50%',
                        textAlign: 'right',
                        paddingRight: '10px'
                    }}>
                        <Button onClick={this.props.close} type="default">取消</Button>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        width: '50%',
                        textAlign: 'left',
                        paddingLeft: '10px'
                    }}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit} loading={saveLoading}>{'保存'}</Button>
                    </div>
                </FormItem>
            </Form>
        </div>
    }

}

export default Form.create()(Index)
