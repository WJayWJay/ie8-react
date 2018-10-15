import {Link} from 'router'

import './root.less';

const Root = props => (
    <div className="container">
        <div>
            {props.children}
        </div>
    </div>
)
export default Root;