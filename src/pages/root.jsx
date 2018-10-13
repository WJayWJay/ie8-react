import {Link} from 'router'

import './root.less';

const Root = props => (
    <div className="container">
        <h2>navigation</h2>
        <div>
            <p>
                <Link to="/">home</Link>
            </p>
            <p>
                <Link to="/login">login</Link>
            </p>
        </div>
        <div>
            {props.children}
        </div>
    </div>
)
export default Root;