import { Spin } from 'antd';

const Loading = (props) => {

    return (
            props.loading ? <div style={{textAlign: 'center', lineHeight: '30px;', padding: '20px'}}>
                <Spin size={'large'} /><span>数据加载中...</span>
            </div> : null
    );
}

export default  Loading;