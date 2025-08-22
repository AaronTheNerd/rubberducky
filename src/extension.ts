import * as vscode from 'vscode';
import { BASE_PROMPT } from './prompt';

export function activate(context: vscode.ExtensionContext) {
  const ducky = vscode.chat.createChatParticipant('rubber-ducky', handler);
  ducky.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'duck-icon.svg');
}

async function handler(
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<void> {
  let prompt = BASE_PROMPT;
  const messages = [vscode.LanguageModelChatMessage.User(prompt)];
  messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
  const chatResponse = await request.model.sendRequest(messages, {}, token);
  for await (const fragment of chatResponse.text) {
    stream.markdown(fragment);
  }
  return;
}

export function deactivate() {}
