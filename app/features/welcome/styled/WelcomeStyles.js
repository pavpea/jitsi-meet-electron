import styled, { injectGlobal, keyframes, css } from 'styled-components';
// 【修改】引入本地背景图片
import bgImage from '../../../images/background.jpg';

const transitionSpeed = '0.5s';

// --- 动画定义 ---
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const slideUp = keyframes`
    from { 
        opacity: 0; 
        transform: translateY(40px) scale(0.95); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
    }
`;

// --- 全局样式 ---
injectGlobal`
    :root {
        --text-color: #ffffff;
        --text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        
        /* 设置弹窗变量 (黑白极简风格) */
        --glass-border: 1px solid rgba(255, 255, 255, 0.1);
        --glass-bg: rgba(18, 18, 18, 0.95);
        --glass-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        --accent-color: #ffffff;
    }

    html, body, #app, #react, #react > div {
        height: 100% !important;
        margin: 0;
        padding: 0;
        font-family: 'Poppins', Arial, sans-serif;
    }

    body.welcome-page-active {
        overflow: hidden !important;
        background: transparent !important;
    }

    body.welcome-page-active #react,
    body.welcome-page-active #react > div {
        background: transparent !important;
    }
`;

// --- 基础组件 ---

export const Background = styled.div`
    position: fixed;
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    z-index: 0;
    /* 【修改】使用本地变量 ${bgImage} */
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bgImage}) no-repeat center center;
    background-size: cover;
    transition: filter ${transitionSpeed} ease-out, transform ${transitionSpeed} ease-out;
    
    body.is-focused & {
        filter: blur(15px);
        transform: scale(1.05);
    }
`;

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-color);
    position: relative;
    z-index: 1;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
`;

export const Overlay = styled.div`
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color ${transitionSpeed} ease-out;
    pointer-events: none;

    body.is-focused & {
        background-color: rgba(0, 0, 0, 0.4); /* 稍微加深遮罩 */
    }
`;

export const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 450px;
    z-index: 1;
    margin-top: auto; 
    margin-bottom: auto; 

    @media (max-width: 480px) {
        width: 95%;
        margin-top: 5vh; 
    }
`;

export const InputGroup = styled.form` 
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const StyledInput = styled.input`
    width: 300px;
    height: 50px;
    padding: 0 25px;
    font-size: 16px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    color: var(--text-color);
    outline: none;
    transition: all ${transitionSpeed} cubic-bezier(0.25, 0.8, 0.25, 1);
    margin-bottom: 20px;
    box-sizing: border-box;
    font-family: 'Poppins', Arial, sans-serif;

    &::placeholder {
        color: rgba(255, 255, 255, 0.75);
        opacity: 1;
        transition: color 0.3s ease;
    }

    /* 输入状态：变宽、背景加深、边框变亮、发光 */
    body.is-focused & {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5); 
        border-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
        color: #ffffff;

        /* 聚焦时隐藏提示文字 */
        &::placeholder {
            color: transparent;
        }
    }
`;

export const JoinButton = styled.button`
    width: 200px;
    height: 50px;
    border: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-family: 'Poppins', Arial, sans-serif;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 0;

    &:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.03);
    }
`;

// --- 历史记录 ---

export const HistoryContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 25px;
    max-height: 40vh; 
    overflow-y: auto;
    padding: 0 2px;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

export const HistoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
`;

export const HistoryTitle = styled.h3`
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    text-shadow: var(--text-shadow);
    margin: 0 0 0 5px;
`;

// 【修改】优化后的全部清除按钮
export const HistoryClearButton = styled.button`
    /* 默认模式（深色背景） */
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    cursor: pointer;
    padding: 4px 12px;
    text-decoration: none;
    transition: all 0.2s ease;
    font-family: 'Poppins', Arial, sans-serif;

    &:hover {
        background-color: #ffffff;
        color: #000000;
        border-color: #ffffff;
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
        transform: scale(1.05);
    }
    
    /* 输入模式（浅色背景） */
    body.is-focused & {
        background-color: transparent;
        color: rgba(255, 255, 255, 0.6);
        border-color: rgba(255, 255, 255, 0.1);
        text-shadow: none;
        
        &:hover {
            background-color: #ffffff; 
            color: #333;
            border-color: #ffffff;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }
    }
`;

// 【修改】历史记录项：输入状态保持深色风格
export const HistoryItem = styled.div`
    position: relative;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    border: 1px solid rgba(255, 255, 255, 0.1); 
    
    border-radius: 10px; 
    padding: 12px 15px;
    color: var(--text-color);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    font-size: 15px;
    word-break: break-all;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    /* 左侧指示条 */
    &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 50%;
        transform: translateY(-50%) scaleY(0); 
        height: 20px; 
        width: 4px;
        border-radius: 2px;
        background-color: #ffffff;
        transition: transform 0.2s ease, background-color 0.2s ease;
    }

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        padding-left: 24px; /* 悬停右移 */
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        
        &::before {
            transform: translateY(-50%) scaleY(1); 
        }
    }
    
    /* 输入状态：保持深色，只是稍微调整透明度以适应深色遮罩 */
    body.is-focused & {
        background-color: rgba(0, 0, 0, 0.4); /* 加深背景，使其在遮罩上更清晰 */
        border-color: rgba(255, 255, 255, 0.15);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        
        /* 保持白色高亮条 */
        &::before {
            background-color: #ffffff; 
        }
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
            padding-left: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    }
`;

