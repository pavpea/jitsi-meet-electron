import styled, { injectGlobal } from 'styled-components'; // --- 修复：改回 injectGlobal ---

// 变量
const transitionSpeed = '0.5s';

// 全局样式 (v3 API)
// --- 修复：injectGlobal 是一个函数调用，不是组件 ---
injectGlobal`
    :root {
        --text-color: #ffffff;
        --text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    }

    /* 抖动动画已在之前移除 */

    /* 确保 body 充满屏幕 */
    html, body, #app, #react, #react > div {
        height: 100% !important;
        margin: 0;
        padding: 0;
        font-family: 'Poppins', Arial, sans-serif;
    }

    /* --- 修复：只在 welcome 页面激活时才应用透明背景 --- */
    body.welcome-page-active {
        overflow: hidden !important; /* 隐藏 body 的滚动条 */
        background: transparent !important;
    }

    body.welcome-page-active #react,
    body.welcome-page-active #react > div {
        background: transparent !important;
    }
`;

/* --- 新增：背景组件 --- */
export const Background = styled.div`
    position: fixed;
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    z-index: 0; /* --- 修复：z-index 0 --- */
    
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('https://qiuxiaotao.cn/background.jpg') no-repeat center center;
    
    background-size: cover;
    transition: filter ${transitionSpeed} ease-out, transform ${transitionSpeed} ease-out;
    
    /* 根据 body.is-focused 改变样式 */
    body.is-focused & {
        filter: blur(15px);
        transform: scale(1.05);
    }
`;


// Wrapper (对应 body)
export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-color);
    position: relative;
    z-index: 1; /* --- 修复：z-index 1，确保在 Background 之上 --- */
    overflow: auto; /* 允许内容在需要时滚动，而不是隐藏 */
    box-sizing: border-box;
    padding: 20px; /* 为小屏幕添加一些padding */

    /* --- 移除：临时的背景色 --- */
    /* background: #525252; */
    color: var(--text-color); /* --- 恢复：使用 CSS 变量 --- */


    /* * body.is-focused 样式现在由 React state 在 Wrapper 上 
     * 通过 props.isFocused 控制
     *
     * ^^^ 之前的注释是错的。我们现在改为完全依赖 body.is-focused
     */
`;

// 遮罩层
export const Overlay = styled.div`
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    /* 遮罩层也应该响应 body.is-focused */
    background-color: rgba(0, 0, 0, 0);
    transition: background-color ${transitionSpeed} ease-out;
    pointer-events: none; /* 允许点击穿透 */
    /* z-index: 0;  --- 移除：这个应该在 Wrapper (z-index: 1) 内部，不需要 z-index --- */

    body.is-focused & {
        background-color: rgba(0, 0, 0, 0.3);
    }
`;

// 主内容容器
export const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 450px;
    z-index: 1; /* --- 移除：不需要，因为 Overlay 的 z-index 也移除了 --- */
    margin-top: auto; 
    margin-bottom: auto; 

    @media (max-width: 480px) {
        width: 95%;
        margin-top: 5vh; 
    }
`;

// 输入框和按钮的组合 (使用 <form> 标签)
export const InputGroup = styled.form` 
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

// 自定义输入框 (基于原生 <input>)
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
    transition: all ${transitionSpeed} ease;
    margin-bottom: 20px;
    box-sizing: border-box;
    font-family: 'Poppins', Arial, sans-serif; /* 确保字体一致 */

    &::placeholder {
        color: rgba(255, 255, 255, 0.75);
        opacity: 1;
    }

    /* --- 修复：确保这里也使用 body.is-focused --- */
    body.is-focused & {
        background-color: rgba(255, 255, 255, 1);
        color: #2c3e50;
        width: 100%;

        &::placeholder {
            color: #7f8c8d;
        }
    }
`;

// 自定义加入按钮 (基于原生 <button>)
export const JoinButton = styled.button`
    width: 200px;
    height: 50px;
    border: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-family: 'Poppins', Arial, sans-serif; /* 确保字体一致 */
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

// 历史记录容器
export const HistoryContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 25px;
    max-height: 40vh; 
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.3);
        border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

export const HistoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const HistoryTitle = styled.h3`
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    text-shadow: var(--text-shadow);
    margin: 0 0 0 5px;
`;

export const HistoryClearButton = styled.button`
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 12px;
    cursor: pointer;
    padding: 4px 12px;
    text-decoration: none;
    opacity: 0.8;
    transition: all 0.3s ease;
    font-family: 'Poppins', Arial, sans-serif; /* 确保字体一致 */

    &:hover {
        background-color: rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 255, 255, 0.2);
        opacity: 1;
    }
    
    /* --- 修复：确保这里也使用 body.is-focused --- */
    body.is-focused & {
        background-color: rgba(255, 255, 255, 0.8);
        color: #333;
        border-color: rgba(255, 255, 255, 0);
        text-shadow: none;
    }
`;

export const HistoryItem = styled.div`
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 10px 15px;
    color: var(--text-color);
    transition: all 0.3s ease;
    font-size: 15px;
    word-break: break-all;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    &:hover {
        background-color: rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 255, 255, 0.3);
    }
    
    /* --- 修复：确保这里也使用 body.is-focused --- */
    body.is-focused & {
        background-color: rgba(255, 255, 255, 0.8);
        color: #333;
        border-color: rgba(255, 255, 255, 0);
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
    color: var(--text-color);
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    cursor: pointer;
    padding: 0 0 0 10px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    flex-shrink: 0; 
    
    &:hover {
        opacity: 1;
    }
    
    /* --- 修复：确保这里也使用 body.is-focused --- */
    body.is-focused & {
        color: #555;
    }
`;

// 移除的组件
export const ButtonContainer = styled.div`display: none;`;
export const DownloadButton = styled.a`display: none;`;
export const Footer = styled.footer`display: none;`;
export const Power = styled.div`display: none;`;
export const Separator = styled.span`display: none;`;

// 导出空的旧组件，以防 App.js 之外的其他地方还在导入它们（虽然不太可能）
export const Body = styled.div``;
export const FieldWrapper = styled.div``;
export const Form = styled.form``;
export const Header = styled.div``;
export const Label = styled.span``;