import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';

import './login.less';

const FormItem = Form.Item;
class Login extends React.PureComponent {

    render () {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return <div className={'login-container'}>
            <div className="login-box">
                <h3>资料维护系统<span className="version"> v1.0</span></h3>
                <div className="login-form">
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                            >
                            <Input type="text" {...getFieldProps('username', { initialValue: '' })} placeholder="请输入用户名" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                            >
                            <Input type="password" {...getFieldProps('pass', { initialValue: '' })} placeholder="请输入密码" />
                        </FormItem>
                        <Button type="primary" size={'large'} onClick={this.handleSubmit}>提交</Button>       
                    </Form>
                </div>
                <div className="copyright">
                    <span>Copyright 2018@xxx.com</span>
                </div>
            </div>
        </div>
    }
}

export default Form.create()(Login);