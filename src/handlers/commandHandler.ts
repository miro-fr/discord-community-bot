import { Command, CommandContext } from '../types';
import { checkPermissions } from './permissionHandler';

// A simple command dispatcher used by messageCreate event.
export const handleCommand = async (commandName: string | undefined, args: string[], context: CommandContext) => {
    if (!commandName) return;

    // In this simplified project commands are files under src/commands; attempt dynamic import
    try {
        const cmdModule = await import(`../commands/${commandName}`);
        const command: Command = cmdModule.default || cmdModule;

        const requiredLevel = (command as any).requiredPermissionLevel || 1; // default USER
        const ok = checkPermissions(context, requiredLevel);
        if (!ok) {
            console.log(`User ${context.user.username} lacks permission for ${commandName}`);
            return;
        }

        await command.execute(args, context);
    } catch (err) {
        // command not found or execution error
        // swallow "module not found" quietly
        if ((err as any).code === 'MODULE_NOT_FOUND') return;
        console.error(`Error handling command ${commandName}:`, err);
    }
};

export default handleCommand;