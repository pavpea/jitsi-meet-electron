import { generateRoomWithoutSeparator } from '@jitsi/js-utils/random';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { SpotlightTarget } from '@atlaskit/onboarding';
import { createConferenceObjectFromURL } from '../../utils';

// 导入样式
import {
    Background,
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
    HistoryDeleteButton,
    // --- 设置界面样式 ---
    SettingsButton,
    ModalOverlay,
    ModalContent,
    ModalTitle,
    ModalField,
    ModalLabel,
    ModalInput,
    ModalButtonGroup,
    ModalButtonPrimary,
    ModalButtonSecondary,
    CheckboxLabel,
    // --- 自定义下拉菜单 ---
    DropdownContainer,
    DropdownHeader,
    DropdownList,
    DropdownItem
} from '../styled/WelcomeStyles';

// 安全获取 ipcRenderer
const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null;

const STORAGE_KEY = 'jitsiMeetingHistory';
const MAX_HISTORY_ITEMS = 8;
const DEFAULT_SERVER_URL = 'https://meeting.qiuxiaotao.cn';

class Welcome extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        t: PropTypes.func.isRequired,
        _location: PropTypes.object
    };

    inputRef = React.createRef();

    constructor(props) {
        super(props);

        let url = '';
        if (props._location && props._location.state) {
            const { room, serverURL } = props._location.state;
            if (room && serverURL) {
                url = `${serverURL}/${room}`;
            }
        }

        // 默认配置对象
        const defaultConfig = {
            enable: false,
            type: 'socks5',
            host: '127.0.0.1',
            port: '7890'
        };

        this.state = {
            url,
            isFocused: false,
            history: [],
            // --- 设置相关状态 ---
            showSettings: false,
            isDropdownOpen: false,
            proxyConfig: { ...defaultConfig },      // 【真实配置】生效的数据
            tempProxyConfig: { ...defaultConfig }   // 【临时配置】弹窗里显示和修改的数据
        };
    }

    componentDidMount() {
        this._loadHistory();
        document.body.classList.add('welcome-page-active');
        
        // --- 加载代理配置 ---
        if (ipcRenderer) {
            ipcRenderer.send('get-proxy-settings');
            ipcRenderer.on('current-proxy-settings', (event, config) => {
                // 初始化时，同时更新真实配置和临时配置，防止第一次打开弹窗数据为空
                this.setState({ 
                    proxyConfig: config,
                    tempProxyConfig: config 
                });
            });
        }
    }

    componentWillUnmount() {
        document.body.classList.remove('welcome-page-active');
        if (ipcRenderer) {
            ipcRenderer.removeAllListeners('current-proxy-settings');
        }
    }

    _onFormSubmit = event => {
        event.preventDefault();
        this._onJoin();
    }

    _onJoin = () => {
        const roomName = this.state.url;
        this._goToMeeting(roomName);
    }

    _onURLChange = event => {
        this.setState({
            url: event.target.value
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
            if (name.startsWith('http://') || name.startsWith('https://')) {
                conferenceURL = name;
            } else {
                conferenceURL = `${DEFAULT_SERVER_URL}/${name}`;
            }
            const conference = createConferenceObjectFromURL(conferenceURL);
            if (!conference) {
                console.error('Invalid conference URL:', conferenceURL);
                return false;
            }
            this.props.dispatch(push('/conference', conference));
            return true;
        }
        return false;
    }

    _handleFocus = () => {
        this.setState({ isFocused: true });
        document.body.classList.add('is-focused');
    }

    _handleBlur = () => { 
        this.setState({ isFocused: false });
        document.body.classList.remove('is-focused');
    }

    // --- 设置相关方法 (核心修改) ---

    _toggleSettings = () => {
        this.setState(prev => {
            if (!prev.showSettings) {
                // 【打开时】：把“真实配置”深度复制给“临时配置”
                return {
                    showSettings: true,
                    isDropdownOpen: false,
                    tempProxyConfig: { ...prev.proxyConfig }
                };
            } else {
                // 【关闭/取消时】：只关闭弹窗，不保存任何数据
                return {
                    showSettings: false,
                    isDropdownOpen: false
                };
            }
        });
    }

    _toggleDropdown = () => {
        // 检查的是临时配置
        if (this.state.tempProxyConfig.enable) {
            this.setState(prev => ({ isDropdownOpen: !prev.isDropdownOpen }));
        }
    }

    _handleTypeSelect = (type) => {
        this._handleProxyChange('type', type);
        this.setState({ isDropdownOpen: false });
    }

    _handleProxyChange = (field, value) => {
        // 【修改时】：只更新临时配置
        this.setState(prev => ({
            tempProxyConfig: {
                ...prev.tempProxyConfig,
                [field]: value
            }
        }));
    }

    _saveSettings = () => {
        const { tempProxyConfig } = this.state;
        if (ipcRenderer) {
            // 发送的是临时配置（即用户刚修改好的）
            ipcRenderer.send('save-proxy-settings', tempProxyConfig);
        }
        // 【保存时】：把临时配置“转正”为真实配置，并关闭弹窗
        this.setState({
            proxyConfig: tempProxyConfig,
            showSettings: false,
            isDropdownOpen: false
        });
    }

    _renderHistory() {
        const { history } = this.state;
        const { t } = this.props;

        if (history.length === 0) {
            return null;
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
                        </HistoryItemName>
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

    _renderSettingsModal() {
        // 【渲染时】：读取的是 tempProxyConfig（临时配置）
        const { tempProxyConfig, isDropdownOpen, showSettings } = this.state;

        return (
            <ModalOverlay isOpen={showSettings}>
                <ModalContent isOpen={showSettings}>
                    <ModalTitle>代理设置</ModalTitle>
                    
                    <ModalField>
                        <CheckboxLabel>
                            <span>启用代理</span>
                            <input 
                                type="checkbox" 
                                checked={tempProxyConfig.enable}
                                onChange={e => this._handleProxyChange('enable', e.target.checked)}
                            />
                        </CheckboxLabel>
                    </ModalField>

                    <ModalField style={{ zIndex: 100, position: 'relative' }}>
                        <ModalLabel>代理类型</ModalLabel>
                        <DropdownContainer>
                            <DropdownHeader 
                                onClick={this._toggleDropdown} 
                                isOpen={isDropdownOpen}
                                style={{ opacity: tempProxyConfig.enable ? 1 : 0.5, cursor: tempProxyConfig.enable ? 'pointer' : 'not-allowed' }}
                            >
                                {tempProxyConfig.type.toUpperCase()}
                            </DropdownHeader>
                            <DropdownList isOpen={isDropdownOpen}>
                                <DropdownItem 
                                    isSelected={tempProxyConfig.type === 'socks5'} 
                                    onClick={() => this._handleTypeSelect('socks5')}
                                >
                                    SOCKS5
                                </DropdownItem>
                                <DropdownItem 
                                    isSelected={tempProxyConfig.type === 'http'} 
                                    onClick={() => this._handleTypeSelect('http')}
                                >
                                    HTTP
                                </DropdownItem>
                            </DropdownList>
                        </DropdownContainer>
                    </ModalField>

                    <ModalField>
                        <ModalLabel>服务器地址 (Host)</ModalLabel>
                        <ModalInput 
                            disabled={!tempProxyConfig.enable}
                            type="text" 
                            value={tempProxyConfig.host}
                            onChange={e => this._handleProxyChange('host', e.target.value)}
                            placeholder="127.0.0.1"
                        />
                    </ModalField>

                    <ModalField>
                        <ModalLabel>端口 (Port)</ModalLabel>
                        <ModalInput 
                            disabled={!tempProxyConfig.enable}
                            type="number" 
                            value={tempProxyConfig.port}
                            onChange={e => this._handleProxyChange('port', e.target.value)}
                            placeholder="7890"
                        />
                    </ModalField>

                    <ModalButtonGroup>
                        <ModalButtonSecondary onClick={this._toggleSettings}>取消</ModalButtonSecondary>
                        <ModalButtonPrimary onClick={this._saveSettings}>保存并应用</ModalButtonPrimary>
                    </ModalButtonGroup>
                </ModalContent>
            </ModalOverlay>
        );
    }

    render() {
        const { url } = this.state;

        return (
            <HelmetProvider>
                <Background />
                
                <Wrapper>
                    <Helmet>
                        <title>秋晓桃の会议室</title>
                        <link 
                            href="https://api.hoshiroko.com/libs/fontawesome/css/all.min.css" 
                            rel="stylesheet" 
                        />
                    </Helmet>
                    
                    <Overlay />

                    {/* 【修改】图标改为 fa-globe */}
                    <SettingsButton onClick={this._toggleSettings} title="网络设置">
                        <i className="fas fa-globe"></i>
                    </SettingsButton>

                    {this._renderSettingsModal()}

                    <MainContent>
                        <InputGroup onSubmit={this._onFormSubmit}>
                            <SpotlightTarget name = 'conference-url'>
                                <StyledInput
                                    id="meetingInput"
                                    type="text"
                                    placeholder={'输入会议名称'}
                                    value={url}
                                    onChange={this._onURLChange}
                                    onKeyDown={this._onKeyDown}
                                    onFocus={this._handleFocus}
                                    onBlur={this._handleBlur}
                                    ref={this.inputRef}
                                />
                            </SpotlightTarget>
                            
                            <JoinButton id="joinButton" type="submit">
                                创建 / 加入会议
                            </JoinButton>
                        </InputGroup>

                        {this._renderHistory()}
                        
                    </MainContent>
                </Wrapper>
            </HelmetProvider>
        );
    }
}

const mapStateToProps = state => {
    return {
        _location: state.router.location
    };
};

export default compose(
    connect(mapStateToProps),
    withTranslation()
)(Welcome);