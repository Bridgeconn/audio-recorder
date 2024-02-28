import { provideVSCodeDesignSystem, vsCodeButton, vsCodeBadge } from "@vscode/webview-ui-toolkit";

// this will register the vscode button component to the design system
provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeBadge());