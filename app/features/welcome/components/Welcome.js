import { generateRoomWithoutSeparator } from '@jitsi/js-utils/random';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';

// 修复：从 '@atlaskit/onboarding' 导入 SpotlightTarget
import { SpotlightTarget } from '@atlaskit/onboarding';
// import { Onboarding, startOnboarding } from '../../onboarding'; // --- 修复：移除首次引导 ---
import { createConferenceObjectFromURL } from '../../utils';

// 导入所有新的样式组件
import {
    Background, // --- 恢复 ---
    Wrapper,
    Overlay,
    MainContent,
    InputGroup,
    StyledInput,
    JoinButton,
    HistoryContainer,
    HistoryHeader,
    HistoryTitle,
    HistoryClearButton,
    HistoryItem,
    HistoryItemName,
    HistoryDeleteButton
    // ButtonContainer, DownloadButton, Footer, Power, Separator 已被移除
} from '../styled';

const STORAGE_KEY = 'jitsiMeetingHistory';
const MAX_HISTORY_ITEMS = 8;
const DEFAULT_SERVER_URL = 'https://meeting.qiuxiaotao.cn'; // 你的默认服务器

/**
 * Welcome Component.
 */
class Welcome extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        t: PropTypes.func.isRequired,
        _location: PropTypes.object // 接收来自 mapStateToProps 的 location
    };

    // 为原生的 <input> 元素创建 ref
    inputRef = React.createRef();

    constructor(props) {
        super(props);

        let url = '';
        // 修复：从 props._location 读取
        if (props._location && props._location.state) {
            const { room, serverURL } = props._location.state;
            if (room && serverURL) {
                url = `${serverURL}/${room}`;
            }
        }

        this.state = {
            // animateTimeoutId: undefined, // --- 移除 ---
            // generatedRoomname: '', // --- 移除 ---
            // roomPlaceholder: '', // --- 移除 ---
            // updateTimeoutId: undefined, // --- 移除 ---
            url,
            isFocused: false,
            history: []
        };
    }

    componentDidMount() {
        // this.props.dispatch(startOnboarding('welcome-page')); // --- 修复：移除首次引导 ---
        // this._updateRoomname(); // --- 移除 ---
        this._loadHistory();
        // --- 新增：当组件加载时，添加专属 class ---
        document.body.classList.add('welcome-page-active');
    }

    componentWillUnmount() {
        // this._clearTimeouts(); // --- 移除 ---
        // --- 新增：当组件卸载时，移除专属 class ---
        document.body.classList.remove('welcome-page-active');
    }

    // --- 移除：_animateRoomnameChanging ---

    // --- 移除：_clearTimeouts ---

    _onFormSubmit = event => {
        event.preventDefault();
        this._onJoin();
    }

    _onJoin = () => {
        // const roomName = this.state.url || this.state.generatedRoomname; // --- 修改 ---
        const roomName = this.state.url; // --- 修改为只使用 url ---
        const success = this._goToMeeting(roomName);

        /* --- 抖动动画已在之前移除 --- */
    }

    _onURLChange = event => {
        this.setState({
            url: event.target.value // 使用 event.target.value
        });
    }

    _onKeyDown = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this._onJoin();
        }
    }

    _saveToHistory = meetingName => {
        let history = [...this.state.history];
        history = history.filter(item => item !== meetingName);
        history.unshift(meetingName);
        history = history.slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        this.setState({ history });
    }

    _deleteFromHistory = meetingName => {
        let history = this.state.history.filter(item => item !== meetingName);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        this.setState({ history });
    }

    _clearAllHistory = () => {
        localStorage.removeItem(STORAGE_KEY);
        this.setState({ history: [] });
    }

    _loadHistory = () => {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        this.setState({ history });
    }

    _goToMeeting = meetingName => {
        const name = meetingName.trim();
        if (name) {
            this._saveToHistory(name);
            
            let conferenceURL;
            // 简单的URL检查
            if (name.startsWith('http://') || name.startsWith('https://')) {
                conferenceURL = name;
            } else {
                // 用户只输入了房间名，附加默认服务器
                conferenceURL = `${DEFAULT_SERVER_URL}/${name}`;
            }
            
            // 使用Jitsi utils来解析URL
            const conference = createConferenceObjectFromURL(conferenceURL);

            if (!conference) {
                console.error('Invalid conference URL:', conferenceURL);
                return false;
            }

            // 使用 Redux action 来导航
            this.props.dispatch(push('/conference', conference));
            return true;
        }
        return false;
    }

    _handleFocus = () => {
        this.setState({ isFocused: true });
        // --- 新增：v3 修复 ---
        document.body.classList.add('is-focused');
    }

    _handleBlur = () => { 
        this.setState({ isFocused: false });
        // --- 新增：v3 修复 ---
        document.body.classList.remove('is-focused');
    }

    // --- 移除：_updateRoomname ---

    /**
     * Renders the history list.
     *
     * @returns {ReactElement}
     */
    _renderHistory() {
        const { history } = this.state;
        const { t } = this.props;

        if (history.length === 0) {
            return null; // 如果没有历史记录，则不渲染
        }

        return (
            <HistoryContainer id="historyContainer">
                <HistoryHeader>
                    <HistoryTitle>{t('recentConferenceList', '最近的会议')}</HistoryTitle>
                    <HistoryClearButton type="button" onClick={this._clearAllHistory}>
                        {t('clearAll', '全部清除')}
                    </HistoryClearButton>
                </HistoryHeader>
                {history.map(meetingName => (
                    <HistoryItem key={meetingName}>
                        <HistoryItemName
                            onClick={() => this._goToMeeting(meetingName)}
                            title={`${t('join', '加入')}: ${meetingName}`}>
                            {meetingName}
                        </HistoryItemName> {/* <-- 拼写错误已修复 */}
                        <HistoryDeleteButton
                            type="button"
                            onClick={e => {
                                e.stopPropagation();
                                this._deleteFromHistory(meetingName);
                            }}
                            title={t('delete', '删除')}>
                            &times;
                        </HistoryDeleteButton>
                    </HistoryItem>
                ))}
            </HistoryContainer>
        );
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        // const { isFocused, url, roomPlaceholder } = this.state; // --- 修改 ---
        const { isFocused, url } = this.state; // --- 移除 roomPlaceholder ---
        const { t } = this.props;

        // 根据 isFocused 状态动态设置 body class
        // --- v3 修复：这个逻辑移到 _handleFocus 和 _handleBlur 中 ---
        // document.body.classList.toggle('is-focused', isFocused); 

        return (
            // HelmetProvider 是必须的
            <HelmetProvider>
                {/* --- 修复：移除 GlobalStyle 组件，因为它现在是 v3 的 injectGlobal --- */}
                <Background /> {/* --- 恢复 --- */}
                
                <Wrapper>
                    <Helmet>
                        <title>秋晓桃の会议室</title>
                        {/* 动态加载 FontAwesome CSS */}
                        <link 
                            href="https://api.hoshiroko.com/libs/fontawesome/css/all.min.css" 
                            rel="stylesheet" 
                        />
                    </Helmet>
                    
                    <Overlay />
                    <MainContent>
                        
                        <InputGroup onSubmit={this._onFormSubmit}>
                            {/* SpotlightTarget 是 Jitsi 教程系统的一部分，我们保留它 */}
                            <SpotlightTarget name = 'conference-url'>
                                <StyledInput
                                    id="meetingInput"
                                    type="text"
                                    // placeholder={roomPlaceholder || t('enterConferenceNameOrUrl', '输入会议名称')} // --- 修改 ---
                                    // placeholder={t('enterConferenceNameOrUrl', '输入会议名称')} // --- 修改为固定 placeholder ---
                                    placeholder={'输入会议名称'} // --- 修复：硬编码 placeholder， 移除 t() 函数 ---
                                    value={url}
                                    onChange={this._onURLChange}
                                    onKeyDown={this._onKeyDown}
                                    onFocus={this._handleFocus}
                                    onBlur={this._handleBlur}
                                    ref={this.inputRef}
                                    // autoFocus={true} // --- 修复：移除自动聚焦 ---
                                />
                            </SpotlightTarget>
                            
                            {/* 修复：使用 </JoinButton> 闭合标签 */}
                            <JoinButton id="joinButton" type="submit">
                                {/* {t('go', '创建 / 加入会议')} // --- 修复：硬编码 --- */}
                                创建 / 加入会议
                            </JoinButton>
                        </InputGroup>

                        {/* 渲染历史记录 */}
                        {this._renderHistory()}

                        {/* 下载按钮和页脚已根据你的要求移除 */}
                        
                    </MainContent>

                    {/* <Onboarding section = 'welcome-page' /> */} {/* --- 修复：移除首次引导 --- */}
                </Wrapper>
            </HelmetProvider>
        );
    }
}

// 确保 connect 能接收到 state
const mapStateToProps = state => {
    return {
        _location: state.router.location
    };
};

export default compose(
    connect(mapStateToProps),
    withTranslation()
)(Welcome);