import {connect} from 'react-redux';

import Dashboard from './Dashboard';

import actions from 'common/actions/socket';

const mapStateToProps = state => ({
	logs: state.logs.data
})

const mapDispatchToProps = {
	socketSendMessage: actions.socketSendMessage,
};

export default connect(mapStateToProps)(Dashboard);