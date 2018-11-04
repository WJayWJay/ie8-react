import { Spin, Modal } from 'antd';
import { Component } from 'react';

class Confirm extends Component {

    render () {
        const props = this.props;

        return (
                props.show ? 
                <Modal
                    title={props.title || '请确认'}
                    wrapClassName="vertical-center-modal"
                    closable={false}
                    visible={props.show}
                    onCancel={() => this.setInfoListLoading(false)}
                    footer={null}
                    width={300}
                >

                </Modal> : null
        );
    }
}

export default  Loading;