import {connect} from 'react-redux';

import Dashboard from './Dashboard';

import actions from 'common/actions/socket';

const mapStateToProps = ({logs}) => ({
	logs: logs.data,
	issues: logs.issues,
	collections: logs.collections,
	languages: logs.languages
})

const mapDispatchToProps = {
	socketSendMessage: actions.socketSendMessage,
};

export default connect(mapStateToProps)(Dashboard);