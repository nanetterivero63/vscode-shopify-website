import * as vscode from "vscode";

import { Configuration } from "./configuration";
import { Setting } from "./setting";

export async function activate(context: vscode.ExtensionContext) {
  const configuration = new Configuration(vscode.workspace, context);

  if (vscode.extensions.getExtension("rebornix.ruby")) {
    showRebornixDeprecationWarning(configuration);
  }

  configuration.applyDefaults();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rubyExtensionsPack.forceApplyDefaults",
      () => configuration.applyDefaults(true)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("rubyExtensionsPack.clearState", () =>
      configuration.clearState()
    )
  );
}

export function deactivate() {}

export const DEPRECATED_REBORNIX_RUBY_CONFIG = [
  { section: "ruby", name: "useBundler", value: undefined },
  { section: "ruby", name: "useLanguageServer", value: undefined },
  { section: "ruby", name: "lint", value: undefined },
  { section: "ruby", name: "codeCompletion", value: undefined },
  { section: "ruby", name: "intellisense", value: undefined },
  { section: "ruby", name: "format", value: undefined },
];

// TODO: This function and surrounding code should be
// removed in the next version after rebornix.ruby is deprecated
export async function showRebornixDeprecationWarning(
  configuration: Configuration
): Promise<void> {
  const response = await vscode.window.showWarningMessage(
    "The rebornix-ruby plugin is deprecated - remove any custom configurations for the plugin from your settings.",
    "Remove configurations"
  );

  if (response === "Remove configurations") {
    configuration.settings = DEPRECATED_REBORNIX_RUBY_CONFIG.map(
      (config) =>
        new Setting(
          configuration.context,
          configuration.configurationStore,
          config.section,
          config.name,
          undefined,
          undefined
        )
    );
    configuration.settings.forEach((setting) => setting.update());
  }
}
