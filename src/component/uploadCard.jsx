import { PureComponent } from 'react';
import { Form, Input, Button, Select, Upload, Icon, Message } from 'antd';

import constant from '@/constant/index';

const FormItem = Form.Item;


class Index extends PureComponent {

    checkPass(rule, value, callback) {
        callback();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, submit } = this.props;
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
        
        const props = {
            name: 'uploadExcel',
            action: constant.uploadExcel,
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
                console.log(info, 'upload')
            //   if (info.file.status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            //   }
            //   if (info.file.status === 'done') {
            //     Message.success(`${info.file.name} 上传成功。`);
            //   } else if (info.file.status === 'error') {
            //     Message.error(`${info.file.name} 上传失败。`);
            //   }
            },
        };
        
        
        return (
            <div>
                <Form horizontal 
                    onSubmit={this.handleSubmit}
                >
                    
                    <Upload {...props}>
                        <Button type="ghost">
                            <Icon type="upload" /> 点击上传
                        </Button>
                    </Upload>

                </Form>
            </div>
        );
    }

}

export default Form.create()(Index)
