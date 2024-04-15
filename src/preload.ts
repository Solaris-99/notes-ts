// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('IPC', {
  send: (channel:string, arg:unknown) => ipcRenderer.send(channel, arg),
  invoke: (channel:string, arg:unknown)=> ipcRenderer.invoke(channel,arg)
})