export const HistoryItemName = styled.span`
    flex-grow: 1;
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
`;

export const HistoryDeleteButton = styled.button`
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    cursor: pointer;
    padding: 0 0 0 10px;
    opacity: 0.7;
    transition: all 0.2s ease;
    flex-shrink: 0; 
    
    &:hover {
        opacity: 1;
        color: #fff;
    }
    
    body.is-focused & {
        color: rgba(255, 255, 255, 0.6);
        &:hover {
            color: #ff4757;
        }
    }
`;

// --- 设置界面 ---

export const SettingsButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(360deg);
        border-color: rgba(255, 255, 255, 0.4);
    }

    body.is-focused & {
        /* 输入时稍微降低干扰，但不改变颜色 */
        opacity: 0.5; 
        &:hover { opacity: 1; }
    }
`;

// ... (Modal 组件保持不变) ...
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    opacity: ${props => props.isOpen ? 1 : 0};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
`;

export const ModalContent = styled.div`
    background: var(--glass-bg);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: var(--glass-shadow);
    width: 360px;
    border-radius: 16px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: white;
    transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)'};
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
`;

export const ModalTitle = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 0.5px;
    margin-bottom: 10px;
`;

export const ModalField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const ModalLabel = styled.label`
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin-left: 2px;
    font-weight: 500;
    text-transform: uppercase; 
    letter-spacing: 0.5px;
`;

export const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: space-between; 
    gap: 15px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    user-select: none;
    padding: 16px;
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    transition: all 0.2s;
    &:hover {
        background: rgba(255,255,255,0.06);
        border-color: rgba(255,255,255,0.1);
    }
    input {
        appearance: none;
        width: 48px;
        height: 28px;
        background: rgba(255,255,255,0.15);
        border-radius: 28px;
        position: relative;
        cursor: pointer;
        transition: background 0.3s ease, box-shadow 0.3s ease;
        outline: none;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
        &::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 22px;
            height: 22px;
            background: #e0e0e0;
            border-radius: 50%;
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), background 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        &:checked {
            background: #ffffff;
            box-shadow: 0 0 10px rgba(255,255,255,0.2);
        }
        &:checked::after {
            transform: translateX(20px);
            background: #1a1a1a;
        }
    }
`;

export const ModalInput = styled.input`
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 14px 16px;
    color: white;
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;
    font-family: inherit;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
    &:focus {
        background: rgba(0, 0, 0, 0.6);
        border-color: rgba(255, 255, 255, 0.6);
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
    }
    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

export const ModalButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    gap: 15px;
`;

export const ModalButtonPrimary = styled.button`
    background: #ffffff;
    color: #000000;
    border: none;
    padding: 14px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    flex: 1;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
    &:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
    }
    &:active {
        transform: translateY(0);
        background: #d0d0d0;
    }
`;

export const ModalButtonSecondary = styled.button`
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 14px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    font-size: 15px;
    flex: 1;
    transition: all 0.2s ease;
    &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
    }
`;

export const DropdownContainer = styled.div`
    position: relative;
    width: 100%;
    font-family: 'Poppins', Arial, sans-serif;
    box-sizing: border-box; 
`;

export const DropdownHeader = styled.div`
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 14px 16px;
    color: white;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    user-select: none;
    box-sizing: border-box;
    &:hover {
        background: rgba(0, 0, 0, 0.6);
        border-color: rgba(255, 255, 255, 0.3);
    }
    &::after {
        content: '';
        border: solid white;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        transform: ${props => props.isOpen ? 'rotate(-135deg)' : 'rotate(45deg)'};
        transition: transform 0.3s ease;
        margin-top: ${props => props.isOpen ? '4px' : '-2px'};
    }
`;

export const DropdownList = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    background: #111111; 
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 6px;
    z-index: 20; 
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-sizing: border-box;
    opacity: ${props => props.isOpen ? 1 : 0};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
`;

export const DropdownItem = styled.div`
    padding: 12px 16px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    margin: 0 4px;
    box-sizing: border-box;
    background: ${props => props.isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
    color: ${props => props.isSelected ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
    font-weight: ${props => props.isSelected ? '600' : '400'};
    ${DropdownList}:hover & {
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
    }
    &:hover {
        background: #ffffff !important;
        color: #000000 !important;
        transform: translateX(2px);
    }
`;

// 移除的组件
export const ButtonContainer = styled.div`display: none;`;
export const DownloadButton = styled.a`display: none;`;
export const Footer = styled.footer`display: none;`;
export const Power = styled.div`display: none;`;
export const Separator = styled.span`display: none;`;
export const Body = styled.div``;
export const FieldWrapper = styled.div``;
export const Form = styled.form``;
export const Header = styled.div``;
export const Label = styled.span``;