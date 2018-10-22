import React from 'react';
import { Form, Input, Modal, Button } from 'antd';
import './login.less';

import { login } from '@/network';

const FormItem = Form.Item;
class Login extends React.PureComponent {

    state = {
        modal2Visible: false,
        errMsg: '出错了',
    };

    setModal2Visible = (flag) => {
        this.setState({
            modal2Visible: !!flag
        });
    }

    setError = (msg) => {
        this.setState({
            errMsg: msg
        });
    }

    handleSubmit = () => {
        const { getFieldsValue } = this.props.form;
        const fields = getFieldsValue();
        console.log(fields)
        
        login({
            email: fields.username,
            password: fields.password
        }).then(res => {
            console.log(res, 'rrrr')
            if (res && res.code === 0) {
                this.props.navigate('/home')
            } else {
                this.setError(res.msg);
                this.setModal2Visible(true);
            }
        });
    }

    checkPass = (rule, value, callback) => {
        callback();
    }

    render () {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const passProps = getFieldProps('password', {
            rules: [
              { required: true, whitespace: true, message: '请填写密码' },
              { validator: this.checkPass },
            ],
            onChange: (e) => {
            //   console.log('你的密码就是这样被盗的：', e.target.value);
            },
        });

        const nameProps = getFieldProps('username', {
            rules: [
              { required: true, whitespace: true, message: '请填写用户名' },
              { validator: (rule, value, callback) => {
                  if (value) {
                      if (value.length > 5) {
                          callback(true);
                      }
                  } else {
                    callback('输入用户名');
                  }
              } },
            ],
            onChange: (e) => {
            //   console.log('你的密码就是这样被盗的：', e.target.value);
            },
        });

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
                            <Input type="password" {...passProps} placeholder="请输入密码" />
                        </FormItem>
                        <Button type="primary" size={'large'} onClick={this.handleSubmit}>提交</Button>       
                    </Form>
                </div>
                <div className="copyright">
                    <span>Copyright 2018@xxx.com</span>
                </div>
            </div>
            <Modal
                title="垂直居中的对话框"
                wrapClassName="vertical-center-modal"
                visible={this.state.modal2Visible}
                onOk={() => this.setModal2Visible(false)}
                footer={<Button onClick={() => this.setModal2Visible(false)}>确定</Button>}
                // onCancel={() => this.setModal2Visible(false)}
            >
                <p>{this.state.errMsg}</p>
            </Modal>
        </div>
    }
}

export default Form.create()(Login);