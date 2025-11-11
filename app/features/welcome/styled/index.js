// 从 WelcomeStyles.js 导出所有样式组件
export {
    // --- 修复：GlobalStyle 不再导出 ---
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
    HistoryDeleteButton,
    ButtonContainer,
    DownloadButton,
    Footer,
    Power,
    Separator,
    
    // 导出空组件以实现兼容
    Body,
    FieldWrapper,
    Form,
    Header,
    Label
} from './WelcomeStyles';