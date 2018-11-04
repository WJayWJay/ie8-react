import { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import { chunk } from 'lodash';
import constant from '@/constant/index';

import { timeFormat, areaFormat } from '@/util/util';

import '@/styles/list-card.less';

class Index extends PureComponent {


    componentWillReceiveProps(newProps, oldProps) {

    }

    computeType1(val, alias) {
        if (!alias || !val) {
            return '';
        }
        let data = val[alias];
        let res = data && data['value'] || '';
        return res || '';
    }
    computeRatio(val, alias) {
        if (!alias || !val) {
            return '';
        }
        let data = val[alias];
        let res = data && data['value'] || '';
        return res || '';
    }
    computeDate(val, alias) {
        if (!alias || !val) {
            return '';
        }
        let data = val[alias];
        let res = data && data['value'] || '';
        res = timeFormat(res);
        return res || '';
    }
    computeArea(val, alias) {
        if (!alias || !val) {
            return '';
        }
        let data = val[alias];
        let res = data && data['value'] || '';
        res = areaFormat(res);
        return res || '';
    }
    computeImageVal(val, alias) {
        console.log(val, alias, 'computeImageVal')
        if (!alias || !val) {
            return '';
        }
        let data = val[alias];
        let res = data['url'];
        if (!res) return '';
        return constant.cdn + res;
    }
    
    renderLine = (prop, val) => {
        const type = prop.type;
        const name = prop.projectName;
        let alias = prop.proAliasName;
        let value = '';
        switch (type) {
            case 1: 
                value = this.computeType1(val, alias);
                break;
            case 2: 
                value = this.computeRatio(val, alias);
                break;
            case 3: 
                value = this.computeDate(val, alias);
                break;
            case 4: 
                value = this.computeArea(val, alias);
                break;
            default:
                value = '';
                break;
        }


        return (
            <div className={'line-container'}>
                <div className={'inline-block left-prop-and-val'} style={{ width: '50%'}}>
                    <div className={'inline-block inline-border-wrap'} style={{ width: '50%'}}>
                        {name}
                    </div>
                    <div className={'inline-block inline-border-wrap value-for-line'} style={{ width: '50%',}}>
                        {value}
                    </div>
                </div>
                <div className={'inline-block'} style={{ width: '50%'}}>
                    {/* <div className={'inline-block inline-border-wrap'} style={{ width: '48%'}}>property1</div>
                    <div className={'inline-block inline-border-wrap'} style={{ width: '48%'}}>value1</div> */}
                </div>
            </div>
        )
    }

    render4Line = (prop, val, index) => {
        const type = prop.type;
        const name = prop.projectName;
        let alias = prop.proAliasName;
        let value = '';
        switch (type) {
            case 1: 
                value = this.computeType1(val, alias);
                break;
            case 2: 
                value = this.computeRatio(val, alias);
                break;
            case 3: 
                value = this.computeDate(val, alias);
                break;
            case 4: 
                value = this.computeArea(val, alias);
                break;
            default:
                value = '';
                break;
        }
        return (
                <div className={'inline-block'} style={{ width: '50%'}}>
                    <div className={'inline-block inline-border-wrap '} style={{ width: '50%', borderRight: 'none', borderTop: index % 2 == 0 ? 'none' : ''}}>
                        {name}
                    </div>
                    <div className={'inline-block inline-border-wrap value-for-line '} style={{ width: '50%', borderTop: index % 2 == 0 ? 'none' : ''}}>
                        {value || ''}
                    </div>
                </div>
        )
    }

    renderSingleImage = (imgProp, val) => {
        console.log(imgProp, 'img')
        if (!imgProp || !val) return null;
        const name = imgProp.projectName;
        let alias = imgProp.proAliasName;
        let value = this.computeImageVal(val, alias);

        return (
            <div className={'single-img-container'}>
                <div className={'inner-img-wrap'}>
                    <div className={'img-wrap'}>
                        {value ? <img style={{maxHeight: '110px', maxWidth: '200px'}} alt={name} src={value} /> : '未上传图片'}
                    </div>
                </div>
            </div>
        );
    }

    renderCol = (item, index) => {
        const { columns } = this.props;

        const images = columns.find(item => item && item.type === 5);
        let newColumnes = columns.filter(i => i && i.type !== 5);
        let four = newColumnes.slice(0, 4);
        let other = newColumnes.slice(4);

        return (
            <Col span="12">
                <Card  bordered={false}>
                    <div className={'card-container-inner'}>
                        <div className={'four-line-container'}>
                            {/* 第一行 */}
                            {four.map(i => {
                                return (
                                    this.renderLine(i, item)
                                )
                            })
                            }
                            {
                                this.renderSingleImage(images, item)
                            }
                        </div>

                        <div>
                            {
                                other.map((i, index) => {
                                    return (
                                        this.render4Line(i, item, index)
                                    )
                                })
                            }

                        </div>
                    </div>
                </Card>
            </Col>
        );
    }

    renderRow = (item) => {
        
        return (
            <Row style={{marginBottom: '15px'}}>
                {
                    item.map((i, k) => {
                        return this.renderCol(i, k)
                    })
                }
            </Row>
        );
    }

    render() {
        const { dataSource, columns } = this.props; 
        console.log(dataSource, columns)
        let data = [];
        if (dataSource.length > 0) {
            data = chunk(dataSource, 2);
        }
        console.log(data, 'mydadada')
        return (
            <div className={'list-card-box'} style={{ background: '#ECECEC', padding: '10px' }}>
                {
                    data.map(i => {
                        return this.renderRow(i)
                    })
                }


                {/* <Row>
                    <Col span="8">
                        <Card title="Card title" bordered={false}>Card content</Card>
                    </Col>
                    <Col span="8">
                        <Card title="Card title" bordered={false}>Card content</Card>
                    </Col>
                    <Col span="8">
                        <Card title="Card title" bordered={false}>Card content</Card>
                    </Col>
                </Row> */}
            </div>
        );
    }
}

export default Index;