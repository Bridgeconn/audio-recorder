// // ------------------------------------ MSG TYPE From Extension to Webview ------------------------

// // import { versificationData } from "./navigationView";

// // Type of messages from Extension to Webview
// const ExtMessageType = {
//     Info: "info",
//     Prepare: "prepare",
//     Data: "data",
//     Reload: "reload",
// } as const;

// export type ExtMessageType = typeof ExtMessageType[keyof typeof ExtMessageType];

// // export type ExtMessage = ExtInfoMessage | ExtPrepareMessage | ExtDataMessage | ExtReloadMessage;

// export interface ExtInfoData {
//     isTrusted?: boolean;
// }

// // export class ExtInfoMessage {
// //     type = ExtMessageType.Info;
// //     data: ExtInfoData;
// // }

// export interface ExtPrepareData {

// }

// // export class ExtPrepareMessage {
// //     type = ExtMessageType.Prepare;
// //     data: ExtPrepareData;
// // }

// export interface ExtDataData {

// }

// // export class ExtDataMessage {
// //     type = ExtMessageType.Data;
// //     data: ExtDataData ;
// //     // data: ExtDataData | versificationData;
// // }

// export class ExtReloadMessage {
//     type = ExtMessageType.Reload;
// }

// // ------------------------------------ MSG TYPE From Webview to Extension ------------------------

// // Type of messages from Webview to Extension
// const WebviewMessageType = {
//     Ready: "ready",
//     Prepare: "prepare",
//     Data: "data",
//     Error: "error",
// } as const;

// export type WebviewMessageType = typeof WebviewMessageType[keyof typeof WebviewMessageType];

// // export type WebviewMessage = WebviewReadyMessage | WebviewPrepareMessage | WebviewDataMessage |  WebviewErrorMessage;

// export class WebviewReadyMessage {
//     type = WebviewMessageType.Ready;
// }

// export class WebviewPrepareMessage {
//     type = WebviewMessageType.Prepare;
// }

// export interface WebviewDataData {

// }

// // export class WebviewDataMessage {
// //     type = WebviewMessageType.Data;
// //     data: WebviewDataData;
// // }

// export interface WebviewErrorData {
//     message: string;
// }

// // export class WebviewErrorMessage {
// //     type = WebviewMessageType.Error;
// //     data: WebviewErrorData;
// // }

// // Type of post message funtion
// export type postMessage = (message: WebviewMessage) => void;
